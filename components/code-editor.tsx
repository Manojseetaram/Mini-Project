"use client"

import * as monaco from "monaco-editor"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"

interface CodeEditorProps {
  file: { id: string; name: string; content?: string }
  onContentChange?: (content: string) => void
}

function getLanguage(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "c":
      return "c"
    case "cpp":
    case "cc":
    case "cxx":
      return "cpp"
    case "h":
    case "hpp":
      return "c"
    case "js":
    case "jsx":
      return "javascript"
    case "ts":
    case "tsx":
      return "typescript"
    case "py":
      return "python"
    case "java":
      return "java"
    case "html":
      return "html"
    case "css":
      return "css"
    case "json":
      return "json"
    case "md":
      return "markdown"
    case "xml":
      return "xml"
    case "sql":
      return "sql"
    default:
      return "plaintext"
  }
}

export default function CodeEditor({ file, onContentChange }: CodeEditorProps) {
  const { theme, setTheme } = useTheme()
  const editorRef = useRef<HTMLDivElement | null>(null)
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isTyping = useRef(false)

  useEffect(() => {
    setTheme("light")
  }, [setTheme])

  // Define custom themes
  useEffect(() => {
    try {
      // Light theme for C programming
      monaco.editor.defineTheme("c-light-theme", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
          { token: "keyword", foreground: "0000FF", fontStyle: "bold" },
          { token: "string", foreground: "A31515" },
          { token: "number", foreground: "098658" },
          { token: "type", foreground: "267F99", fontStyle: "bold" },
          { token: "function", foreground: "795E26", fontStyle: "bold" },
          { token: "variable", foreground: "001080" },
          { token: "operator", foreground: "000000" },
          { token: "delimiter", foreground: "000000" },
          { token: "preprocessor", foreground: "800080", fontStyle: "bold" },
        ],
        colors: {
          "editor.background": "#FFFFFF",
          "editor.foreground": "#000000",
          "editor.lineHighlightBackground": "#F0F0F0",
          "editor.selectionBackground": "#ADD6FF",
          "editorLineNumber.foreground": "#237893",
          "editorLineNumber.activeForeground": "#0B216F",
          "editorCursor.foreground": "#000000",
          "editor.selectionHighlightBackground": "#E0E0E0",
          "editorIndentGuide.background": "#D3D3D3",
          "editorIndentGuide.activeBackground": "#939393",
        },
      })

      // Dark theme for C programming
      monaco.editor.defineTheme("c-dark-theme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
          { token: "keyword", foreground: "569CD6", fontStyle: "bold" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
          { token: "type", foreground: "4EC9B0", fontStyle: "bold" },
          { token: "function", foreground: "DCDCAA", fontStyle: "bold" },
          { token: "variable", foreground: "9CDCFE" },
          { token: "operator", foreground: "D4D4D4" },
          { token: "delimiter", foreground: "D4D4D4" },
          { token: "preprocessor", foreground: "C586C0", fontStyle: "bold" },
        ],
        colors: {
          "editor.background": "#1E1E1E",
          "editor.foreground": "#D4D4D4",
          "editor.lineHighlightBackground": "#2D2D30",
          "editor.selectionBackground": "#264F78",
          "editorLineNumber.foreground": "#858585",
          "editorLineNumber.activeForeground": "#FFFFFF",
          "editorCursor.foreground": "#FFFFFF",
          "editor.selectionHighlightBackground": "#3A3D41",
          "editorIndentGuide.background": "#404040",
          "editorIndentGuide.activeBackground": "#707070",
        },
      })
    } catch (error) {
      console.error("[v0] Error defining themes:", error)
      setError("Failed to load editor themes")
    }
  }, [])

  // Create Monaco editor ONCE
  useEffect(() => {
    if (!editorRef.current || monacoRef.current) return

    try {
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value: file.content || "",
        language: getLanguage(file.name),
        theme: "c-light-theme",
        fontSize: 16,
        fontFamily: 'Consolas, "Courier New", monospace',
        lineNumbers: "on",
        lineNumbersMinChars: 4,
        lineDecorationsWidth: 10,
        glyphMargin: true,
        folding: true,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: "off",
        minimap: { enabled: false },
        contextmenu: true,
        selectOnLineNumbers: true,
        readOnly: false,
        cursorStyle: "line",
        cursorWidth: 2,
        cursorBlinking: "blink",
        cursorSmoothCaretAnimation: "on",
        renderWhitespace: "selection",
        renderControlCharacters: false,
        fontLigatures: false,
        mouseWheelZoom: true,
        suggest: {
          insertMode: "insert",
          filterGraceful: true,
          showIcons: true,
          showMethods: true,
          showFunctions: true,
          showConstructors: true,
          showFields: true,
          showVariables: true,
          showClasses: true,
          showStructs: true,
          showInterfaces: true,
          showModules: true,
          showProperties: true,
          showEvents: true,
          showOperators: true,
          showUnits: true,
          showValues: true,
          showConstants: true,
          showEnums: true,
          showEnumMembers: true,
          showKeywords: true,
          showWords: true,
          showColors: true,
          showFiles: true,
          showReferences: true,
          showFolders: true,
          showTypeParameters: true,
          showSnippets: true,
        },
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: "on",
        autoIndent: "full",
        tabSize: 4,
        insertSpaces: true,
        detectIndentation: true,
        trimAutoWhitespace: true,
        wordSeparators: "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?",
        wrappingStrategy: "simple",
      })

      monacoRef.current.onDidChangeModelContent(() => {
        if (monacoRef.current && onContentChange && !isTyping.current) {
          const content = monacoRef.current.getValue()
          onContentChange(content)
        }
      })

      setIsLoading(false)
      setError(null)

      setTimeout(() => {
        if (monacoRef.current) {
          monacoRef.current.focus()
        }
      }, 100)
    } catch (error) {
      console.error("[v0] Error creating Monaco editor:", error)
      setError("Failed to initialize code editor")
      setIsLoading(false)
    }

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose()
        monacoRef.current = null
      }
    }
  }, [file.id, onContentChange])

  useEffect(() => {
    if (monacoRef.current) {
      monaco.editor.setTheme("c-light-theme")
    }
  }, [theme])

  // Update language when file name changes
  useEffect(() => {
    if (monacoRef.current) {
      const model = monacoRef.current.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, getLanguage(file.name))
      }
    }
  }, [file.name])

  // Update content when file content changes (but not during typing)
  useEffect(() => {
    if (monacoRef.current && file.content !== undefined) {
      const currentContent = monacoRef.current.getValue()
      if (currentContent !== file.content && !isTyping.current) {
        isTyping.current = true
        monacoRef.current.setValue(file.content)
        setTimeout(() => {
          isTyping.current = false
        }, 100)
      }
    }
  }, [file.content])

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setIsLoading(true)
              if (monacoRef.current) {
                monacoRef.current.dispose()
                monacoRef.current = null
              }
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      <div ref={editorRef} className="size-full" />
    </div>
  )
}
