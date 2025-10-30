"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { X, Play, Copy, Download, RotateCcw, Settings, Code2, Eye, EyeOff } from "lucide-react";
import dynamic from "next/dynamic";

interface CodePlaygroundProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  initialLanguage?: "html" | "css" | "javascript" | "cpp";
}

interface CodeState {
  html: string;
  css: string;
  javascript: string;
  cpp: string;
}

const DEFAULT_CODE: CodeState = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Code</title>
</head>
<body>
  <h1>Hello, World! 🚀</h1>
  <p>Start coding here...</p>
</body>
</html>`,
  css: `body {
  margin: 0;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 100vh;
}

h1 {
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

p {
  font-size: 1.2em;
  text-align: center;
}`,
  javascript: `// JavaScript Code
console.log("Hello from JavaScript!");

// Try DOM manipulation
document.addEventListener('DOMContentLoaded', () => {
  const heading = document.querySelector('h1');
  if (heading) {
    heading.style.transition = 'transform 0.3s';
    heading.addEventListener('click', () => {
      heading.style.transform = heading.style.transform === 'scale(1.1)' 
        ? 'scale(1)' 
        : 'scale(1.1)';
    });
  }
});`,
  cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    // Your C++ code here
    string name = "World";
    cout << "Hello, " << name << "!" << endl;
    
    // Example: Simple calculator
    int a = 10, b = 5;
    cout << "Sum: " << (a + b) << endl;
    cout << "Difference: " << (a - b) << endl;
    cout << "Product: " << (a * b) << endl;
    
    return 0;
}`,
};

const LANGUAGE_LABELS = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  cpp: "C++",
};

export default function CodePlayground({
  isOpen,
  onClose,
  lessonId,
  initialLanguage = "html",
}: CodePlaygroundProps) {
  const [activeLanguage, setActiveLanguage] = useState<keyof CodeState>(initialLanguage);
  const [code, setCode] = useState<CodeState>(DEFAULT_CODE);
  const [showPreview, setShowPreview] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [cppOutput, setCppOutput] = useState<string>("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "">("");
  
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved code from localStorage on mount
  useEffect(() => {
    if (!isOpen) return;

    const savedCode = localStorage.getItem(`code_playground_${lessonId}`);
    if (savedCode) {
      try {
        const parsed = JSON.parse(savedCode);
        setCode(parsed);
      } catch (error) {
        console.error("Failed to load saved code:", error);
      }
    }
  }, [lessonId, isOpen]);

  // Auto-save với debounce
  useEffect(() => {
    if (!isOpen) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    setAutoSaveStatus("saving");

    autoSaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(`code_playground_${lessonId}`, JSON.stringify(code));
        setAutoSaveStatus("saved");
        
        // Clear status after 2 seconds
        setTimeout(() => setAutoSaveStatus(""), 2000);
      } catch (error) {
        console.error("Failed to save code:", error);
        setAutoSaveStatus("");
      }
    }, 1000); // Auto-save sau 1 giây không gõ

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [code, lessonId, isOpen]);

  // Generate preview HTML using useMemo to avoid unnecessary recalculations
  const previewHTML = useMemo(() => {
    const htmlCode = activeLanguage === "html" ? code.html : "";
    const cssCode = code.css;
    const jsCode = code.javascript;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            margin: 0; 
            padding: 16px; 
            font-family: system-ui, -apple-system, sans-serif; 
          }
          * { box-sizing: border-box; }
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
        <script>
          window.addEventListener('error', function(e) {
            console.error('Error:', e.message);
            document.body.innerHTML += '<div style="color: red; padding: 10px; margin: 10px; border: 1px solid red; border-radius: 4px; background: #fee;"><strong>Error:</strong> ' + e.message + '</div>';
          });
          
          try {
            ${jsCode}
          } catch (error) {
            console.error('JavaScript Error:', error);
            document.body.innerHTML += '<div style="color: red; padding: 10px; margin: 10px; border: 1px solid red; border-radius: 4px; background: #fee;"><strong>JavaScript Error:</strong> ' + error.message + '</div>';
          }
        </script>
      </body>
      </html>
    `;
  }, [code, activeLanguage]);

  const handleCodeChange = (value: string) => {
    setCode((prev) => ({
      ...prev,
      [activeLanguage]: value,
    }));
  };

  const handleRunCppCode = async () => {
    setIsRunning(true);
    setCppOutput("Compiling and running C++ code...\n");

    // Simulate C++ compilation and execution
    // Note: Real C++ execution requires backend API
    setTimeout(() => {
      setCppOutput(
        `Note: C++ execution requires a backend compiler.\n\n` +
        `Your code:\n${code.cpp}\n\n` +
        `To run C++ code, you need to:\n` +
        `1. Set up a backend API with C++ compiler\n` +
        `2. Send code to server for compilation\n` +
        `3. Return execution results\n\n` +
        `For now, this is a placeholder output.`
      );
      setIsRunning(false);
    }, 1500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code[activeLanguage]);
    alert("Code copied to clipboard!");
  };

  const handleDownloadCode = () => {
    const extensions = { html: "html", css: "css", javascript: "js", cpp: "cpp" };
    const blob = new Blob([code[activeLanguage]], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${extensions[activeLanguage]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetCode = () => {
    if (confirm("Are you sure you want to reset the code to default?")) {
      setCode(DEFAULT_CODE);
      setCppOutput("");
    }
  };

  if (!isOpen) return null;

  const showSplitView = activeLanguage !== "cpp";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <Code2 className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Code Playground</h2>
            
            {/* Auto-save status */}
            {autoSaveStatus && (
              <div className="flex items-center space-x-2 text-sm">
                {autoSaveStatus === "saving" ? (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-yellow-500">Saving...</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-500">Saved</span>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-800/50 border-b border-gray-700">
          <div className="flex space-x-2">
            {(Object.keys(LANGUAGE_LABELS) as Array<keyof CodeState>).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setActiveLanguage(lang);
                  setCppOutput("");
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeLanguage === lang
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {showSplitView && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                title={showPreview ? "Hide Preview" : "Show Preview"}
              >
                {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
            
            {activeLanguage === "cpp" && (
              <button
                onClick={handleRunCppCode}
                disabled={isRunning}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? "Running..." : "Run"}</span>
              </button>
            )}
            
            <button
              onClick={handleCopyCode}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              title="Copy Code"
            >
              <Copy className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleDownloadCode}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              title="Download Code"
            >
              <Download className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleResetCode}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              title="Reset Code"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {showSplitView ? (
            <>
              {/* Code Editor */}
              <div className="flex-1 flex flex-col border-r border-gray-700 overflow-hidden">
                <div className="px-4 py-2 bg-gray-800/30 border-b border-gray-700 text-sm text-gray-400 font-mono">
                  {LANGUAGE_LABELS[activeLanguage]} Editor
                </div>
                <div className="flex-1 overflow-auto bg-gray-900 custom-scrollbar">
                  <textarea
                    ref={codeEditorRef}
                    value={code[activeLanguage]}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className="w-full h-full p-4 bg-transparent text-gray-100 font-mono text-sm resize-none focus:outline-none"
                    style={{ 
                      fontFamily: "'Fira Code', 'Consolas', monospace",
                      lineHeight: "1.6",
                      tabSize: 2,
                    }}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </div>
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                  <div className="px-4 py-2 bg-gray-800/30 border-b border-gray-700 text-sm text-gray-400 font-mono">
                    Preview
                  </div>
                  <div className="flex-1 overflow-auto">
                    <iframe
                      key={previewHTML}
                      srcDoc={previewHTML}
                      className="w-full h-full border-0 bg-white"
                      title="Preview"
                      sandbox="allow-scripts allow-modals allow-forms"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            // C++ Single View
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 flex">
                {/* Code Editor */}
                <div className="flex-1 flex flex-col border-r border-gray-700 overflow-hidden">
                  <div className="px-4 py-2 bg-gray-800/30 border-b border-gray-700 text-sm text-gray-400 font-mono">
                    C++ Editor
                  </div>
                  <div className="flex-1 overflow-auto bg-gray-900 custom-scrollbar">
                    <textarea
                      ref={codeEditorRef}
                      value={code.cpp}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className="w-full h-full p-4 bg-transparent text-gray-100 font-mono text-sm resize-none focus:outline-none"
                      style={{ 
                        fontFamily: "'Fira Code', 'Consolas', monospace",
                        lineHeight: "1.6",
                        tabSize: 2,
                      }}
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Output */}
                <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
                  <div className="px-4 py-2 bg-gray-800/30 border-b border-gray-700 text-sm text-gray-400 font-mono">
                    Output
                  </div>
                  <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                    <pre className="text-gray-100 font-mono text-sm whitespace-pre-wrap">
                      {cppOutput || "Click 'Run' to execute your C++ code..."}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-800 border-t border-gray-700 text-sm text-gray-400 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>💡 Tip: Your code is auto-saved</span>
            {activeLanguage !== "cpp" && (
              <span>• Press Ctrl+S to manually save</span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Lesson ID: {lessonId}
          </div>
        </div>
      </div>
    </div>
  );
}
