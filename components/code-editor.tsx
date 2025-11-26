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
    case "rust":
       return "rs"
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

  // Define custom Monaco themes
  useEffect(() => {
    try {
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
      console.error("Error defining themes:", error)
      setError("Failed to load editor themes")
    }
  }, [])

  // Create Monaco editor once
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
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        cursorBlinking: "blink",
        wordWrap: "off",
      })

      setIsLoading(false)
      setError(null)

      // Focus editor after load
      setTimeout(() => {
        monacoRef.current?.focus()
      }, 100)
    } catch (error) {
      console.error("Error creating Monaco editor:", error)
      setError("Failed to initialize code editor")
      setIsLoading(false)
    }

    return () => {
      monacoRef.current?.dispose()
      monacoRef.current = null
    }
  }, [file.id])

  // Handle typing updates
  useEffect(() => {
    if (!monacoRef.current) return

    const editor = monacoRef.current
    const disposable = editor.onDidChangeModelContent(() => {
      const newContent = editor.getValue()
      if (!isTyping.current) {
        isTyping.current = true
        onContentChange?.(newContent)
        isTyping.current = false
      }
    })

    return () => disposable.dispose()
  }, [onContentChange])

  // Update content from external changes (switching files, etc.)
  useEffect(() => {
    if (!monacoRef.current || file.content === undefined) return

    const editor = monacoRef.current
    const currentContent = editor.getValue()
    if (currentContent !== file.content) {
      const position = editor.getPosition()
      editor.setValue(file.content)
      if (position) editor.setPosition(position)
    }
  }, [file.id, file.content])

  // Update language when file changes
  useEffect(() => {
    const model = monacoRef.current?.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, getLanguage(file.name))
    }
  }, [file.name])

  // Apply theme
  useEffect(() => {
    monaco.editor.setTheme("c-light-theme")
  }, [theme])

  if (error) {
    return (
        <div className="flex h-full items-center justify-center bg-background">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button
                onClick={() => {
                  setError(null)
                  setIsLoading(true)
                  monacoRef.current?.dispose()
                  monacoRef.current = null
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
