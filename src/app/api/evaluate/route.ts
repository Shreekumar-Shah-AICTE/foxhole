import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { 
      proposalTitle, 
      proposalDesc, 
      boardMembers, 
      messages, 
      rigorLevel 
    } = await req.json();

    if (!proposalTitle || !proposalDesc || !boardMembers || !messages) {
      return new Response("Missing parameters for evaluation", { status: 400 });
    }

    // Compose prompt for evaluation engine
    const evaluationPrompt = `You are a corporate board advisor and strategic risk assessment auditor.
    
    THE STRATEGIC PROPOSAL UNDER ANALYSIS:
    Title: ${proposalTitle}
    Core Details: ${proposalDesc}
    
    THE CHAT REHEARSAL HISTORIC DIALOGUE:
    ${JSON.stringify(
      messages.map((m: any) => ({
        role: m.role,
        speaker: m.name || m.role,
        content: m.content,
      }))
    )}
    
    THE ACTIVE BOARD AVATAR LIST:
    ${JSON.stringify(
      boardMembers.map((m: any) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        bias: m.personaDescription,
      }))
    )}
    
    YOUR TASK:
    Perform a complete fiduciary and strategic review of the dialogue history. Evaluate the user's defense of their proposal against the specific board avatars' biases.
    
    Return a strictly formatted JSON object containing:
    1. "generalApproval": A general percentage score (integer 0 to 100) representing how likely the board as a whole is to approve this proposal based on the current dialogue.
    2. "boardMemberRatings": An object mapping each board member's ID (e.g. "cfo", "cto", "lead-dir", etc.) to an integer score (0 to 100) representing their individual approval sentiment.
    3. "risks": An array of maximum 3 critical risk vulnerabilities exposed in the proposal or user responses. Each risk must include:
       - "type": either "financial", "technical", or "compliance"
       - "risk": a brief sentence explaining the critical risk
       - "severity": "high", "medium", or "low"
       - "suggestion": a specific, actionable piece of strategic advice to neutralize the risk
    4. "strategicTip": A single high-level advice tip targeting the most skeptical board member to secure their buy-in in the next message.

    Make your scoring dynamic and realistic! If the user makes weak points, fails to answer numbers, or ignores compliance, deduct scores aggressively. If the user presents solid data, architectures, or mitigations, reward them with higher ratings.
    
    RESPONSE FORMAT RULES:
    You MUST output ONLY a valid JSON block matching this structure. Do NOT wrap it in markdown code blocks, do NOT write any intro or outro text. Output exactly the raw JSON text.`;

    // Create provider with explicit API key
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: evaluationPrompt,
      temperature: 0.2,
    });

    // Strip markdown code fences that Gemini sometimes wraps around JSON
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    }

    // Validate it's actually parseable JSON before sending to client
    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Evaluation API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to process simulation analysis" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
