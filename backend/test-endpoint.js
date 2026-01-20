async function testServer() {
    console.log("Sending POST to http://localhost:5000/start-interview...");
    try {
        const response = await fetch("http://localhost:5000/start-interview", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // We need a valid JWT token. 
                // Since we can't easily generate one signed by the server's secret without reading it,
                // we'll rely on the server running with "supersecretkey" default if env is missing,
                // or we'll bypass auth if possible, OR better:
                // We'll mock the auth middleware behavior or generate a token using the same secret we see in the file.
            },
            body: JSON.stringify({
                role: "Software Engineer",
                difficulty: "Beginner",
                questionCount: 1
            })
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Body:", text);

    } catch (err) {
        console.error("Fetch failed:", err.message);
    }
}

// But wait, we need a token.
// Let's create a script that IMPORTS server, but that starts the server which might conflict.
// Instead, let's create a script that generates a token using jsonwebtoken and then hits the server.
// The server uses process.env.JWT_SECRET || "supersecretkey"

import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const token = jwt.sign({ id: 1, email: "test@test.com", role: "user" }, JWT_SECRET);
console.log("Generated Token:", token);

async function run() {
    try {
        const res = await fetch("http://localhost:5000/start-interview", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                role: "Software Engineer",
                difficulty: "Beginner",
                questionCount: 1
            })
        });
        console.log("Response Status:", res.status);
        console.log("Response Text:", await res.text());
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
