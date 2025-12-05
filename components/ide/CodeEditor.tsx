"use client";
import Editor from "@monaco-editor/react";

interface Props {
  language: "html" | "css" | "javascript";
  value: string;
  onChange: (value: string | undefined) => void;
}

export default function CodeEditor({ language, value, onChange }: Props) {
  return (
    <div className="h-full w-full bg-dark-900 pt-2">
      <div className="flex items-center justify-between px-4 pb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
        <span>{language}</span>
      </div>
      <Editor
        height="calc(100% - 30px)"
        theme="vs-dark"
        language={language}
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: '"Fira Code", monospace',
          scrollBeyondLastLine: false,
          padding: { top: 10 },
          backgroundColor: "#1E1F22", // Match custom theme
        }}
      />
    </div>
  );
}