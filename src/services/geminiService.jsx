import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const analyzeEmotion = async (sentence) => {
  try {
    const prompt = `Analyze the emotion in the following sentence and respond with emojis and brief suggestions!

Sentence: "${sentence}"

Please format your response EXACTLY as follows:
🎭 **EMOTION**: [emotion name with 2-3 matching emojis]
💡 **SUGGESTIONS**: 
• [First brief suggestion with emoji - what to do in this mood]
• [Second brief suggestion with emoji - activity or action]  
• [Third brief suggestion with emoji - helpful tip or idea]

🌈 **MOOD COLORS**: [suggest 2-3 hex color codes that match this emotion like #FFD700, #FF6B6B]

Keep suggestions short, practical, and fun! Each suggestion should be one line only.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    throw new Error("Failed to analyze emotion. Please try again.");
  }
};
