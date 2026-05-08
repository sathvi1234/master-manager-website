"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, 
  Brain, 
  ListTodo, 
  Rocket, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  Play,
  Loader2,
  RefreshCw,
  Sparkles,
  Users,
  Database,
  CreditCard,
  MapPin,
  Calendar,
  FileText,
  Shield,
  Video,
  Package,
  Search,
  Settings,
  BarChart3,
  Lock,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAIContext, WorkflowStep } from "@/lib/ai-context"
import { detectDomain, sanitizeInput } from "@/lib/ai-service"

// Extended icon mapping for dynamic workflows
const iconMap: Record<string, React.ElementType> = {
  // Default steps
  "Client Input": MessageSquare,
  "AI Analysis": Brain,
  "Task Generation": ListTodo,
  "Execution": Rocket,
  // Common workflow steps
  "Setup": Settings,
  "Authentication": Lock,
  "Auth": Lock,
  "User Auth": Lock,
  "Database": Database,
  "Backend": Database,
  "API": Database,
  "Frontend": ListTodo,
  "UI": ListTodo,
  "Dashboard": BarChart3,
  "Analytics": BarChart3,
  "Testing": Shield,
  "QA": Shield,
  "Deployment": Rocket,
  "Launch": Rocket,
  "Integration": Zap,
  "Integrations": Zap,
  // Domain-specific
  "Restaurant": Package,
  "Menu": FileText,
  "Order": Package,
  "Cart": Package,
  "Checkout": CreditCard,
  "Payment": CreditCard,
  "Payments": CreditCard,
  "Tracking": MapPin,
  "Delivery": MapPin,
  "Patient": Users,
  "Doctor": Users,
  "Appointment": Calendar,
  "Scheduling": Calendar,
  "Records": FileText,
  "Medical": FileText,
  "Telemedicine": Video,
  "Video": Video,
  "Product": Package,
  "Catalog": Search,
  "Inventory": Package,
  "Shipping": MapPin,
}

// Color palette for workflow steps
const colorPalette = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-yellow-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-purple-500",
  "from-teal-500 to-cyan-500",
  "from-amber-500 to-orange-500",
]

// Domain-specific workflow templates for intelligent fallback
const WORKFLOW_TEMPLATES: Record<string, WorkflowStep[]> = {
  food: [
    { id: 1, title: "Authentication", description: "User login and registration system", tasks: ["Phone OTP verification", "Social login integration", "Session management"] },
    { id: 2, title: "Restaurant Listings", description: "Browse and discover restaurants", tasks: ["Restaurant database setup", "Search and filters", "Ratings display"] },
    { id: 3, title: "Cart System", description: "Shopping cart functionality", tasks: ["Add/remove items", "Item customization", "Price calculation"] },
    { id: 4, title: "Payment Integration", description: "Secure payment processing", tasks: ["Payment gateway setup", "Order confirmation", "Invoice generation"] },
    { id: 5, title: "Order Tracking", description: "Real-time delivery tracking", tasks: ["GPS integration", "Status updates", "Delivery notifications"] },
  ],
  healthcare: [
    { id: 1, title: "Patient Management", description: "Patient registration and profiles", tasks: ["Patient onboarding", "Medical history", "Document uploads"] },
    { id: 2, title: "Doctor Scheduling", description: "Manage doctor availability", tasks: ["Calendar integration", "Time slot management", "Specialty filters"] },
    { id: 3, title: "Appointments", description: "Book and manage appointments", tasks: ["Online booking", "Reminders", "Rescheduling"] },
    { id: 4, title: "Medical Records", description: "Electronic health records", tasks: ["Secure storage", "Access controls", "History tracking"] },
    { id: 5, title: "Telemedicine", description: "Virtual consultations", tasks: ["Video calls", "E-prescriptions", "Follow-ups"] },
  ],
  ecommerce: [
    { id: 1, title: "Product Catalog", description: "Product listing and management", tasks: ["Product database", "Categories", "Inventory sync"] },
    { id: 2, title: "User Accounts", description: "Customer authentication", tasks: ["Registration", "Profiles", "Wishlist"] },
    { id: 3, title: "Shopping Cart", description: "Cart and checkout flow", tasks: ["Add to cart", "Quantity management", "Promo codes"] },
    { id: 4, title: "Payment Gateway", description: "Secure transactions", tasks: ["Multiple payment options", "Fraud detection", "Receipts"] },
    { id: 5, title: "Order Fulfillment", description: "Order processing and shipping", tasks: ["Order management", "Shipping integration", "Tracking"] },
  ],
  fintech: [
    { id: 1, title: "KYC Verification", description: "Know your customer process", tasks: ["Document upload", "Identity verification", "Compliance checks"] },
    { id: 2, title: "Account Setup", description: "User account creation", tasks: ["Secure registration", "Account linking", "Profile setup"] },
    { id: 3, title: "Transaction Engine", description: "Core transaction processing", tasks: ["Fund transfers", "Balance management", "Transaction history"] },
    { id: 4, title: "Security Layer", description: "Security and fraud prevention", tasks: ["2FA authentication", "Fraud detection", "Audit logging"] },
    { id: 5, title: "Analytics", description: "Financial insights and reports", tasks: ["Spending analysis", "Budgeting tools", "Export reports"] },
  ],
  social: [
    { id: 1, title: "User Profiles", description: "Profile creation and management", tasks: ["Profile setup", "Avatar upload", "Bio and interests"] },
    { id: 2, title: "Feed System", description: "Content feed and discovery", tasks: ["Post creation", "Feed algorithm", "Content moderation"] },
    { id: 3, title: "Social Graph", description: "Connections and relationships", tasks: ["Follow/unfollow", "Friend suggestions", "Block/mute"] },
    { id: 4, title: "Messaging", description: "Direct and group messaging", tasks: ["Real-time chat", "Group creation", "Media sharing"] },
    { id: 5, title: "Notifications", description: "Activity notifications", tasks: ["Push notifications", "Email digests", "Preferences"] },
  ],
  education: [
    { id: 1, title: "Course Management", description: "Create and manage courses", tasks: ["Course builder", "Content upload", "Curriculum design"] },
    { id: 2, title: "Student Portal", description: "Student dashboard and progress", tasks: ["Enrollment", "Progress tracking", "Certificates"] },
    { id: 3, title: "Learning Delivery", description: "Content delivery system", tasks: ["Video streaming", "Interactive content", "Downloads"] },
    { id: 4, title: "Assessments", description: "Quizzes and examinations", tasks: ["Quiz builder", "Auto-grading", "Result analytics"] },
    { id: 5, title: "Communication", description: "Student-teacher interaction", tasks: ["Discussion forums", "Live sessions", "Feedback system"] },
  ],
  travel: [
    { id: 1, title: "Search & Discovery", description: "Find travel options", tasks: ["Flight search", "Hotel search", "Package deals"] },
    { id: 2, title: "Booking Engine", description: "Reservation system", tasks: ["Availability check", "Booking flow", "Confirmation"] },
    { id: 3, title: "Payment Processing", description: "Secure payments", tasks: ["Multiple currencies", "Payment gateway", "Refunds"] },
    { id: 4, title: "Itinerary Management", description: "Trip planning tools", tasks: ["Trip builder", "Calendar sync", "Sharing"] },
    { id: 5, title: "Travel Support", description: "Customer assistance", tasks: ["Live chat", "Cancellations", "Travel alerts"] },
  ],
  general: [
    { id: 1, title: "Project Setup", description: "Initialize project infrastructure", tasks: ["Repository setup", "CI/CD pipeline", "Environment config"] },
    { id: 2, title: "Authentication", description: "User auth and authorization", tasks: ["Login/signup", "Role management", "Session handling"] },
    { id: 3, title: "Core Features", description: "Build main functionality", tasks: ["Dashboard UI", "CRUD operations", "Data management"] },
    { id: 4, title: "Integrations", description: "Third-party services", tasks: ["API connections", "Webhooks", "External services"] },
    { id: 5, title: "Launch", description: "Testing and deployment", tasks: ["QA testing", "Performance tuning", "Production deploy"] },
  ],
}

// Get icon for a step title
function getIconForStep(title: string): React.ElementType {
  const lowerTitle = title.toLowerCase()
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerTitle.includes(key.toLowerCase())) {
      return icon
    }
  }
  
  return ListTodo
}

// Generate workflow based on input using intelligent keyword detection
function generateWorkflowFromInput(input: string): WorkflowStep[] {
  const domain = detectDomain(input)
  const template = WORKFLOW_TEMPLATES[domain] || WORKFLOW_TEMPLATES.general
  
  // Clone and customize based on input keywords
  return template.map((step, index) => ({
    ...step,
    id: index + 1,
  }))
}

export function WorkflowVisualization() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([])
  const [input, setInput] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [generatedFrom, setGeneratedFrom] = useState<string>("")
  
  const { currentRequirement } = useAIContext()

  // Create display steps with icons and colors
  const displaySteps = workflow.map((step, i) => ({
    ...step,
    icon: getIconForStep(step.title),
    color: colorPalette[i % colorPalette.length]
  }))

  // Auto-advance animation
  useEffect(() => {
    if (!isAnimating || displaySteps.length === 0) return

    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % displaySteps.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [isAnimating, displaySteps.length])

  const generateWorkflow = async () => {
    const requirement = sanitizeInput(input.trim() || currentRequirement || "")
    if (!requirement) {
      // Generate a default workflow if no input
      const defaultWorkflow = generateWorkflowFromInput("general project")
      setWorkflow(defaultWorkflow)
      setGeneratedFrom("Default workflow")
      setIsAnimating(true)
      return
    }
    
    setIsGenerating(true)
    setWorkflow([])
    setActiveStep(0)

    // Simulate brief processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800))

    try {
      // Try API first
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "workflow",
          input: requirement,
        }),
      })

      if (response.ok) {
        const text = await response.text()
        // Try to parse JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0])
            if (Array.isArray(parsed) && parsed.length > 0) {
              setWorkflow(parsed)
              setGeneratedFrom("AI-generated")
              setIsAnimating(true)
              setIsGenerating(false)
              return
            }
          } catch {
            // Fall through to fallback
          }
        }
      }
    } catch {
      // Fall through to fallback
    }

    // Use intelligent fallback - always generates something relevant
    const fallbackWorkflow = generateWorkflowFromInput(requirement)
    setWorkflow(fallbackWorkflow)
    setGeneratedFrom(`${detectDomain(requirement).charAt(0).toUpperCase() + detectDomain(requirement).slice(1)} workflow`)
    setIsAnimating(true)
    setIsGenerating(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <ListTodo className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">Workflow Visualization</h3>
            <p className="text-sm text-muted-foreground">Dynamic execution pipeline</p>
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
            {/* Generate Workflow Section */}
            {workflow.length === 0 && !isGenerating && (
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your project... (e.g., 'Food delivery app' or 'Hospital management system')"
                    className="w-full h-20 bg-muted/30 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all text-sm"
                  />
                  <Sparkles className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                </div>
                <Button
                  onClick={generateWorkflow}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white rounded-xl py-5"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Generate Workflow
                </Button>
                
                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-2">
                  {["Food delivery app", "Hospital system", "E-commerce store", "Social media"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="px-3 py-1.5 text-xs rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all border border-border/50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Generating State */}
            {isGenerating && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                      <ListTodo className="w-8 h-8 text-green-400" />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-green-500"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-foreground font-medium">Analyzing requirements...</span>
                    <p className="text-sm text-muted-foreground mt-1">Creating your custom workflow pipeline</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
                    <span className="text-xs text-muted-foreground">Mapping execution steps</span>
                  </div>
                </div>
              </div>
            )}

            {/* Workflow Display */}
            {workflow.length > 0 && !isGenerating && (
              <>
                {/* Workflow Controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {workflow.length} steps
                    </span>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted/50 rounded-full">
                      {generatedFrom}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAnimating(!isAnimating)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isAnimating 
                          ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                          : "bg-muted text-muted-foreground border border-border hover:border-green-500/30"
                      }`}
                    >
                      {isAnimating ? "Auto-playing" : "Paused"}
                    </button>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border hover:border-primary/50 transition-all"
                    >
                      {showDetails ? "Hide Tasks" : "Show Tasks"}
                    </button>
                  </div>
                </div>

                {/* Workflow Steps Visualization */}
                <div className="relative">
                  {/* Animated Connection Line */}
                  <div className="absolute top-8 left-8 right-8 h-1 bg-muted/50 rounded-full z-0 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-500"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((activeStep + 1) / displaySteps.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    {/* Animated pulse on the line */}
                    <motion.div
                      className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ left: ["-10%", "110%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="relative z-10 flex justify-between">
                    {displaySteps.map((step, index) => {
                      const isActive = index === activeStep
                      const isCompleted = index < activeStep
                      const Icon = step.icon

                      return (
                        <motion.div
                          key={step.id}
                          className="flex flex-col items-center cursor-pointer group"
                          onClick={() => {
                            setActiveStep(index)
                            setIsAnimating(false)
                          }}
                          whileHover={{ scale: 1.02 }}
                        >
                          {/* Step Node */}
                          <motion.div
                            animate={{
                              scale: isActive ? 1.15 : 1,
                              boxShadow: isActive 
                                ? `0 0 30px rgba(34, 197, 94, 0.5)` 
                                : "0 0 0px rgba(34, 197, 94, 0)",
                            }}
                            transition={{ duration: 0.3 }}
                            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                              isActive || isCompleted
                                ? `bg-gradient-to-br ${step.color}`
                                : "bg-muted border-2 border-border group-hover:border-green-500/50"
                            }`}
                          >
                            <Icon className={`w-7 h-7 ${isActive || isCompleted ? "text-white" : "text-muted-foreground group-hover:text-foreground"}`} />
                            
                            {/* Active Pulse Effect */}
                            {isActive && (
                              <>
                                <motion.div
                                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color}`}
                                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                                <motion.div
                                  className="absolute -inset-1 rounded-2xl border-2 border-green-400/50"
                                  animate={{ scale: [1, 1.1], opacity: [0.5, 0] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                />
                              </>
                            )}

                            {/* Completed checkmark */}
                            {isCompleted && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                              >
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </motion.div>
                            )}
                          </motion.div>

                          {/* Step Label */}
                          <motion.div
                            animate={{ opacity: isActive ? 1 : 0.7 }}
                            className="mt-3 text-center max-w-[90px]"
                          >
                            <p className={`text-xs font-medium truncate ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                              {step.title}
                            </p>
                          </motion.div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Active Step Details Card */}
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${displaySteps[activeStep]?.color || colorPalette[0]} flex items-center justify-center shrink-0`}>
                      {(() => {
                        const Icon = displaySteps[activeStep]?.icon || ListTodo
                        return <Icon className="w-6 h-6 text-white" />
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-foreground font-semibold">{displaySteps[activeStep]?.title}</p>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          Step {activeStep + 1} of {displaySteps.length}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{displaySteps[activeStep]?.description}</p>
                      
                      {/* Tasks list */}
                      {showDetails && displaySteps[activeStep]?.tasks && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t border-border/50"
                        >
                          <p className="text-xs font-medium text-muted-foreground mb-3">Tasks in this stage:</p>
                          <div className="grid gap-2">
                            {displaySteps[activeStep].tasks.map((task, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                              >
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${displaySteps[activeStep]?.color || colorPalette[0]}`} />
                                <span className="text-sm text-foreground">{task}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </div>
                </motion.div>

                {/* Reset Button */}
                <Button
                  onClick={() => { 
                    setWorkflow([])
                    setInput("")
                    setActiveStep(0)
                    setIsAnimating(false)
                    setGeneratedFrom("")
                  }}
                  variant="outline"
                  className="w-full mt-6 border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New Workflow
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
