import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const hf = new HfInference(process.env.HF_API_KEY);

async function test() {
    const models = [
        "HuggingFaceH4/zephyr-7b-beta",
        "google/gemma-2-9b-it",
        "microsoft/Phi-3-mini-4k-instruct"
    ];

    for (const model of models) {
        console.log(`\nTesting ${model} with provider: "hf-inference"...`);
        try {
            const response = await hf.chatCompletion({
                model: model,
                messages: [{ role: "user", content: "Hello!" }],
                max_tokens: 50,
                provider: "hf-inference"
            });
            console.log("SUCCESS!", response.choices[0].message.content);
            return; // Success!
        } catch (err) {
            console.error("FAILED:", err.message);
        }
    }
}

test();
