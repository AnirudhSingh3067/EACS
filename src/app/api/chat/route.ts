import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
});

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

        if (!process.env.XAI_API_KEY) {
            throw new Error("XAI_API_KEY is not defined in the environment.");
        }

        const response = await client.chat.completions.create({
            model: "grok-2",
            messages: [
                { role: "system", content: "You are a calm and supportive mental health assistant. Never give medical diagnosis. If user expresses self-harm intent, respond with crisis support guidance." },
                { role: "user", content: message }
            ],
        });

        return NextResponse.json({
            reply: response.choices[0].message?.content || "No response received.",
        });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { reply: `Backend Error: ${error.message || "Unknown error occurred"}` },
            { status: 500 }
        );
    }
}
