import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

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

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined in the environment.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        // We prepend the system instruction since legacy gemini-pro does not natively support systemInstruction in the config
        const prompt = `System Instruction: You are a calm and supportive mental health assistant. Never give medical diagnosis. If user expresses self-harm intent, respond with crisis support guidance.\n\nUser: ${message}`;

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
