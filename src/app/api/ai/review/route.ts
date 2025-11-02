import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      return NextResponse.json(
        { 
          error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.",
          details: "Get your API key from: https://platform.openai.com/api-keys"
        },
        { status: 500 }
      )
    }

    const { code, language } = await request.json()

    if (!code || !code.trim()) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `You are an expert code reviewer. Analyze the following ${language} code and provide a detailed review in JSON format.

Code to review:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Provide your review in this exact JSON format:
{
  "score": <number between 0-10>,
  "pros": [<array of 2-4 specific strengths>],
  "cons": [<array of 2-4 specific weaknesses or issues>],
  "suggestions": [<array of 2-4 actionable improvement suggestions>]
}

Focus on:
- Code quality and best practices
- Performance considerations
- Security issues (if applicable)
- Readability and maintainability
- Proper syntax and structure

Be specific and constructive in your feedback.`,
    })

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI")
    }

    const reviewData = JSON.parse(jsonMatch[0])

    // Validate response structure
    if (
      typeof reviewData.score !== "number" ||
      !Array.isArray(reviewData.pros) ||
      !Array.isArray(reviewData.cons) ||
      !Array.isArray(reviewData.suggestions)
    ) {
      throw new Error("Invalid review data structure")
    }

    return NextResponse.json(reviewData)
  } catch (error) {
    console.error("AI Review Error:", error)
    
    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { 
            error: "OpenAI API key issue",
            details: "Please check your OPENAI_API_KEY in .env.local file"
          },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: "Failed to generate AI review",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
