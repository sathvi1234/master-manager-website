"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, ChevronDown, ChevronUp, Loader2, CheckCircle2, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GeneratedTask {
  id: number
  title: string
  priority: "high" | "medium" | "low"
}

export function VoiceToTask() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [tasks, setTasks] = useState<GeneratedTask[]>([])
  const [error, setError] = useState("")
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
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            finalTranscript += event.results[i][0].transcript
          }
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
        processTranscript()
      }
    } else {
      setTranscript("")
      setError("")
      setTasks([])
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const processTranscript = () => {
    setIsProcessing(true)
    
    // Simulate AI processing
    setTimeout(() => {
      const sampleTasks: GeneratedTask[] = [
        { id: 1, title: "Review authentication requirements", priority: "high" },
        { id: 2, title: "Create UI mockups for dashboard", priority: "medium" },
        { id: 3, title: "Set up project repository", priority: "high" },
        { id: 4, title: "Document API specifications", priority: "low" },
      ]
      setTasks(sampleTasks)
      setIsProcessing(false)
    }, 1500)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-muted text-muted-foreground"
    }
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
            <p className="text-sm text-muted-foreground">Convert speech into actionable tasks</p>
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
            {/* Microphone Button */}
            <div className="flex flex-col items-center mb-6">
              <motion.button
                onClick={toggleListening}
                whileTap={{ scale: 0.95 }}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-gradient-to-br from-pink-500 to-rose-500"
                    : "bg-muted border border-border hover:border-pink-500/50"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className={`w-8 h-8 ${isListening ? "text-white" : "text-muted-foreground"}`} />
                )}
                
                {/* Listening animation rings */}
                {isListening && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-pink-500"
                      animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-pink-500"
                      animate={{ scale: [1, 1.8, 1.8], opacity: [0.5, 0, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    />
                  </>
                )}
              </motion.button>
              
              <p className="text-sm text-muted-foreground mt-3">
                {isListening ? "Listening... Click to stop" : "Click to start speaking"}
              </p>
            </div>

            {/* Transcript Display */}
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-muted/30 border border-border/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-pink-400" />
                  <span className="text-sm font-medium text-foreground">Transcript</span>
                </div>
                <p className="text-muted-foreground">{transcript}</p>
              </motion.div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="flex items-center justify-center py-6">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
                  <span className="text-sm text-muted-foreground">Converting to tasks...</span>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Generated Tasks */}
            {tasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-muted-foreground">
                    {tasks.length} tasks generated from voice
                  </span>
                </div>
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-pink-500/20 flex items-center justify-center text-xs text-pink-400 font-medium">
                        {index + 1}
                      </div>
                      <span className="text-foreground">{task.title}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
