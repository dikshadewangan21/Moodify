import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Validates whether a hex code is valid #RRGGBB format
 * @param {string} color
 * @returns {boolean}
 */
const isValidHexColor = (color) => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

const DEFAULT_FALLBACK_COLORS = ['#3B82F6', '#6366F1', '#8B5CF6'];

/**
 * Normalizes intensity into a 1-10 integer
 * @param {number|string} val
 * @returns {number}
 */
const normalizeIntensity = (val) => {
  if (typeof val === 'number') {
    return Math.min(Math.max(Math.round(val), 1), 10);
  }
  if (typeof val === 'string') {
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      return Math.min(Math.max(num, 1), 10);
    }
    const lower = val.toLowerCase();
    if (lower.includes('very high') || lower.includes('extreme')) return 9;
    if (lower.includes('high')) return 8;
    if (lower.includes('moderate') || lower.includes('medium')) return 5;
    if (lower.includes('low') || lower.includes('mild')) return 3;
  }
  return 6;
};

/**
 * Analyzes emotion for a given input sentence using Google Gemini.
 * Reads API key directly from environment (VITE_GEMINI_API_KEY).
 * @param {string} sentence - The user's input sentence.
 * @returns {Promise<{ emotion: string, intensity: number, summary: string, suggestions: string[], moodColors: string[] }>}
 */
export const analyzeEmotion = async (sentence) => {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();

  if (!apiKey) {
    throw new Error(
      "Gemini API key is not configured. Please add your VITE_GEMINI_API_KEY in the .env file and restart the development server."
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `You are Moodify, an empathetic AI mood and emotion analyzer.
Analyze the emotional tone and sentiment in the following sentence:
"${sentence}"

Return a valid JSON object matching this exact schema:
{
  "emotion": "Emotion Name with 2 matching emojis (e.g. Joyful & Uplifted ✨😊)",
  "intensity": 8, // A number from 1 (subtle) to 10 (intense)
  "summary": "A friendly 1-2 sentence empathetic insight about this feeling",
  "suggestions": [
    "First brief, fun, actionable suggestion with an emoji",
    "Second brief, actionable suggestion with an emoji",
    "Third brief, actionable suggestion with an emoji"
  ],
  "moodColors": ["#HEX1", "#HEX2", "#HEX3"] // Exactly 2 or 3 valid 6-digit hex color codes reflecting this mood
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse AI response.");
      }
    }

    let sanitizedColors = Array.isArray(parsed.moodColors)
      ? parsed.moodColors.filter(isValidHexColor)
      : [];

    if (sanitizedColors.length < 2) {
      sanitizedColors = DEFAULT_FALLBACK_COLORS;
    } else {
      sanitizedColors = sanitizedColors.slice(0, 3);
    }

    return {
      emotion: parsed.emotion || "Reflective 🤔",
      intensity: normalizeIntensity(parsed.intensity),
      summary: parsed.summary || "Here is your mood analysis.",
      suggestions: Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0
        ? parsed.suggestions
        : ["Take a mindful breath and enjoy the moment 🌸"],
      moodColors: sanitizedColors,
    };
  } catch (error) {
    console.error("Moodify analysis error:", error);

    const errorMsg = (error.message || "").toLowerCase();

    if (errorMsg.includes("leaked") || errorMsg.includes("403") || errorMsg.includes("api_key_invalid") || errorMsg.includes("permission_denied")) {
      throw new Error(
        "Invalid or revoked API key. Please check your VITE_GEMINI_API_KEY in the .env file."
      );
    }

    if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("resource_exhausted")) {
      throw new Error(
        "API quota or rate limit exceeded. Please wait a moment before trying again."
      );
    }

    if (errorMsg.includes("safety") || errorMsg.includes("blocked")) {
      throw new Error(
        "This content was flagged by Gemini safety filters. Please try rephrasing your sentence."
      );
    }

    if (errorMsg.includes("failed to fetch") || errorMsg.includes("network")) {
      throw new Error(
        "Network connection failed. Please check your internet connection and try again."
      );
    }

    throw new Error(error.message || "Failed to analyze emotion. Please try again.");
  }
};
