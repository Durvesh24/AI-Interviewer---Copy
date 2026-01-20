import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const hf = new HfInference(process.env.HF_API_KEY);

async function test() {
    console.log("Testing textGeneration Qwen...");
    try {
        const response = await hf.textGeneration({
            model: "Qwen/Qwen2.5-72B-Instruct",
            inputs: "Hello, are you there?",
            max_new_tokens: 50,
            provider: "hf-inference"
        });
        console.log("Response:", response.generated_text);
    } catch (err) {
        console.error("HF Inference Error:", err.message);

        console.log("Retrying with AUTO provider...");
        try {
            const response2 = await hf.textGeneration({
                model: "Qwen/Qwen2.5-72B-Instruct",
                inputs: "Hello, are you there?",
                max_new_tokens: 50
            });
            console.log("Response Auto:", response2.generated_text);
        } catch (err2) {
            console.error("Auto Error:", err2.message);
        }
    }
}

test();
