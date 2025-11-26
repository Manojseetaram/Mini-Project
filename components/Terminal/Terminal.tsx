"use client";
import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

interface TerminalLine {
  id: number;
  content: string;
  type: "input" | "output" | "error";
}

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [lineId, setLineId] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const command = currentInput.trim();

    // Add input line
    setLines((prev) => [
      ...prev,
      { id: lineId, content: `$ ${command}`, type: "input" },
    ]);
    setLineId((prev) => prev + 1);

    // Handle local commands
    if (command === "clear") {
      setLines([]);
      setCurrentInput("");
      return;
    }

    try {
      const [cmd, ...args] = command.split(" ");

      const result = await invoke("run_command", {
        command: cmd,
        args: args,
      }) as string;

      // Split result by lines and display each line
      const resultLines = result.split("\n");
      resultLines.forEach((line, index) => {
        setLines((prev) => [
          ...prev,
          { id: lineId + index + 1, content: line, type: "output" },
        ]);
      });
      setLineId((prev) => prev + resultLines.length + 1);
    } catch (error: any) {
      setLines((prev) => [
        ...prev,
        { id: lineId + 1, content: `Error: ${error}`, type: "error" },
      ]);
      setLineId((prev) => prev + 2);
    }

    setCurrentInput("");
  };

  const handleClick = () => inputRef.current?.focus();

  return (
    <div
      ref={terminalRef}
      className="w-full h-full bg-white text-black font-mono text-sm p-2 overflow-y-auto cursor-text"
      onClick={handleClick}
    >
      {lines.map((line) => (
        <div
          key={line.id}
          className={`whitespace-pre-wrap ${
            line.type === "error"
              ? "text-red-600"
              : line.type === "output"
              ? "text-black"
              : "text-black" // input text
          }`}
        >
          {line.content}
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex items-center">
        <span className="text-black mr-1">$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-black font-mono"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
