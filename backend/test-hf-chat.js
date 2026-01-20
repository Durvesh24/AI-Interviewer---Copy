import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const hf = new HfInference(process.env.HF_API_KEY);

async function test() {
    console.log("Testing chatCompletion Qwen Auto...");
    try {
        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [{ role: "user", content: "Hello!" }],
            max_tokens: 50
        });
        console.log("Response:", response.choices[0].message.content);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

test();
