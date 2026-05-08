import { streamText } from "ai"

// Dynamic AI generation for Master Manager
// Uses Vercel AI Gateway (zero-config with supported providers)

const SYSTEM_PROMPT = `You are Master Manager AI, an intelligent assistant that converts vague client requirements into structured, actionable outputs for tech agencies.

Your capabilities:
1. TASK GENERATION: Analyze requirements and generate specific, prioritized tasks
2. PRD GENERATION: Create comprehensive Product Requirement Documents
3. SCOPE DETECTION: Identify scope creep and requirement changes
4. WORKFLOW GENERATION: Create logical execution workflows
5. CLARIFICATION QUESTIONS: Generate smart follow-up questions to reduce ambiguity

IMPORTANT RULES:
- Always analyze the actual input context (domain, industry, project type)
- Generate UNIQUE outputs based on the specific requirement
- Never use generic/placeholder content
- Prioritize tasks logically (auth/database before features, backend before frontend)
- Include realistic time estimates
- Consider user roles specific to the domain
- Identify potential risks and dependencies

DOMAIN DETECTION:
- Detect the project type (e-commerce, healthcare, fintech, social, SaaS, etc.)
- Adapt terminology and features to the specific domain
- Consider industry-specific compliance requirements
- Suggest relevant integrations for that domain`

export async function POST(req: Request) {
  try {
    const { type, input, context } = await req.json()

    if (!input || !type) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    let prompt = ""

    switch (type) {
      case "tasks":
        prompt = `Analyze this requirement and generate 5-8 specific, actionable tasks.

REQUIREMENT: "${input}"

${context ? `ADDITIONAL CONTEXT: ${context}` : ""}

Respond with a JSON array of tasks. Each task must have:
- id: number (sequential)
- title: string (specific action, not vague)
- priority: "high" | "medium" | "low"
- estimate: string (e.g., "2h", "4h", "1d", "2d")
- category: string (e.g., "backend", "frontend", "database", "auth", "design", "testing")

Order tasks by logical execution sequence (setup/auth first, then core features, then polish).

IMPORTANT: Tasks must be SPECIFIC to the requirement. For a food delivery app, include restaurant APIs, order tracking, payment integration. For a hospital system, include patient records, appointment scheduling, etc.

Respond ONLY with the JSON array, no other text.`
        break

      case "prd":
        prompt = `Generate a comprehensive PRD (Product Requirement Document) for this project.

REQUIREMENT: "${input}"

${context ? `ADDITIONAL CONTEXT: ${context}` : ""}

Respond with a JSON object containing these sections:

{
  "projectOverview": {
    "title": "string",
    "description": "string (2-3 sentences)",
    "domain": "string (e.g., Healthcare, E-commerce, FinTech)",
    "targetUsers": ["string array of user types"]
  },
  "features": [
    { "name": "string", "description": "string", "priority": "must-have" | "should-have" | "nice-to-have" }
  ],
  "userRoles": [
    { "role": "string", "permissions": ["string array"], "description": "string" }
  ],
  "functionalRequirements": [
    { "id": "FR-1", "requirement": "string", "acceptance": "string" }
  ],
  "userFlow": [
    { "step": number, "action": "string", "screen": "string" }
  ],
  "technicalRequirements": {
    "frontend": ["string array"],
    "backend": ["string array"],
    "database": ["string array"],
    "integrations": ["string array"]
  },
  "risks": [
    { "risk": "string", "mitigation": "string", "severity": "high" | "medium" | "low" }
  ]
}

IMPORTANT: All content must be SPECIFIC to "${input}". Do not use generic placeholders.

Respond ONLY with the JSON object, no other text.`
        break

      case "scope":
        prompt = `Analyze this requirement change for potential scope creep.

ORIGINAL REQUIREMENT: "${context?.original || "Initial project scope"}"

NEW/UPDATED REQUIREMENT: "${input}"

Analyze and respond with a JSON object:

{
  "scopeChange": {
    "detected": boolean,
    "severity": "none" | "minor" | "moderate" | "major",
    "percentageIncrease": number (0-100),
    "summary": "string (one sentence)"
  },
  "addedFeatures": [
    { "feature": "string", "effort": "string", "impact": "high" | "medium" | "low" }
  ],
  "removedFeatures": ["string array"],
  "changedFeatures": [
    { "original": "string", "new": "string", "impact": "string" }
  ],
  "recommendations": ["string array"],
  "riskAssessment": {
    "timeline": "string",
    "budget": "string",
    "technical": "string"
  }
}

Respond ONLY with the JSON object, no other text.`
        break

      case "workflow":
        prompt = `Generate a dynamic workflow pipeline for this project.

REQUIREMENT: "${input}"

${context ? `ADDITIONAL CONTEXT: ${context}` : ""}

Create a 4-6 step workflow that shows the execution pipeline from requirement to delivery.

Respond with a JSON array:

[
  {
    "id": number,
    "title": "string (short, 2-3 words)",
    "description": "string (what happens in this stage)",
    "tasks": ["string array of 2-3 specific tasks"],
    "duration": "string (e.g., '2 days', '1 week')",
    "dependencies": [number array of step IDs this depends on]
  }
]

IMPORTANT: The workflow must be SPECIFIC to the project type. A food delivery app workflow differs from a hospital management system workflow.

Respond ONLY with the JSON array, no other text.`
        break

      case "clarification":
        prompt = `Generate smart clarification questions for this requirement to reduce ambiguity.

REQUIREMENT: "${input}"

${context ? `EXISTING CONTEXT: ${context}` : ""}

Generate 5-7 specific questions that would help clarify the requirements and prevent miscommunication.

Questions should cover:
- Technical specifics (scalability, performance, integrations)
- User experience (target audience, device support, accessibility)
- Business logic (edge cases, validation rules, workflows)
- Timeline and priorities
- Compliance and security (if relevant to domain)

Respond with a JSON array:

[
  {
    "id": number,
    "question": "string",
    "category": "technical" | "ux" | "business" | "timeline" | "compliance",
    "importance": "critical" | "important" | "nice-to-know",
    "context": "string (why this question matters)"
  }
]

IMPORTANT: Questions must be SPECIFIC to "${input}". Do not ask generic project questions.

Respond ONLY with the JSON array, no other text.`
        break

      default:
        return Response.json({ error: "Invalid generation type" }, { status: 400 })
    }

    const result = streamText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: SYSTEM_PROMPT,
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("AI Generation error:", error)
    return Response.json(
      { error: "Failed to generate content" },
      { status: 500 }
    )
  }
}
