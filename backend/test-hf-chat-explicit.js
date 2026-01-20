import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const hf = new HfInference(process.env.HF_API_KEY);

async function test() {
    console.log("Testing chatCompletion Qwen Explicit...");
    try {
        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [{ role: "user", content: "Hello!" }],
            max_tokens: 50,
            provider: "hf-inference" // Let's try forcing it again, maybe auto picked a weird one for the server but a good one for the test?
            // Wait, test-hf-chat.js worked with AUTO.
            // test-endpoint.js failed with AUTO (implied, since server.js uses default).
        });
        console.log("Response:", response.choices[0].message.content);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

test();
