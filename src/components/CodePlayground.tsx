"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { X, Play, Copy, Download, RotateCcw, Code2, Eye, EyeOff, Sun, Moon, Sparkles } from "lucide-react"

interface CodePlaygroundProps {
  isOpen: boolean
  onClose: () => void
  lessonId: string
  initialLanguage?: "html" | "css" | "javascript" | "cpp"
}

interface CodeState {
  html: string
  css: string
  javascript: string
  cpp: string
}

const DEFAULT_CODE: CodeState = {
  html: "",
  css: "",
  javascript: "",
  cpp: "",
}

const LANGUAGE_LABELS = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  cpp: "C++",
}

interface ConsoleLog {
  type: "log" | "error" | "warn" | "info"
  message: string
  timestamp: number
}

interface AIReviewData {
  score: number
  pros: string[]
  cons: string[]
  suggestions: string[]
}

export default function CodePlayground({ isOpen, onClose, lessonId, initialLanguage = "html" }: CodePlaygroundProps) {
  const [activeLanguage, setActiveLanguage] = useState<keyof CodeState>(initialLanguage)
  const [code, setCode] = useState<CodeState>(DEFAULT_CODE)
  const [showPreview, setShowPreview] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [cppOutput, setCppOutput] = useState<string>("")
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "">("")
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [previewTab, setPreviewTab] = useState<"browser" | "console">("browser")
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([])
  const [preserveLog, setPreserveLog] = useState(true) // Default to true to prevent flicker
  const [isCodeExecuting, setIsCodeExecuting] = useState(false) // Track if code is currently executing
  const [showAIReview, setShowAIReview] = useState(false)
  const [aiReviewData, setAiReviewData] = useState<AIReviewData | null>(null)
  const [isLoadingReview, setIsLoadingReview] = useState(false)

  const codeEditorRef = useRef<HTMLTextAreaElement>(null)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const autoSaveStatusTimerRef = useRef<NodeJS.Timeout | null>(null) // Track status display timer
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const executionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const executionIdRef = useRef<number>(0) // Track unique execution ID

  // Load saved code and theme from localStorage on mount
  useEffect(() => {
    if (!isOpen) return

    const savedCode = localStorage.getItem(`code_playground_${lessonId}`)
    if (savedCode) {
      try {
        const parsed = JSON.parse(savedCode)
        setCode(parsed)
      } catch (error) {
        console.error("Failed to load saved code:", error)
      }
    }

    const savedTheme = localStorage.getItem("code_playground_theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [lessonId, isOpen])

  // Auto-save with debounce
  useEffect(() => {
    if (!isOpen) return

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    setAutoSaveStatus("saving")

    autoSaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(`code_playground_${lessonId}`, JSON.stringify(code))
        setAutoSaveStatus("saved")

        // Clear previous status timer
        if (autoSaveStatusTimerRef.current) {
          clearTimeout(autoSaveStatusTimerRef.current)
        }
        
        // Hide status after 2 seconds
        autoSaveStatusTimerRef.current = setTimeout(() => setAutoSaveStatus(""), 2000)
      } catch (error) {
        console.error("Failed to save code:", error)
        setAutoSaveStatus("")
      }
    }, 1000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
      if (autoSaveStatusTimerRef.current) {
        clearTimeout(autoSaveStatusTimerRef.current)
      }
    }
  }, [code, lessonId, isOpen])

  const previewHTML = useMemo(() => {
    const htmlCode = activeLanguage === "html" ? code.html : ""
    const cssCode = code.css
    const jsCode = code.javascript

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* No default styles - render exactly as browser would */
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
        <script>
          // Capture console logs and send to parent
          (function() {
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            const originalInfo = console.info;
            
            console.log = function(...args) {
              originalLog.apply(console, args);
              window.parent.postMessage({
                type: 'console',
                level: 'log',
                message: args.map(arg => {
                  if (typeof arg === 'object') {
                    try {
                      return JSON.stringify(arg, null, 2);
                    } catch (e) {
                      return String(arg);
                    }
                  }
                  return String(arg);
                }).join(' ')
              }, '*');
            };
            
            console.error = function(...args) {
              originalError.apply(console, args);
              window.parent.postMessage({
                type: 'console',
                level: 'error',
                message: args.map(arg => String(arg)).join(' ')
              }, '*');
            };
            
            console.warn = function(...args) {
              originalWarn.apply(console, args);
              window.parent.postMessage({
                type: 'console',
                level: 'warn',
                message: args.map(arg => String(arg)).join(' ')
              }, '*');
            };
            
            console.info = function(...args) {
              originalInfo.apply(console, args);
              window.parent.postMessage({
                type: 'console',
                level: 'info',
                message: args.map(arg => String(arg)).join(' ')
              }, '*');
            };
            
            window.addEventListener('error', function(e) {
              console.error('Error:', e.message);
            });
          })();
          
          try {
            ${jsCode}
          } catch (error) {
            console.error('JavaScript Error:', error.message);
          }
        </script>
      </body>
      </html>
    `
  }, [code, activeLanguage])

  // Reset execution ID when playground opens/closes
  useEffect(() => {
    if (isOpen) {
      executionIdRef.current = 0
    }
  }, [isOpen])

  // Single unified effect for live code execution (like Live Server)
  useEffect(() => {
    if (!isOpen || activeLanguage === "cpp") return

    // Clear any pending execution
    if (executionTimerRef.current) {
      clearTimeout(executionTimerRef.current)
    }

    // Debounce for smooth typing experience - wait until user stops typing
    executionTimerRef.current = setTimeout(() => {
      // Increment execution ID to invalidate previous executions
      executionIdRef.current += 1
      const currentExecutionId = executionIdRef.current
      
      // Clear console only if preserve log is OFF
      if (!preserveLog) {
        setConsoleLogs([])
      }
      
      // Mark that we're executing code
      setIsCodeExecuting(true)
      
      // Execute code regardless of which tab is active (browser or console)
      if (iframeRef.current?.contentWindow) {
        // Calculate previewHTML here to avoid double dependency trigger
        const htmlCode = activeLanguage === "html" ? code.html : ""
        const cssCode = code.css
        const jsCode = code.javascript

        const html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              /* No default styles - render exactly as browser would */
              ${cssCode}
            </style>
          </head>
          <body>
            ${htmlCode}
            <script>
              // Send execution ID with each message
              const EXECUTION_ID = ${currentExecutionId};
              
              // Capture console logs and send to parent
              (function() {
                const originalLog = console.log;
                const originalError = console.error;
                const originalWarn = console.warn;
                const originalInfo = console.info;
                
                console.log = function(...args) {
                  originalLog.apply(console, args);
                  window.parent.postMessage({
                    type: 'console',
                    level: 'log',
                    executionId: EXECUTION_ID,
                    message: args.map(arg => {
                      if (typeof arg === 'object') {
                        try {
                          return JSON.stringify(arg, null, 2);
                        } catch (e) {
                          return String(arg);
                        }
                      }
                      return String(arg);
                    }).join(' ')
                  }, '*');
                };
                
                console.error = function(...args) {
                  originalError.apply(console, args);
                  window.parent.postMessage({
                    type: 'console',
                    level: 'error',
                    executionId: EXECUTION_ID,
                    message: args.map(arg => String(arg)).join(' ')
                  }, '*');
                };
                
                console.warn = function(...args) {
                  originalWarn.apply(console, args);
                  window.parent.postMessage({
                    type: 'console',
                    level: 'warn',
                    executionId: EXECUTION_ID,
                    message: args.map(arg => String(arg)).join(' ')
                  }, '*');
                };
                
                console.info = function(...args) {
                  originalInfo.apply(console, args);
                  window.parent.postMessage({
                    type: 'console',
                    level: 'info',
                    executionId: EXECUTION_ID,
                    message: args.map(arg => String(arg)).join(' ')
                  }, '*');
                };
                
                window.addEventListener('error', function(e) {
                  console.error('Error:', e.message);
                });
              })();
              
              try {
                ${jsCode}
              } catch (error) {
                console.error('JavaScript Error:', error.message);
              }
            </script>
          </body>
          </html>
        `
        
        iframeRef.current.srcdoc = html
      }
      
      // Reset executing flag after a short delay
      setTimeout(() => {
        setIsCodeExecuting(false)
      }, 100)
    }, 800) // Increased to 800ms - only execute when user stops typing

    return () => {
      if (executionTimerRef.current) {
        clearTimeout(executionTimerRef.current)
      }
    }
  }, [code, isOpen, activeLanguage, preserveLog])

  // Handle preserve log toggle - clear immediately when turned off
  useEffect(() => {
    if (!preserveLog) {
      setConsoleLogs([])
    }
  }, [preserveLog])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "console") {
        // Only accept messages from current execution ID
        if (event.data.executionId === executionIdRef.current) {
          // Only add log if we're not in the middle of clearing
          if (preserveLog || isCodeExecuting) {
            const newLog: ConsoleLog = {
              type: event.data.level,
              message: event.data.message,
              timestamp: Date.now(),
            }
            setConsoleLogs((prev) => [...prev, newLog])
          }
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [preserveLog, isCodeExecuting])

  // Calculate line numbers
  const lineNumbers = useMemo(() => {
    const lines = code[activeLanguage].split("\n").length
    return Array.from({ length: lines }, (_, i) => i + 1)
  }, [code, activeLanguage])

  const handleCodeChange = (value: string) => {
    setCode((prev) => ({
      ...prev,
      [activeLanguage]: value,
    }))
  }

  const handleRunCppCode = async () => {
    setIsRunning(true)
    setCppOutput("Compiling and running C++ code...\n")

    setTimeout(() => {
      setCppOutput(
        `Note: C++ execution requires a backend compiler.\n\n` +
          `Your code:\n${code.cpp}\n\n` +
          `To run C++ code, you need to:\n` +
          `1. Set up a backend API with C++ compiler\n` +
          `2. Send code to server for compilation\n` +
          `3. Return execution results\n\n` +
          `For now, this is a placeholder output.`,
      )
      setIsRunning(false)
    }, 1500)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code[activeLanguage])
    const btn = document.getElementById("copy-btn")
    if (btn) {
      btn.textContent = "✓ Copied!"
      setTimeout(() => {
        btn.textContent = ""
      }, 2000)
    }
  }

  const handleDownloadCode = () => {
    const extensions = { html: "html", css: "css", javascript: "js", cpp: "cpp" }
    const blob = new Blob([code[activeLanguage]], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${extensions[activeLanguage]}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleResetCode = () => {
    if (confirm("Are you sure you want to reset the code to default?")) {
      setCode(DEFAULT_CODE)
      setCppOutput("")
      setConsoleLogs([])
      executionIdRef.current = 0 // Reset execution ID
      setAiReviewData(null)
      setShowAIReview(false)
    }
  }

  const handleAIReview = async () => {
    const currentCode = code[activeLanguage]

    if (!currentCode.trim()) {
      alert("Please write some code first before requesting a review!")
      return
    }

    setShowAIReview(true)
    setIsLoadingReview(true)
    setAiReviewData(null)

    try {
      const response = await fetch("/api/ai/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: currentCode,
          language: LANGUAGE_LABELS[activeLanguage],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Show detailed error message
        const errorMsg = data.details 
          ? `${data.error}\n\n${data.details}` 
          : data.error || "Failed to generate review"
        
        throw new Error(errorMsg)
      }

      setAiReviewData(data)
    } catch (error) {
      console.error("AI Review Error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate AI review. Please try again."
      alert(errorMessage)
      setShowAIReview(false)
    } finally {
      setIsLoadingReview(false)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("code_playground_theme", newTheme)
  }

  if (!isOpen) return null

  const showSplitView = activeLanguage !== "cpp"

  // Theme classes
  const bgPrimary = theme === "dark" ? "bg-[#1e1e1e]" : "bg-white"
  const bgSecondary = theme === "dark" ? "bg-[#252526]" : "bg-gray-50"
  const bgTertiary = theme === "dark" ? "bg-[#2d2d30]" : "bg-gray-100"
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-900"
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600"
  const textTertiary = theme === "dark" ? "text-gray-500" : "text-gray-500"
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200"
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
  const activeBg = theme === "dark" ? "bg-[#37373d]" : "bg-white"
  const lineNumberBg = theme === "dark" ? "bg-[#1e1e1e]" : "bg-gray-50"
  const lineNumberText = theme === "dark" ? "text-gray-600" : "text-gray-400"

  return (
    <div className={`fixed top-0 right-0 h-screen z-50 transition-all duration-300 ease-in-out ${
      isOpen ? 'w-[40vw]' : 'w-0'
    } ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        className={`${bgPrimary} h-full shadow-2xl flex flex-col overflow-hidden border-l ${borderColor} transition-all duration-300 transform ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        {/* Header - VS Code Style */}
        <div className={`flex items-center justify-between px-4 py-2 ${bgSecondary} border-b ${borderColor}`}>
          <div className="flex items-center space-x-3">
            <Code2 className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
            <h2 className={`text-sm font-semibold ${textPrimary}`}>Code Playground</h2>

            {/* Auto-save status */}
            {autoSaveStatus && (
              <div className="flex items-center space-x-1.5 text-xs">
                {autoSaveStatus === "saving" ? (
                  <>
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-yellow-500">Saving...</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-green-500">Saved</span>
                  </>
                )}
              </div>
            )}
            
            {/* Execution status */}
            {isCodeExecuting && (
              <div className="flex items-center space-x-1.5 text-xs">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-500">Running...</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={toggleTheme}
              className={`p-2 ${hoverBg} rounded transition-colors ${textSecondary}`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className={`p-2 ${hoverBg} rounded transition-colors ${textSecondary} hover:text-red-500`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Bar - VS Code Style */}
        <div className={`flex items-center justify-between ${bgTertiary} border-b ${borderColor}`}>
          <div className="flex">
            {(Object.keys(LANGUAGE_LABELS) as Array<keyof CodeState>).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setActiveLanguage(lang)
                  setCppOutput("")
                  // Clear console when switching away from JavaScript
                  if (lang !== "javascript") {
                    setConsoleLogs([])
                  }
                }}
                className={`px-4 py-2 text-sm font-medium transition-all border-r ${borderColor} relative ${
                  activeLanguage === lang
                    ? `${activeBg} ${textPrimary} ${theme === "dark" ? "border-t-2 border-t-blue-500" : "border-t-2 border-t-blue-600"}`
                    : `${textSecondary} ${hoverBg}`
                }`}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>

          {/* Toolbar Actions */}
          <div className="flex items-center space-x-1 px-2">
            {showSplitView && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`p-1.5 ${hoverBg} rounded transition-colors ${textSecondary} text-xs flex items-center space-x-1`}
                title={showPreview ? "Hide Preview" : "Show Preview"}
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="hidden sm:inline">{showPreview ? "Hide" : "Show"}</span>
              </button>
            )}

            {activeLanguage === "cpp" && (
              <button
                onClick={handleRunCppCode}
                disabled={isRunning}
                className={`px-3 py-1.5 ${theme === "dark" ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white rounded text-xs font-medium flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isRunning ? "Running..." : "Run"}</span>
              </button>
            )}

            <button
              onClick={handleCopyCode}
              className={`p-1.5 ${hoverBg} rounded transition-colors ${textSecondary} relative group`}
              title="Copy Code"
            >
              <Copy className="w-4 h-4" />
              <span
                id="copy-btn"
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              ></span>
            </button>

            <button
              onClick={handleDownloadCode}
              className={`p-1.5 ${hoverBg} rounded transition-colors ${textSecondary}`}
              title="Download Code"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetCode}
              className={`p-1.5 ${hoverBg} rounded transition-colors ${textSecondary}`}
              title="Reset Code"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleAIReview}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center space-x-1.5 transition-all ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-400/50"
              }`}
              title="Get AI Code Review"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Review</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showSplitView ? (
            <>
              {/* Code Editor with Line Numbers - TOP */}
              <div className={`flex-1 flex flex-col border-b ${borderColor} overflow-hidden`}>
                <div
                  className={`px-3 py-1.5 ${bgTertiary} border-b ${borderColor} text-xs ${textTertiary} font-mono flex items-center justify-between`}
                >
                  <span>
                    {LANGUAGE_LABELS[activeLanguage].toLowerCase()}.
                    {activeLanguage === "javascript" ? "js" : activeLanguage}
                  </span>
                  <span>{code[activeLanguage].split("\n").length} lines</span>
                </div>
                <div className="flex-1 overflow-auto flex">
                  {/* Line Numbers */}
                  <div
                    className={`${lineNumberBg} ${lineNumberText} text-right py-4 px-3 font-mono text-sm select-none border-r ${borderColor} min-w-[50px]`}
                  >
                    {lineNumbers.map((num) => (
                      <div key={num} className="leading-6">
                        {num}
                      </div>
                    ))}
                  </div>

                  {/* Code Editor */}
                  <div className="flex-1 overflow-auto">
                    <textarea
                      ref={codeEditorRef}
                      value={code[activeLanguage]}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className={`w-full h-full p-4 ${bgPrimary} ${textPrimary} font-mono text-sm resize-none focus:outline-none`}
                      style={{
                        fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                        lineHeight: "1.5",
                        tabSize: 2,
                      }}
                      spellCheck={false}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                    />
                  </div>
                </div>
              </div>

              {/* Preview with Browser/Console Tabs - BOTTOM */}
              {showPreview && (
                <div className="h-[35vh] flex flex-col overflow-hidden">
                  <div
                    className={`flex items-center ${theme === "dark" ? "bg-[#252526]" : "bg-gray-100"} border-b ${borderColor}`}
                  >
                    <button
                      onClick={() => setPreviewTab("browser")}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        previewTab === "browser"
                          ? `${theme === "dark" ? "bg-[#1e1e1e] text-gray-100" : "bg-white text-gray-900"} border-b-2 ${theme === "dark" ? "border-blue-500" : "border-blue-600"}`
                          : `${textSecondary} ${hoverBg}`
                      }`}
                    >
                      Browser
                    </button>
                    <button
                      onClick={() => setPreviewTab("console")}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        previewTab === "console"
                          ? `${theme === "dark" ? "bg-[#1e1e1e] text-gray-100" : "bg-white text-gray-900"} border-b-2 ${theme === "dark" ? "border-blue-500" : "border-blue-600"}`
                          : `${textSecondary} ${hoverBg}`
                      }`}
                    >
                      Console
                      {consoleLogs.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                          {consoleLogs.length}
                        </span>
                      )}
                    </button>

                    {previewTab === "console" && (
                      <div className="ml-auto flex items-center space-x-3 px-3">
                        <label className="flex items-center space-x-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preserveLog}
                            onChange={(e) => setPreserveLog(e.target.checked)}
                            className="w-3.5 h-3.5"
                          />
                          <span className={`${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                            Preserve log
                          </span>
                        </label>
                        <button
                          onClick={() => setConsoleLogs([])}
                          className={`text-xs ${textSecondary} ${hoverBg} px-2 py-1 rounded transition-colors`}
                          title="Clear console"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Single iframe for both Browser and Console - Always rendered */}
                  <div className={`flex-1 overflow-auto ${previewTab === "browser" ? "bg-white" : "hidden"}`}>
                    <iframe
                      ref={iframeRef}
                      srcDoc={previewHTML}
                      className="w-full h-full border-0 bg-white"
                      title="Preview"
                      sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                    />
                  </div>

                  {/* Console Output Display */}
                  {previewTab === "console" && (
                    <div className={`flex-1 overflow-auto ${theme === "dark" ? "bg-[#1e1e1e]" : "bg-gray-900"} p-2`}>
                      {consoleLogs.length === 0 ? (
                        <div className="text-gray-500 text-sm font-mono p-2">
                          Console is empty. Run JavaScript code to see output here.
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          {consoleLogs.map((log, index) => (
                            <div
                              key={index}
                              className={`font-mono text-sm px-2 py-1 rounded ${
                                log.type === "error"
                                  ? "text-red-400 bg-red-950/20"
                                  : log.type === "warn"
                                    ? "text-yellow-400 bg-yellow-950/20"
                                    : log.type === "info"
                                      ? "text-blue-400 bg-blue-950/20"
                                      : "text-gray-100"
                              }`}
                            >
                              {log.message}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            // C++ Single View - TOP (Editor) / BOTTOM (Output)
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Code Editor with Line Numbers - TOP */}
              <div className={`flex-1 flex flex-col border-b ${borderColor} overflow-hidden`}>
                <div
                  className={`px-3 py-1.5 ${bgTertiary} border-b ${borderColor} text-xs ${textTertiary} font-mono flex items-center justify-between`}
                >
                  <span>main.cpp</span>
                  <span>{code.cpp.split("\n").length} lines</span>
                </div>
                <div className="flex-1 overflow-auto flex">
                  {/* Line Numbers */}
                  <div
                    className={`${lineNumberBg} ${lineNumberText} text-right py-4 px-3 font-mono text-sm select-none border-r ${borderColor} min-w-[50px]`}
                  >
                    {lineNumbers.map((num) => (
                      <div key={num} className="leading-6">
                        {num}
                      </div>
                    ))}
                  </div>

                  {/* Code Editor */}
                  <div className="flex-1 overflow-auto">
                    <textarea
                      ref={codeEditorRef}
                      value={code.cpp}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className={`w-full h-full p-4 ${bgPrimary} ${textPrimary} font-mono text-sm resize-none focus:outline-none`}
                      style={{
                        fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                        lineHeight: "1.5",
                        tabSize: 2,
                      }}
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>

              {/* Output Terminal - BOTTOM */}
              <div
                className={`h-[35vh] flex flex-col overflow-hidden ${theme === "dark" ? "bg-[#1e1e1e]" : "bg-gray-900"}`}
              >
                <div
                  className={`px-3 py-1.5 ${theme === "dark" ? "bg-[#252526]" : "bg-gray-800"} border-b ${theme === "dark" ? "border-gray-700" : "border-gray-700"} text-xs text-gray-400 font-mono flex items-center justify-between`}
                >
                  <span>⚡ output</span>
                  {cppOutput && (
                    <button onClick={() => setCppOutput("")} className="text-xs hover:text-white transition-colors">
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <pre className="text-gray-100 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                    {cppOutput || "Click 'Run' to execute your C++ code..."}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar - VS Code Style */}
        <div
          className={`px-3 py-1 ${bgSecondary} border-t ${borderColor} text-xs ${textSecondary} flex items-center justify-between`}
        >
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className={theme === "dark" ? "text-blue-400" : "text-blue-600"}>●</span>
              <span>{LANGUAGE_LABELS[activeLanguage]}</span>
            </span>
            <span>UTF-8</span>
            <span>Ln {code[activeLanguage].split("\n").length}, Col 1</span>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`${autoSaveStatus === "saved" ? "text-green-500" : autoSaveStatus === "saving" ? "text-yellow-500" : ""}`}
            >
              {autoSaveStatus === "saved" ? "✓ Auto-saved" : autoSaveStatus === "saving" ? "Saving..." : ""}
            </span>
            <span className={textTertiary}>Lesson: {lessonId}</span>
          </div>
        </div>
      </div>

      {/* AI Review Modal */}
      {showAIReview && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className={`${bgPrimary} rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border ${borderColor} animate-in zoom-in-95 duration-200`}
          >
            <div className={`flex items-center justify-between px-6 py-4 ${bgSecondary} border-b ${borderColor}`}>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${textPrimary}`}>AI Code Review</h3>
                  <p className={`text-xs ${textSecondary}`}>{LANGUAGE_LABELS[activeLanguage]} Analysis</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIReview(false)}
                className={`p-2 ${hoverBg} rounded transition-colors ${textSecondary} hover:text-red-500`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-6">
              {isLoadingReview ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <Sparkles className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <p className={`text-sm ${textSecondary} animate-pulse`}>Analyzing your code...</p>
                </div>
              ) : aiReviewData ? (
                <div className="space-y-6">
                  <div className={`${bgSecondary} rounded-lg p-6 border ${borderColor}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-sm font-medium ${textSecondary} mb-1`}>Overall Score</h4>
                        <div className="flex items-baseline space-x-2">
                          <span
                            className={`text-4xl font-bold ${
                              aiReviewData.score >= 8
                                ? "text-green-500"
                                : aiReviewData.score >= 6
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }`}
                          >
                            {aiReviewData.score.toFixed(1)}
                          </span>
                          <span className={`text-2xl ${textSecondary}`}>/10</span>
                        </div>
                      </div>
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className={theme === "dark" ? "text-gray-700" : "text-gray-200"}
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${(aiReviewData.score / 10) * 251.2} 251.2`}
                            className={
                              aiReviewData.score >= 8
                                ? "text-green-500"
                                : aiReviewData.score >= 6
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold ${textPrimary} mb-3 flex items-center space-x-2`}>
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Strengths</span>
                    </h4>
                    <ul className="space-y-2">
                      {aiReviewData.pros.map((pro, index) => (
                        <li
                          key={index}
                          className={`${bgSecondary} rounded-lg p-3 border-l-4 border-green-500 ${textPrimary} text-sm`}
                        >
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold ${textPrimary} mb-3 flex items-center space-x-2`}>
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span>Areas for Improvement</span>
                    </h4>
                    <ul className="space-y-2">
                      {aiReviewData.cons.map((con, index) => (
                        <li
                          key={index}
                          className={`${bgSecondary} rounded-lg p-3 border-l-4 border-red-500 ${textPrimary} text-sm`}
                        >
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold ${textPrimary} mb-3 flex items-center space-x-2`}>
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Suggestions</span>
                    </h4>
                    <ul className="space-y-2">
                      {aiReviewData.suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className={`${bgSecondary} rounded-lg p-3 border-l-4 border-blue-500 ${textPrimary} text-sm`}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
