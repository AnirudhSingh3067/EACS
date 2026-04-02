import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const groq = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const SAFETY_KEYWORDS = ["suicide", "kill myself", "self harm", "end my life", "want to die"];

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!message || typeof message !== "string" || !message.trim()) {
            return NextResponse.json({ error: "A valid message is required." }, { status: 400 });
        }

        // Safety filter
        const lower = message.toLowerCase();
        if (SAFETY_KEYWORDS.some((kw) => lower.includes(kw))) {
            return NextResponse.json({
                reply:
                    "If you are in immediate danger or crisis, please call 911 or 988 (USA) immediately. Your safety matters most. Please reach out to emergency services.",
            });
        }

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "You are MindBridge AI, a calm, warm, and empathetic mental health support assistant. Your role is to listen actively, validate emotions, and provide supportive guidance. You are not a replacement for professional therapy, and you gently encourage users to seek professional help when appropriate. Keep responses concise, compassionate, and helpful.",
                },
                { role: "user", content: message },
            ],
            max_tokens: 512,
        });

        const reply = response.choices[0]?.message?.content || "I'm here for you. Could you tell me a bit more?";
        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: `Backend error: ${error?.message || "Unknown error"}` },
            { status: 500 }
        );
    }
}
