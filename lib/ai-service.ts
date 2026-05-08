"use client"

// AI Service with intelligent fallback mock generation
// Tries real API first, falls back to context-aware mock data

import type { Task, PRDData, WorkflowStep, ClarificationQuestion, ScopeAnalysis } from "./ai-context"

// Domain keywords for intelligent mock generation
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  food: ["food", "delivery", "restaurant", "order", "menu", "kitchen", "chef", "meal", "cuisine", "dining"],
  healthcare: ["hospital", "patient", "doctor", "medical", "health", "clinic", "appointment", "diagnosis", "treatment", "medicine"],
  ecommerce: ["shop", "store", "product", "cart", "checkout", "payment", "inventory", "catalog", "order", "shipping"],
  fintech: ["bank", "payment", "transaction", "wallet", "finance", "money", "transfer", "account", "loan", "investment"],
  social: ["social", "post", "feed", "follow", "friend", "message", "chat", "profile", "share", "community"],
  education: ["learn", "course", "student", "teacher", "class", "education", "training", "school", "university", "quiz"],
  realestate: ["property", "real estate", "house", "apartment", "rent", "buy", "listing", "agent", "tenant", "landlord"],
  travel: ["travel", "booking", "hotel", "flight", "trip", "vacation", "destination", "tourism", "reservation", "itinerary"],
  fitness: ["fitness", "workout", "gym", "exercise", "health", "trainer", "nutrition", "diet", "wellness", "sports"],
  hr: ["hr", "employee", "hiring", "recruitment", "payroll", "attendance", "leave", "performance", "onboarding", "staff"],
}

// Detect domain from input
export function detectDomain(input: string): string {
  const lowerInput = input.toLowerCase()
  
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (keywords.some(keyword => lowerInput.includes(keyword))) {
      return domain
    }
  }
  
  return "general"
}

// Sanitize input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, 2000)
}

// Domain-specific task templates
const DOMAIN_TASKS: Record<string, Task[]> = {
  food: [
    { id: 1, title: "Set up restaurant database schema with menu items and categories", priority: "high", estimate: "4h", category: "database" },
    { id: 2, title: "Implement user authentication with phone OTP verification", priority: "high", estimate: "6h", category: "auth" },
    { id: 3, title: "Build restaurant listing with filters and search", priority: "high", estimate: "8h", category: "frontend" },
    { id: 4, title: "Create menu management API for restaurant owners", priority: "high", estimate: "5h", category: "backend" },
    { id: 5, title: "Implement shopping cart with item customization", priority: "high", estimate: "6h", category: "frontend" },
    { id: 6, title: "Integrate payment gateway (Stripe/Razorpay)", priority: "high", estimate: "4h", category: "backend" },
    { id: 7, title: "Build real-time order tracking with WebSockets", priority: "medium", estimate: "8h", category: "backend" },
    { id: 8, title: "Create delivery partner assignment algorithm", priority: "medium", estimate: "6h", category: "backend" },
  ],
  healthcare: [
    { id: 1, title: "Design HIPAA-compliant database schema for patient records", priority: "high", estimate: "6h", category: "database" },
    { id: 2, title: "Implement secure authentication with role-based access", priority: "high", estimate: "8h", category: "auth" },
    { id: 3, title: "Build patient registration and profile management", priority: "high", estimate: "6h", category: "frontend" },
    { id: 4, title: "Create appointment scheduling system with availability", priority: "high", estimate: "10h", category: "backend" },
    { id: 5, title: "Implement doctor dashboard with patient history", priority: "high", estimate: "8h", category: "frontend" },
    { id: 6, title: "Build prescription management and e-prescription", priority: "medium", estimate: "6h", category: "backend" },
    { id: 7, title: "Create medical records viewer with document upload", priority: "medium", estimate: "5h", category: "frontend" },
    { id: 8, title: "Implement video consultation integration", priority: "medium", estimate: "8h", category: "backend" },
  ],
  ecommerce: [
    { id: 1, title: "Design product catalog database with variants and inventory", priority: "high", estimate: "5h", category: "database" },
    { id: 2, title: "Implement user auth with social login options", priority: "high", estimate: "6h", category: "auth" },
    { id: 3, title: "Build product listing with advanced filters and search", priority: "high", estimate: "8h", category: "frontend" },
    { id: 4, title: "Create shopping cart with persistent storage", priority: "high", estimate: "5h", category: "frontend" },
    { id: 5, title: "Implement checkout flow with address management", priority: "high", estimate: "6h", category: "frontend" },
    { id: 6, title: "Integrate payment gateway with multiple options", priority: "high", estimate: "6h", category: "backend" },
    { id: 7, title: "Build order management and tracking system", priority: "medium", estimate: "8h", category: "backend" },
    { id: 8, title: "Create admin panel for inventory management", priority: "medium", estimate: "10h", category: "frontend" },
  ],
  fintech: [
    { id: 1, title: "Design secure database schema with encryption at rest", priority: "high", estimate: "6h", category: "database" },
    { id: 2, title: "Implement KYC verification and secure authentication", priority: "high", estimate: "10h", category: "auth" },
    { id: 3, title: "Build account dashboard with transaction history", priority: "high", estimate: "8h", category: "frontend" },
    { id: 4, title: "Create fund transfer API with fraud detection", priority: "high", estimate: "12h", category: "backend" },
    { id: 5, title: "Implement real-time balance updates and notifications", priority: "high", estimate: "6h", category: "backend" },
    { id: 6, title: "Build payment request and split bill features", priority: "medium", estimate: "8h", category: "frontend" },
    { id: 7, title: "Create spending analytics and budgeting tools", priority: "medium", estimate: "8h", category: "frontend" },
    { id: 8, title: "Implement audit logging and compliance reports", priority: "medium", estimate: "6h", category: "backend" },
  ],
  general: [
    { id: 1, title: "Set up project database schema and models", priority: "high", estimate: "4h", category: "database" },
    { id: 2, title: "Implement user authentication and authorization", priority: "high", estimate: "6h", category: "auth" },
    { id: 3, title: "Build responsive landing page and navigation", priority: "high", estimate: "5h", category: "frontend" },
    { id: 4, title: "Create core API endpoints with validation", priority: "high", estimate: "6h", category: "backend" },
    { id: 5, title: "Design and implement main dashboard UI", priority: "high", estimate: "8h", category: "frontend" },
    { id: 6, title: "Add data visualization and analytics", priority: "medium", estimate: "6h", category: "frontend" },
    { id: 7, title: "Implement notification system", priority: "medium", estimate: "4h", category: "backend" },
    { id: 8, title: "Add settings and profile management", priority: "low", estimate: "4h", category: "frontend" },
  ],
}

// Domain-specific PRD templates
const DOMAIN_PRDS: Record<string, (input: string) => PRDData> = {
  food: (input: string) => ({
    projectOverview: {
      title: extractProjectName(input, "Food Delivery Platform"),
      description: `A modern food delivery application that connects customers with local restaurants. Features include real-time order tracking, secure payments, and personalized recommendations based on user preferences.`,
      domain: "Food & Beverage",
      targetUsers: ["Customers", "Restaurant Owners", "Delivery Partners", "Admin"]
    },
    features: [
      { name: "Restaurant Discovery", description: "Browse nearby restaurants with filters for cuisine, rating, delivery time", priority: "must-have" },
      { name: "Menu Management", description: "Restaurant owners can manage menus, prices, and availability in real-time", priority: "must-have" },
      { name: "Order Tracking", description: "Real-time GPS tracking of order from restaurant to delivery", priority: "must-have" },
      { name: "Smart Recommendations", description: "AI-powered food recommendations based on order history and preferences", priority: "should-have" },
      { name: "Loyalty Program", description: "Points and rewards system for repeat customers", priority: "nice-to-have" }
    ],
    userRoles: [
      { role: "Customer", permissions: ["browse_restaurants", "place_orders", "track_orders", "leave_reviews"], description: "End users who order food" },
      { role: "Restaurant Owner", permissions: ["manage_menu", "view_orders", "update_status", "view_analytics"], description: "Business owners managing their restaurant" },
      { role: "Delivery Partner", permissions: ["view_assigned_orders", "update_location", "complete_delivery"], description: "Drivers fulfilling deliveries" }
    ],
    technicalRequirements: {
      frontend: ["React/Next.js", "Real-time maps integration", "PWA support", "Push notifications"],
      backend: ["Node.js/Express", "WebSocket for real-time updates", "Queue system for order management"],
      database: ["PostgreSQL for relational data", "Redis for caching and sessions"],
      integrations: ["Payment gateway", "Maps API", "SMS/Push notifications", "Analytics"]
    },
    risks: [
      { risk: "High delivery partner churn rate", mitigation: "Implement incentive programs and fair compensation", severity: "medium" },
      { risk: "Restaurant onboarding delays", mitigation: "Create streamlined onboarding with support team", severity: "low" }
    ]
  }),
  
  healthcare: (input: string) => ({
    projectOverview: {
      title: extractProjectName(input, "Healthcare Management System"),
      description: `A comprehensive healthcare platform for managing patient records, appointments, and telemedicine consultations. Built with HIPAA compliance and data security as core requirements.`,
      domain: "Healthcare",
      targetUsers: ["Patients", "Doctors", "Nurses", "Administrative Staff", "Hospital Admin"]
    },
    features: [
      { name: "Patient Portal", description: "Secure access to medical records, test results, and prescriptions", priority: "must-have" },
      { name: "Appointment Scheduling", description: "Online booking with doctor availability and calendar integration", priority: "must-have" },
      { name: "Telemedicine", description: "Video consultation with screen sharing and prescription generation", priority: "must-have" },
      { name: "Electronic Health Records", description: "Centralized patient history accessible to authorized providers", priority: "must-have" },
      { name: "Lab Integration", description: "Automatic import of lab results and diagnostic reports", priority: "should-have" }
    ],
    userRoles: [
      { role: "Patient", permissions: ["view_records", "book_appointments", "message_doctor", "view_prescriptions"], description: "Individuals seeking healthcare" },
      { role: "Doctor", permissions: ["view_patient_history", "write_prescriptions", "order_tests", "conduct_consultations"], description: "Licensed medical practitioners" },
      { role: "Admin", permissions: ["manage_users", "view_reports", "configure_system", "audit_logs"], description: "Hospital administrative staff" }
    ],
    technicalRequirements: {
      frontend: ["React with WCAG accessibility", "Responsive design for tablets", "Offline support"],
      backend: ["HIPAA-compliant architecture", "End-to-end encryption", "Audit logging"],
      database: ["Encrypted PostgreSQL", "Secure backup system", "Data retention policies"],
      integrations: ["HL7/FHIR for health data exchange", "Lab systems", "Insurance verification", "Video calling API"]
    },
    risks: [
      { risk: "HIPAA compliance violations", mitigation: "Regular security audits and staff training", severity: "high" },
      { risk: "Data breach exposure", mitigation: "Multi-layer encryption and access controls", severity: "high" }
    ]
  }),
  
  ecommerce: (input: string) => ({
    projectOverview: {
      title: extractProjectName(input, "E-Commerce Platform"),
      description: `A scalable e-commerce solution with product catalog, inventory management, secure checkout, and order fulfillment. Designed for seamless shopping experience across devices.`,
      domain: "E-Commerce",
      targetUsers: ["Shoppers", "Sellers", "Admin", "Warehouse Staff"]
    },
    features: [
      { name: "Product Catalog", description: "Browsable product listings with categories, filters, and search", priority: "must-have" },
      { name: "Shopping Cart", description: "Persistent cart with saved items and quick checkout", priority: "must-have" },
      { name: "Secure Checkout", description: "Multi-step checkout with various payment options", priority: "must-have" },
      { name: "Order Management", description: "Track orders from placement to delivery with notifications", priority: "must-have" },
      { name: "Reviews & Ratings", description: "Customer reviews with photos and seller responses", priority: "should-have" }
    ],
    userRoles: [
      { role: "Customer", permissions: ["browse_products", "manage_cart", "place_orders", "track_orders", "write_reviews"], description: "Online shoppers" },
      { role: "Seller", permissions: ["manage_products", "view_orders", "update_inventory", "view_analytics"], description: "Product vendors" },
      { role: "Admin", permissions: ["manage_users", "moderate_reviews", "configure_settings", "view_reports"], description: "Platform administrators" }
    ],
    technicalRequirements: {
      frontend: ["Next.js with SSR for SEO", "Image optimization", "PWA features"],
      backend: ["Microservices architecture", "Inventory sync", "Order processing queue"],
      database: ["PostgreSQL for orders", "Elasticsearch for product search", "Redis for cart sessions"],
      integrations: ["Payment gateways", "Shipping APIs", "Email marketing", "Analytics"]
    },
    risks: [
      { risk: "Cart abandonment", mitigation: "Implement abandoned cart emails and simplified checkout", severity: "medium" },
      { risk: "Inventory overselling", mitigation: "Real-time inventory locking during checkout", severity: "high" }
    ]
  }),
  
  general: (input: string) => ({
    projectOverview: {
      title: extractProjectName(input, "Web Application"),
      description: `A modern web application built with scalability and user experience in mind. Features comprehensive user management, intuitive interfaces, and robust backend architecture.`,
      domain: "Technology",
      targetUsers: ["End Users", "Administrators", "Support Staff"]
    },
    features: [
      { name: "User Authentication", description: "Secure login with social auth and 2FA options", priority: "must-have" },
      { name: "Dashboard", description: "Central hub for accessing all features and viewing key metrics", priority: "must-have" },
      { name: "Data Management", description: "CRUD operations with search, filter, and export capabilities", priority: "must-have" },
      { name: "Notifications", description: "In-app and email notifications for important events", priority: "should-have" },
      { name: "Analytics", description: "Usage analytics and reporting dashboard", priority: "nice-to-have" }
    ],
    userRoles: [
      { role: "User", permissions: ["access_dashboard", "manage_data", "update_profile"], description: "Regular application users" },
      { role: "Admin", permissions: ["manage_users", "configure_settings", "view_analytics", "system_admin"], description: "System administrators" }
    ],
    technicalRequirements: {
      frontend: ["React/Next.js", "Responsive design", "Dark mode support"],
      backend: ["Node.js API", "RESTful endpoints", "Rate limiting"],
      database: ["PostgreSQL", "Redis caching", "Backup system"],
      integrations: ["Email service", "File storage", "Analytics tracking"]
    },
    risks: [
      { risk: "Scalability issues", mitigation: "Implement caching and optimize database queries", severity: "medium" },
      { risk: "User adoption", mitigation: "Focus on UX and provide onboarding tutorials", severity: "low" }
    ]
  })
}

// Domain-specific workflow templates
const DOMAIN_WORKFLOWS: Record<string, (input: string) => WorkflowStep[]> = {
  food: () => [
    { id: 1, title: "Setup & Auth", description: "Project initialization and user authentication setup", tasks: ["Configure database schema", "Implement JWT authentication", "Set up user roles"], duration: "3 days", dependencies: [] },
    { id: 2, title: "Core Backend", description: "Restaurant and menu management APIs", tasks: ["Restaurant CRUD APIs", "Menu management system", "Order processing logic"], duration: "5 days", dependencies: [1] },
    { id: 3, title: "Customer App", description: "Build customer-facing features", tasks: ["Restaurant browsing UI", "Cart and checkout flow", "Order tracking screen"], duration: "5 days", dependencies: [2] },
    { id: 4, title: "Partner Apps", description: "Restaurant and delivery partner interfaces", tasks: ["Restaurant dashboard", "Delivery partner app", "Real-time order updates"], duration: "4 days", dependencies: [2] },
    { id: 5, title: "Integrations", description: "Third-party integrations and payments", tasks: ["Payment gateway setup", "Maps integration", "Push notifications"], duration: "3 days", dependencies: [3, 4] },
    { id: 6, title: "Testing & Launch", description: "QA testing and production deployment", tasks: ["End-to-end testing", "Performance optimization", "Production deployment"], duration: "2 days", dependencies: [5] }
  ],
  
  healthcare: () => [
    { id: 1, title: "Compliance Setup", description: "Security and compliance infrastructure", tasks: ["HIPAA compliance review", "Encryption setup", "Audit logging system"], duration: "4 days", dependencies: [] },
    { id: 2, title: "Authentication", description: "Secure auth with role-based access", tasks: ["Multi-factor auth", "Role-based permissions", "Session management"], duration: "4 days", dependencies: [1] },
    { id: 3, title: "Patient Portal", description: "Patient-facing features", tasks: ["Patient registration", "Medical records viewer", "Appointment booking"], duration: "5 days", dependencies: [2] },
    { id: 4, title: "Provider Tools", description: "Doctor and staff interfaces", tasks: ["Doctor dashboard", "EHR management", "Prescription system"], duration: "6 days", dependencies: [2] },
    { id: 5, title: "Telemedicine", description: "Video consultation features", tasks: ["Video call integration", "Virtual waiting room", "E-prescription"], duration: "4 days", dependencies: [3, 4] },
    { id: 6, title: "QA & Audit", description: "Security audit and testing", tasks: ["Security penetration testing", "Compliance verification", "User acceptance testing"], duration: "3 days", dependencies: [5] }
  ],
  
  general: () => [
    { id: 1, title: "Project Setup", description: "Initialize project and core infrastructure", tasks: ["Set up repository and CI/CD", "Configure database", "Set up development environment"], duration: "2 days", dependencies: [] },
    { id: 2, title: "Authentication", description: "User authentication and authorization", tasks: ["Implement login/signup", "Add social auth", "Set up role permissions"], duration: "3 days", dependencies: [1] },
    { id: 3, title: "Core Features", description: "Build main application features", tasks: ["Create main dashboard", "Implement CRUD operations", "Build settings page"], duration: "5 days", dependencies: [2] },
    { id: 4, title: "UI Polish", description: "Enhance user interface and experience", tasks: ["Responsive design", "Loading states", "Error handling"], duration: "3 days", dependencies: [3] },
    { id: 5, title: "Testing", description: "Quality assurance and bug fixes", tasks: ["Unit tests", "Integration tests", "Bug fixes"], duration: "2 days", dependencies: [4] },
    { id: 6, title: "Deployment", description: "Production deployment and monitoring", tasks: ["Deploy to production", "Set up monitoring", "Documentation"], duration: "1 day", dependencies: [5] }
  ]
}

// Domain-specific clarification questions
const DOMAIN_QUESTIONS: Record<string, (input: string) => ClarificationQuestion[]> = {
  food: () => [
    { id: 1, question: "What type of cuisine or food categories should the platform support?", category: "business", importance: "critical", context: "Determines menu structure and restaurant filtering" },
    { id: 2, question: "Will delivery be handled in-house or through third-party services?", category: "business", importance: "critical", context: "Affects delivery partner module requirements" },
    { id: 3, question: "What payment methods should be supported (cards, wallets, COD)?", category: "technical", importance: "critical", context: "Determines payment gateway integrations" },
    { id: 4, question: "Should the platform support scheduled orders for future delivery?", category: "ux", importance: "important", context: "Impacts order management complexity" },
    { id: 5, question: "What is the expected order volume at launch and in 6 months?", category: "technical", importance: "important", context: "Helps plan infrastructure scaling" },
    { id: 6, question: "Are there specific delivery radius limits for restaurants?", category: "business", importance: "important", context: "Affects restaurant-customer matching logic" }
  ],
  
  healthcare: () => [
    { id: 1, question: "What specific compliance requirements apply (HIPAA, GDPR, etc.)?", category: "compliance", importance: "critical", context: "Determines security architecture and data handling" },
    { id: 2, question: "Should the system integrate with existing hospital EHR systems?", category: "technical", importance: "critical", context: "Affects data migration and integration complexity" },
    { id: 3, question: "What types of medical specialties will be covered?", category: "business", importance: "critical", context: "Determines workflow customization needs" },
    { id: 4, question: "Is telemedicine/video consultation required?", category: "ux", importance: "important", context: "Impacts technology stack and features" },
    { id: 5, question: "How should patient data retention and deletion be handled?", category: "compliance", importance: "critical", context: "Legal compliance requirements vary by region" },
    { id: 6, question: "What lab and diagnostic systems need integration?", category: "technical", importance: "important", context: "Determines third-party API requirements" }
  ],
  
  ecommerce: () => [
    { id: 1, question: "Is this a single-vendor or multi-vendor marketplace?", category: "business", importance: "critical", context: "Fundamentally affects architecture and features" },
    { id: 2, question: "What product types will be sold (physical, digital, services)?", category: "business", importance: "critical", context: "Determines fulfillment and delivery logic" },
    { id: 3, question: "Which payment gateways should be integrated?", category: "technical", importance: "critical", context: "Affects checkout implementation" },
    { id: 4, question: "Is international shipping required?", category: "business", importance: "important", context: "Impacts shipping calculations and tax handling" },
    { id: 5, question: "Should the platform support product subscriptions?", category: "ux", importance: "important", context: "Requires recurring billing implementation" },
    { id: 6, question: "What inventory management approach is preferred?", category: "technical", importance: "important", context: "Determines stock tracking complexity" }
  ],
  
  general: () => [
    { id: 1, question: "Who are the primary target users for this application?", category: "business", importance: "critical", context: "Guides UX decisions and feature prioritization" },
    { id: 2, question: "What authentication methods should be supported?", category: "technical", importance: "critical", context: "Determines security implementation" },
    { id: 3, question: "Are there specific third-party integrations required?", category: "technical", importance: "important", context: "Affects architecture and timeline" },
    { id: 4, question: "What is the expected user load at launch?", category: "technical", importance: "important", context: "Helps plan infrastructure and scaling" },
    { id: 5, question: "Should the application support multiple languages?", category: "ux", importance: "important", context: "Affects frontend implementation complexity" },
    { id: 6, question: "What analytics and reporting features are needed?", category: "business", importance: "nice-to-know", context: "Determines dashboard and export requirements" }
  ]
}

// Helper to extract project name from input
function extractProjectName(input: string, fallback: string): string {
  const words = input.split(" ").slice(0, 5)
  if (words.length >= 2) {
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
  }
  return fallback
}

// Generate mock scope analysis
function generateMockScopeAnalysis(input: string, context?: { original?: string }): ScopeAnalysis {
  const hasOriginal = !!context?.original
  const domain = detectDomain(input)
  
  if (!hasOriginal) {
    return {
      scopeChange: {
        detected: false,
        severity: "none",
        percentageIncrease: 0,
        summary: "No original scope provided for comparison"
      },
      addedFeatures: [],
      removedFeatures: [],
      changedFeatures: [],
      recommendations: ["Define initial scope to enable scope tracking"],
      riskAssessment: {
        timeline: "Unable to assess without baseline",
        budget: "Unable to assess without baseline",
        technical: "Unable to assess without baseline"
      }
    }
  }
  
  // Simulate scope creep detection
  const inputWords = input.toLowerCase().split(" ").length
  const originalWords = (context.original || "").toLowerCase().split(" ").length
  const increase = Math.max(0, Math.round(((inputWords - originalWords) / Math.max(originalWords, 1)) * 100))
  
  return {
    scopeChange: {
      detected: increase > 10,
      severity: increase > 50 ? "major" : increase > 25 ? "moderate" : increase > 10 ? "minor" : "none",
      percentageIncrease: Math.min(increase, 100),
      summary: increase > 10 ? `Scope has increased by approximately ${increase}% from original requirements` : "No significant scope change detected"
    },
    addedFeatures: increase > 10 ? [
      { feature: "Additional user requirements detected", effort: "2-3 days", impact: "medium" },
      { feature: "Extended feature set", effort: "3-5 days", impact: "high" }
    ] : [],
    removedFeatures: [],
    changedFeatures: increase > 10 ? [
      { original: "Basic implementation", new: "Enhanced implementation with additional features", impact: "Timeline extension" }
    ] : [],
    recommendations: increase > 25 ? [
      "Consider breaking into phases",
      "Re-evaluate timeline and budget",
      "Prioritize core features first",
      "Document all changes formally"
    ] : ["Continue with current plan"],
    riskAssessment: {
      timeline: increase > 25 ? "High risk - may need 30-50% more time" : "Low risk",
      budget: increase > 25 ? "Medium risk - additional resources may be needed" : "Low risk",
      technical: increase > 10 ? "Medium risk - increased complexity" : "Low risk"
    }
  }
}

// Main AI generation function with fallback
export async function generateAIContent<T>(
  type: "tasks" | "prd" | "scope" | "workflow" | "clarification",
  input: string,
  context?: Record<string, unknown>,
  onProgress?: (text: string) => void
): Promise<{ data: T; source: "api" | "fallback"; error?: string }> {
  const sanitizedInput = sanitizeInput(input)
  
  if (!sanitizedInput) {
    return {
      data: getEmptyResult(type) as T,
      source: "fallback",
      error: "Please provide a valid input"
    }
  }

  const domain = detectDomain(sanitizedInput)
  
  // Try API first
  try {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, input: sanitizedInput, context })
    })
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }
    
    // Parse streaming response
    const reader = response.body?.getReader()
    if (!reader) throw new Error("No response body")
    
    const decoder = new TextDecoder()
    let fullText = ""
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split("\n")
      
      for (const line of lines) {
        if (line.startsWith("0:")) {
          const text = line.slice(2).trim()
          if (text.startsWith('"') && text.endsWith('"')) {
            try {
              const parsed = JSON.parse(text)
              fullText += parsed
              onProgress?.(parsed)
            } catch {
              // Skip malformed chunks
            }
          }
        }
      }
    }
    
    // Extract and parse JSON
    const jsonMatch = fullText.match(/[\[{][\s\S]*[\]}]/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return { data: parsed as T, source: "api" }
    }
    
    throw new Error("No valid JSON in response")
  } catch (error) {
    console.error("[v0] AI API failed, using fallback:", error)
    
    // Use intelligent fallback based on domain
    const fallbackData = generateFallback(type, sanitizedInput, domain, context)
    return {
      data: fallbackData as T,
      source: "fallback",
      error: error instanceof Error ? error.message : "API unavailable"
    }
  }
}

// Generate fallback data based on type and domain
function generateFallback(
  type: string,
  input: string,
  domain: string,
  context?: Record<string, unknown>
): unknown {
  switch (type) {
    case "tasks":
      return DOMAIN_TASKS[domain] || DOMAIN_TASKS.general
    case "prd":
      const prdGenerator = DOMAIN_PRDS[domain] || DOMAIN_PRDS.general
      return prdGenerator(input)
    case "workflow":
      const workflowGenerator = DOMAIN_WORKFLOWS[domain] || DOMAIN_WORKFLOWS.general
      return workflowGenerator(input)
    case "clarification":
      const questionGenerator = DOMAIN_QUESTIONS[domain] || DOMAIN_QUESTIONS.general
      return questionGenerator(input)
    case "scope":
      return generateMockScopeAnalysis(input, context as { original?: string })
    default:
      return getEmptyResult(type)
  }
}

// Get empty result for type
function getEmptyResult(type: string): unknown {
  switch (type) {
    case "tasks": return []
    case "prd": return {}
    case "workflow": return []
    case "clarification": return []
    case "scope": return { scopeChange: { detected: false, severity: "none", percentageIncrease: 0 } }
    default: return null
  }
}
