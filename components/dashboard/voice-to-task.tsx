"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, ChevronDown, ChevronUp, Loader2, CheckCircle2, Volume2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { parseStreamingResponse, extractJSON, GeneratedTask } from "@/lib/ai-context"

export function VoiceToTask() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [tasks, setTasks] = useState<GeneratedTask[]>([])
  const [error, setError] = useState("")
  const [textInput, setTextInput] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript
        }
        setTranscript(finalTranscript)
      }

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError("Error: " + event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not supported in this browser")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      if (transcript.trim()) {
        processTranscript(transcript.trim())
      }
    } else {
      setTranscript("")
      setError("")
      setTasks([])
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const processTranscript = async (text: string) => {
    setIsProcessing(true)
    setError("")

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "tasks",
          input: text,
          context: { source: "voice" },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate tasks")
      }

      const fullText = await parseStreamingResponse(response)
      const parsedTasks = extractJSON(fullText) as GeneratedTask[]
      
      if (Array.isArray(parsedTasks)) {
        setTasks(parsedTasks)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("Voice processing error:", err)
      setError("Failed to process. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      setTranscript(textInput.trim())
      processTranscript(textInput.trim())
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const reset = () => {
    setTranscript("")
    setTasks([])
    setError("")
    setTextInput("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">Voice to Task</h3>
            <p className="text-sm text-muted-foreground">Speak your requirements naturally</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Voice Recording Section */}
            {tasks.length === 0 && !isProcessing && (
              <div className="space-y-4">
                {/* Microphone Button */}
                <div className="flex flex-col items-center gap-4 py-4">
                  <motion.button
                    onClick={toggleListening}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      isListening
                        ? "bg-gradient-to-br from-red-500 to-pink-500"
                        : "bg-gradient-to-br from-pink-500 to-rose-500"
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-8 h-8 text-white" />
                    ) : (
                      <Mic className="w-8 h-8 text-white" />
                    )}
                    
                    {/* Pulse effect when listening */}
                    {isListening && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-full bg-red-500"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full bg-red-500"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                      </>
                    )}
                  </motion.button>
                  
                  <p className="text-sm text-muted-foreground">
                    {isListening ? "Click to stop and process" : "Click to start recording"}
                  </p>
                </div>

                {/* Live Transcript */}
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="w-4 h-4 text-pink-400" />
                      <span className="text-xs text-pink-400">Live transcript</span>
                    </div>
                    <p className="text-foreground text-sm">{transcript}</p>
                  </motion.div>
                )}

                {/* Or Text Input */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or type instead</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
                    placeholder="Type your requirements..."
                    className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all text-sm"
                  />
                  <Button
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim()}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white rounded-xl px-6"
                  >
                    Process
                  </Button>
                </div>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
                      <Mic className="w-8 h-8 text-pink-400" />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-pink-500"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-medium">Processing voice input...</p>
                    <p className="text-sm text-muted-foreground">Extracting tasks from your requirements</p>
                  </div>
                  <Loader2 className="w-5 h-5 text-pink-400 animate-spin" />
                  
                  {/* Show what's being processed */}
                  {transcript && (
                    <p className="text-xs text-muted-foreground italic max-w-md text-center">
                      &ldquo;{transcript}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Generated Tasks */}
            {tasks.length > 0 && (
              <div className="space-y-4">
                {/* Success message */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">{tasks.length} tasks generated from voice input</span>
                </motion.div>

                {/* Original transcript */}
                {transcript && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Original input:</p>
                    <p className="text-sm text-foreground">{transcript}</p>
                  </div>
                )}

                {/* Task List */}
                <div className="space-y-2">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-pink-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-foreground font-medium">{task.title}</p>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          )}
                          {task.category && (
                            <span className="text-xs text-muted-foreground mt-2 inline-block">
                              {task.category}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Reset Button */}
                <Button
                  onClick={reset}
                  variant="outline"
                  className="w-full border-pink-500/30 hover:bg-pink-500/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Record New Voice Input
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
