"use client"

import { useState, useEffect } from "react"
import { FileExplorer } from "@/components/file-explorer"
import  CodeEditor  from "@/components/code-editor"
import { ThemeToggle } from "@/components/theme-toggle"
import {invoke} from "@tauri-apps/api/tauri"

export interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileNode[]
  isOpen?: boolean
}

export default function VSCodeEditor() {
  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      id: "1",
      name: "src",
      type: "folder",
      isOpen: true,
      children: [
        {
          id: "2",
          name: "components",
          type: "folder",
          isOpen: false,
          children: [
            {
              id: "3",
              name: "Button.tsx",
              type: "file",
              content: `import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`px-4 py-2 rounded-md transition-colors duration-200 \${
        variant === 'primary' 
          ? 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300' 
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100'
      } \${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}\`}
    >
      {children}
    </button>
  )
}`,
            },
            {
              id: "8",
              name: "Card.tsx",
              type: "file",
              content: `import React from 'react'

interface CardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={\`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 \${className}\`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>
      <div className="text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </div>
  )
}`,
            },
          ],
        },
        {
          id: "4",
          name: "utils",
          type: "folder",
          isOpen: false,
          children: [
            {
              id: "5",
              name: "helpers.ts",
              type: "file",
              content: `export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}`,
            },
            {
              id: "9",
              name: "api.ts",
              type: "file",
              content: `const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`)
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`)
    }
    return response.json()
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`)
    }
    return response.json()
  }
}

export const apiClient = new ApiClient()`,
            },
          ],
        },
        {
          id: "6",
          name: "App.tsx",
          type: "file",
          content: `import React, { useState } from 'react'
import { Button } from './components/Button'
import { Card } from './components/Card'

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  const handleIncrement = () => {
    setCount(prev => prev + 1)
    setMessage(\`Button clicked \${count + 1} times!\`)
  }

  const handleReset = () => {
    setCount(0)
    setMessage('Counter reset!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          My React App
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Counter Demo">
            <div className="text-center">
              <p className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                {count}
              </p>
              <div className="space-x-2">
                <Button onClick={handleIncrement}>
                  Increment
                </Button>
                <Button onClick={handleReset} variant="secondary">
                  Reset
                </Button>
              </div>
              {message && (
                <p className="mt-4 text-sm text-green-600 dark:text-green-400">
                  {message}
                </p>
              )}
            </div>
          </Card>

          <Card title="Welcome">
            <p className="mb-4">
              Welcome to this VS Code-like editor! This is a sample React application 
              with modern components and TypeScript support.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Modern React with hooks</li>
              <li>TypeScript support</li>
              <li>Tailwind CSS styling</li>
              <li>Dark mode support</li>
              <li>Component-based architecture</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App`,
        },
      ],
    },
    {
      id: "7",
      name: "README.md",
      type: "file",
      content: `# My VS Code Editor Project

This is a comprehensive VS Code-like editor built with React, TypeScript, and Monaco Editor.

## Features

✨ **Modern Interface**
- Clean, VS Code-inspired design
- Dark and light theme support
- Responsive layout

🗂️ **File Management**
- Interactive file explorer
- Create files and folders
- Drag and drop support
- Context menus

📝 **Code Editor**
- Monaco Editor integration
- Syntax highlighting for multiple languages
- Line numbers with current line highlighting
- Auto-completion and IntelliSense
- Multiple themes

⌨️ **Keyboard Shortcuts**
- \`Ctrl+N\` - New File
- \`Ctrl+Shift+N\` - New Folder  
- \`Ctrl+S\` - Save File

## Supported Languages

- JavaScript/TypeScript
- React (JSX/TSX)
- HTML/CSS
- JSON
- Markdown
- Python
- Java
- C/C++
- And many more!

## Getting Started

1. Use the file explorer to navigate your project
2. Click on files to open them in the editor
3. Right-click for context menu options
4. Drag and drop files/folders to reorganize
5. Use keyboard shortcuts for quick actions

## Architecture

The editor is built with:
- **React 18** with hooks
- **TypeScript** for type safety
- **Monaco Editor** for code editing
- **Tailwind CSS** for styling
- **Next.js** for the framework

Enjoy coding! 🚀`,
    },
    {
      id: "10",
      name: "package.json",
      type: "file",
      content: `{
  "name": "vscode-editor",
  "version": "1.0.0",
  "description": "A VS Code-like editor built with React and Monaco",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "monaco-editor": "^0.44.0",
    "next-themes": "^0.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  },
  "keywords": [
    "editor",
    "vscode",
    "monaco",
    "react",
    "typescript"
  ],
  "author": "VS Code Editor",
  "license": "MIT"
}`,
    },
  ])


  const [activeFile, setActiveFile] = useState<FileNode | null>(null)
  const [openTabs, setOpenTabs] = useState<FileNode[]>([])
  const [selectedFolder, setSelectedFolder] = useState<FileNode | null>(null)
  const [message, setMessage] = useState("")

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault()
            if (activeFile) {
              console.log("[v0] Saving file:", activeFile.name)
              // In a real app, this would save to backend/localStorage
            }
            break
          case "n":
            e.preventDefault()
            if (e.shiftKey) {
              // Ctrl+Shift+N - New Folder
              console.log("[v0] Creating new folder")
            } else {
              // Ctrl+N - New File
              console.log("[v0] Creating new file")
            }
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeFile])

  const openFile = (file: FileNode) => {
    console.log("[v0] Opening file:", file.name, "with content length:", file.content?.length || 0)
    setActiveFile(file)
    if (!openTabs.find((tab) => tab.id === file.id)) {
      setOpenTabs((prev) => [...prev, file])
    }
  }

  const closeTab = (fileId: string) => {
    setOpenTabs((prev) => prev.filter((tab) => tab.id !== fileId))
    if (activeFile?.id === fileId) {
      const remainingTabs = openTabs.filter((tab) => tab.id !== fileId)
      setActiveFile(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1] : null)
    }
  }

  const updateFileContent = (fileId: string, content: string) => {
    console.log("[v0] Updating file content for:", fileId, "length:", content.length)

    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === fileId) {
          return { ...node, content }
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) }
        }
        return node
      })
    }

    setFileTree((prev) => updateNode(prev))

    // Update active file if it's the one being edited
    if (activeFile?.id === fileId) {
      setActiveFile({ ...activeFile, content })
    }

    // Update tab content
    setOpenTabs((prev) => prev.map((tab) => (tab.id === fileId ? { ...tab, content } : tab)))
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4 shadow-sm shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold">VS Code Editor</h1>
            <button onClick={()=>{
              invoke("hello")
              .then((res)=>{
                console.log(res)
                //@ts-expect-error
                setMessage(res)
              })
            }}>create</button>
              {message && <div className="text-sm">{message}</div>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-card border-r border-border flex flex-col shadow-sm shrink-0">
          <FileExplorer
            fileTree={fileTree}
            setFileTree={setFileTree}
            onFileSelect={openFile}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
          />
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs */}
          {openTabs.length > 0 && (
            <div className="flex bg-card border-b border-border overflow-x-auto shrink-0">
              {openTabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center px-4 py-2 border-r border-border cursor-pointer hover:bg-accent/50 min-w-0 transition-colors duration-150 ${
                    activeFile?.id === tab.id ? "bg-background border-b-2 border-b-primary" : ""
                  }`}
                  onClick={() => setActiveFile(tab)}
                >
                  <span className="text-sm truncate mr-2">{tab.name}</span>
                  <button
                    className="hover:bg-destructive hover:text-destructive-foreground rounded p-1 transition-colors duration-150"
                    onClick={(e) => {
                      e.stopPropagation()
                      closeTab(tab.id)
                    }}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 min-h-0">
            {activeFile ? (
              <CodeEditor
                key={activeFile.id}
                file={activeFile}
                onChange={(content) => updateFileContent(activeFile.id, content)}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground bg-background/50">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-muted-foreground/50" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Welcome to VS Code Editor</h2>
                  <p className="text-sm mb-6 text-muted-foreground/80">
                    Select a file from the explorer to start editing, or create a new file to begin coding.
                  </p>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex items-center justify-center space-x-2 p-2 bg-accent/30 rounded">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl+N</kbd>
                      <span>New File</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 p-2 bg-accent/30 rounded">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl+Shift+N</kbd>
                      <span>New Folder</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 p-2 bg-accent/30 rounded">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl+S</kbd>
                      <span>Save File</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
