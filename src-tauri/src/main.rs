
use std::{
    fs::{self, File, OpenOptions},
    io::Write,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

use serde::Serialize;
use tauri::{command, State};
use std::sync::{Arc, Mutex};
use dirs; 


struct ShellState {
    cwd: String,
}


#[command]
fn run_command(full: String, state: State<'_, Arc<Mutex<ShellState>>>) -> Result<String, String> {
    let mut shell = state.lock().unwrap();

    // Split input string into command + args
    let parts: Vec<&str> = full.split_whitespace().collect();
    if parts.is_empty() {
        return Ok("".into());
    }

    let command = parts[0];
    let args: Vec<&str> = parts[1..].to_vec();


    if command == "cd" {
        let target = args.get(0).copied().unwrap_or("");

        let new_path = if target.is_empty() {
            dirs::home_dir().unwrap()
        } else if target == ".." {
            PathBuf::from(&shell.cwd)
                .parent()
                .unwrap_or(Path::new(&shell.cwd))
                .to_path_buf()
        } else {
            PathBuf::from(&shell.cwd).join(target)
        };

        if new_path.exists() && new_path.is_dir() {
            shell.cwd = new_path.to_string_lossy().to_string();
            return Ok(shell.cwd.clone());
        } else {
            return Err(format!("cd: no such directory: {}", target));
        }
    }

   
 
    let output = Command::new("zsh")
        .arg("-c")
        .arg(full) // run full command
        .current_dir(&shell.cwd)
        .output()
        .map_err(|e| e.to_string())?;

    let mut result = String::new();
    result.push_str(&String::from_utf8_lossy(&output.stdout));
    result.push_str(&String::from_utf8_lossy(&output.stderr));

    Ok(result.trim().to_string())
}


#[derive(Serialize)]
struct ProjectResult {
    success: bool,
    path: String,
    message: String,
}

#[command]
fn create_esp_idf_project(project_name: &str) -> tauri::Result<ProjectResult> {
    let project_path = Path::new("/Users/manojseetaramgowda/Desktop").join(project_name);

    if project_path.exists() {
        return Ok(ProjectResult {
            success: false,
            path: project_path.display().to_string(),
            message: "Project already exists".to_string(),
        });
    }

    let status = Command::new("/Users/manojseetaramgowda/Desktop/esp/esp-idf/tools/idf.py")
        .arg("create-project")
        .arg(project_name)
        .current_dir("/Users/manojseetaramgowda/Desktop")
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .status()?;

    if status.success() {
        Ok(ProjectResult {
            success: true,
            path: project_path.display().to_string(),
            message: "Project created".to_string(),
        })
    } else {
        Ok(ProjectResult {
            success: false,
            path: "none".to_string(),
            message: "Failed to create project".to_string(),
        })
    }
}


#[derive(Debug, Serialize)]
pub struct FileNode {
    pub id: String,
    pub name: String,
    pub r#type: String,
    pub content: Option<String>,
    pub children: Option<Vec<FileNode>>,
    pub folder_name: String,
}

fn read_dir_recursive(path: &Path, folder_name: &str) -> std::io::Result<Vec<FileNode>> {
    let mut nodes = Vec::new();

    for entry in fs::read_dir(path)? {
        let entry = entry?;
        let metadata = entry.metadata()?;
        let file_name = entry.file_name().into_string().unwrap_or_default();

        if metadata.is_dir() {
            let children = read_dir_recursive(&entry.path(), folder_name)?;
            nodes.push(FileNode {
                id: entry.path().to_string_lossy().to_string(),
                name: file_name,
                r#type: "folder".to_string(),
                content: None,
                children: Some(children),
                folder_name: folder_name.to_string(),
            });
        } else {
            let content = fs::read_to_string(&entry.path()).unwrap_or_default();
            nodes.push(FileNode {
                id: entry.path().to_string_lossy().to_string(),
                name: file_name,
                r#type: "file".to_string(),
                content: Some(content),
                children: None,
                folder_name: folder_name.to_string(),
            });
        }
    }

    Ok(nodes)
}

#[command]
fn read_folder(path: &str) -> tauri::Result<Vec<FileNode>> {
    let path_buf = PathBuf::from(path);
    println!("{} from path", path);

    if !path_buf.exists() || !path_buf.is_dir() {
        return Ok(vec![]);
    }

    let root_name = path_buf
        .file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();

    let files = read_dir_recursive(&path_buf, &root_name)?;
    Ok(files)
}

#[command]
fn create_folder(path: String) -> Result<String, String> {
    let folder_path = PathBuf::from(&path);

    if folder_path.exists() {
        return Err(format!("Folder already exists: {}", path));
    }

    fs::create_dir_all(&folder_path)
        .map_err(|e| format!("Failed to create folder: {}", e))?;

    Ok(format!("Folder created: {}", path))
}

#[command]
fn create_file(path: String) -> Result<String, String> {
    let file_path = PathBuf::from(&path);
    println!("{path} from path");

    if file_path.exists() {
        return Err(format!("File already exists: {}", path));
    }

    File::create(&file_path).map_err(|e| format!("Failed to create file: {}", e))?;

    Ok(format!("File created: {}", path))
}

#[command]
fn write_file(path: String, content: String) -> Result<String, String> {
    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .create(true)   // <-- REQUIRED FIX
        .open(&path)
        .map_err(|error| format!("Failed to write: {}", error))?;

    file.write_all(content.as_bytes())
        .map_err(|e| format!("Failed to write to file: {}", e))?;

    Ok(format!("File updated: {}", path))
}


#[command]
fn delete_path(path: String) -> Result<String, String> {
    let path_buf = PathBuf::from(&path);
    println!("{path} from path");

    if !path_buf.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    if path_buf.is_file() {
        fs::remove_file(&path_buf)
            .map_err(|e| format!("Failed to delete file: {}", e))?;
        Ok(format!("File deleted: {}", path))
    } else if path_buf.is_dir() {
        fs::remove_dir_all(&path_buf)
            .map_err(|e| format!("Failed to delete directory: {}", e))?;
        Ok(format!("Directory deleted: {}", path))
    } else {
        Err(format!("Unknown path type: {}", path))
    }
}


fn main() {
    tauri::Builder::default()
        .manage(Arc::new(Mutex::new(ShellState {
            cwd: dirs::home_dir()
                .expect("Failed to get home dir")
                .to_string_lossy()
                .to_string(),
        })))
        .invoke_handler(tauri::generate_handler![
            create_esp_idf_project,
            read_folder,
            create_folder,
            create_file,
            delete_path,
            write_file,
            run_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

