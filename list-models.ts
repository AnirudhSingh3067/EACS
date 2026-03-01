import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyA18NjMT3uzzRwAL9i6p_dUA_psTQT7OEM";
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    try {
        const params = {
            // The API doesn't expose a simple list models from the JS SDK easily without making a raw fetch call.
        };
    } catch (e) { }
}

async function listModels() {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey);
    const data = await response.json();
    console.log(JSON.stringify(data.models.map((m: any) => m.name), null, 2));
}

listModels();
