import dotenv from "dotenv";
dotenv.config();

async function test() {
    console.log("Verifying Token...");
    try {
        const response = await fetch("https://huggingface.co/api/whoami-v2", {
            headers: { "Authorization": `Bearer ${process.env.HF_API_KEY}` }
        });
        console.log("Status:", response.status);
        const body = await response.json();
        console.log("User:", body.name || body.error);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

test();
