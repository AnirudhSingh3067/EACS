import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

async function generateWithGROQ(apiKey: string, modelName: string, prompt: string, baseUrl: string) {
  const url = `${baseUrl.replace(/\/$/, "")}/models/${encodeURIComponent(modelName)}/generate`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      // Many model providers expect either {prompt} or {inputs} or {text}; keep a simple shape and let callers adapt
      prompt,
      // optional: set any generation params (max tokens, temperature) via env in future
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GROQ API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  // Try several common response shapes
  // 1) { output_text: "..." }
  if (typeof json.output_text === 'string') return json.output_text;
  // 2) { output: [{ content: '...' }] }
  if (Array.isArray(json.output) && json.output.length > 0) {
    const first = json.output[0];
    if (typeof first === 'string') return first;
    if (first?.content && typeof first.content === 'string') return first.content;
    // sometimes structure: { output: [{ text: '...' }] }
    if (first?.text && typeof first.text === 'string') return first.text;
  }
  // 3) OpenAI-like: { choices: [{ text: '...' }] }
  if (Array.isArray(json.choices) && json.choices[0]?.text) return json.choices[0].text;
  // 4) fallback: stringify entire object
  return JSON.stringify(json);
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ reply: "A valid message is required." }, { status: 400 });
    }

    // Basic Safety Filter
    const lowerMessage = message.toLowerCase();
    if (
      lowerMessage.includes("suicide") ||
      lowerMessage.includes("kill myself") ||
      lowerMessage.includes("self harm")
    ) {
      return NextResponse.json({
        reply: "If you are in immediate danger or crisis, please call 911 or 988 (USA) immediately. Your safety matters most. Please reach out to emergency services."
      });
    }

    const prompt = `System Instruction: You are a calm and supportive mental health assistant. Never give medical diagnosis. If user expresses self-harm intent, respond with crisis support guidance.\n\nUser: ${message}`;

    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
      const modelName = process.env.GROQ_MODEL || 'mistral-large';
      const baseUrl = process.env.GROQ_API_BASE || 'https://api.groq.ai/v1';
      try {
        const responseText = await generateWithGROQ(groqApiKey, modelName, prompt, baseUrl);
        return NextResponse.json({ reply: responseText });
      } catch (groqErr: any) {
        console.error('GROQ generation error:', groqErr);
        return NextResponse.json({ reply: `Backend Error: ${groqErr.message || 'GROQ generation failed'}` }, { status: 500 });
      }
    }

    // Fallback to Google Generative AI if GROQ key not present
    const apiKey = process.env.GEMINI_API_KEY || process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error("No AI API key is defined in the environment. Set GROQ_API_KEY or GEMINI_API_KEY/MISTRAL_API_KEY.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GENAI_MODEL || "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { reply: `Backend Error: ${error.message || "Unknown error occurred"}` },
      { status: 500 }
    );
  }
}
