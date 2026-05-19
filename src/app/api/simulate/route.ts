import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { 
      proposalTitle, 
      proposalDesc, 
      currentMember, 
      messages, 
      rigorLevel 
    } = await req.json();

    if (!proposalTitle || !proposalDesc || !currentMember || !messages) {
      return new Response("Missing required simulation parameters", { status: 400 });
    }

    // Configure systemic rigor weights
    let rigorDirective = "";
    if (rigorLevel === "friendly") {
      rigorDirective = "Maintain a constructive, collaborative, and encouraging tone. Focus on clarifying details, validation of key claims, and offering growth-oriented suggestions. Do not attack or corner the user.";
    } else if (rigorLevel === "stress") {
      rigorDirective = "ACT AS AN ADVERSARY. Be extremely skeptical, sharp, and intense. Actively focus on financial liabilities, major integration risks, architectural weaknesses, regulatory issues, and worst-case scenario exit strategies. Question every assumption with high corporate intensity.";
    } else {
      rigorDirective = "Maintain standard professional corporate governance rigor. Ask deep, realistic fiduciary and technical questions with objective, balanced skepticism.";
    }

    // Compose System Prompt
    const systemPrompt = `You are playing the role of ${currentMember.name}, the ${currentMember.role} in a high-stakes corporate board rehearsal simulation.
    
    THE STRATEGIC PROPOSAL UNDER REVIEW:
    Title: ${proposalTitle}
    Core Details & Financials: ${proposalDesc}
    
    YOUR AVATAR INCENTIVE & BACKGROUND PROFILE:
    Bio: ${currentMember.bio}
    Specific Bias & Focus Areas: ${currentMember.personaDescription}
    
    SIMULATION RIGOR DIRECTIVE:
    ${rigorDirective}
    
    CRITICAL BEHAVIOR RULES:
    1. NEVER step out of character. You are strictly ${currentMember.name}.
    2. Do NOT speak on behalf of other board members or generate dialogue for them.
    3. Keep your response focused, realistic, and concise (under 120 words). Act like a real person in a live meeting.
    4. Focus on asking 1 or 2 sharp, domain-appropriate questions about the user's latest claim or strategic plan.
    5. Directly challenge any logical flaws, poor numbers, or technical vulnerabilities in the user's pitch.`;

    // Create provider with explicit API key (supports both GEMINI_API_KEY and GOOGLE_GENERATIVE_AI_API_KEY)
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });
    
    // Stream response using Gemini 2.5 Flash for hyper-fast latency
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: rigorLevel === "stress" ? 0.8 : 0.6,
    });

    return result.toTextStreamResponse({
      headers: {
        "X-Vercel-AI-Data-Stream": "v1",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error: any) {
    console.error("Simulation API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to process simulation dialog" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
