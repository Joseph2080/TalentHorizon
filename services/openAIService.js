require('dotenv').config(); // Load environment variables from .env

const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is loaded
});

async function analyzeData(prompt) {
    try {
        console.log("Analyzing prompt:", prompt);
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "developer", content: prompt }],
            max_tokens: 1000,
        });
        return response.choices[0].message.content.trim(); // Return the response text
    } catch (error) {
        console.error("Error analyzing data:", error.response || error.message);
        throw error;
    }
}

module.exports = { analyzeData };
