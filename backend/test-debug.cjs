async function testServer() {
    console.log("Testing Qwen with Retry Logic...");
    const HfInference = require("@huggingface/inference").HfInference;
    require("dotenv").config();
    const hf = new HfInference(process.env.HF_API_KEY);

    try {
        // Trying without provider first (Auto)
        console.log("Attempt 1: Auto Provider");
        const res = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [{ role: "user", content: "Hello" }],
            max_tokens: 10
        });
        console.log("Success Auto:", res.choices[0].message.content);
    } catch (e) {
        console.error("Failed Auto:", e.message);
    }
}
testServer();
