require('dotenv').config();
const {OpenAI} = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeData(prompt) {
    console.log(`Analyzing data: ${prompt} ...`);

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}], // Corrected role to 'user'
            max_tokens: 1000,
        });

        return response.choices?.[0]?.message?.content?.trim() || ""; // Handle potential undefined values
    } catch (error) {
        console.error("Error analyzing data:", error.response?.data || error.message);
        throw new Error("Failed to analyze data. Please try again later.");
    }
}

module.exports = {analyzeData};
