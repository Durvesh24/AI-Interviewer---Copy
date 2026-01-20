import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const hf = new HfInference(process.env.HF_API_KEY);

async function test() {
    console.log("Testing textGeneration with gpt2...");
    try {
        const response = await hf.textGeneration({
            model: "gpt2",
            inputs: "Hello, my name is",
            provider: "hf-inference"
        });
        console.log("Response:", response.generated_text);
    } catch (err) {
        console.log("Without provider option:");
        try {
            const response = await hf.textGeneration({
                model: "gpt2",
                inputs: "Hello, my name is"
            });
            console.log("Response:", response.generated_text);
        } catch (err2) {
            console.error("FAILED BOTH:", err2.message);
        }
    }
}

test();
