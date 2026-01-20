import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.HF_API_KEY;
const MODEL = "HuggingFaceH4/zephyr-7b-beta";

console.log("Testing raw fetch to HF API...");

async function test() {
    try {
        const response = await fetch(`https://router.huggingface.co/models/${MODEL}/v1/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: "user", content: "Hello!" }],
                max_tokens: 10
            })
        });

        console.log("Status:", response.status);
        console.log("Status Text:", response.statusText);

        const text = await response.text();
        console.log("Body:", text);

    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

test();
