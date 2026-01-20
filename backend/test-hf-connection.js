import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const hf = new HfInference(process.env.HF_API_KEY);

async function testConnection() {
    console.log("Testing HF API Key:", process.env.HF_API_KEY ? "Present" : "MISSING");

    // Try a very reliable free model first
    const models = [
        "HuggingFaceH4/zephyr-7b-beta",
        "mistralai/Mistral-7B-Instruct-v0.3",
        "microsoft/Phi-3-mini-4k-instruct"
    ];

    for (const model of models) {
        console.log(`\nTesting model: ${model}...`);
        try {
            const response = await hf.chatCompletion({
                model: model,
                messages: [{ role: "user", content: "Hello, are you working?" }],
                max_tokens: 50
            });
            console.log("SUCCESS! Response:", response.choices[0].message.content);
            return; // Exit on first success
        } catch (err) {
            console.error(`FAILED ${model}:`, err.message);
            if (err.statusCode) console.error("Status Code:", err.statusCode);
        }
    }
}

testConnection();
