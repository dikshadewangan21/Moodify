import React, { useState } from 'react';
import { analyzeEmotion } from '../services/geminiService';

const EmotionAnalyzer = () => {
  const [inputText, setInputText] = useState('');
  const [emotionResult, setEmotionResult] = useState('');
  const [displayResult, setDisplayResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [moodColors, setMoodColors] = useState(['#3B82F6', '#6366F1']); // default blue gradient

  const extractColorsFromResponse = (response) => {
    // Extract hex color codes from the response
    const colorRegex = /#[0-9A-Fa-f]{6}/g;
    const colors = response.match(colorRegex);
    if (colors && colors.length >= 2) {
      return colors.slice(0, 3); // Take first 3 colors
    }
    // Fallback colors based on common emotions
    if (response.toLowerCase().includes('happy') || response.toLowerCase().includes('joy')) {
      return ['#FFD700', '#FFA500', '#FF6347'];
    } else if (response.toLowerCase().includes('sad') || response.toLowerCase().includes('blue')) {
      return ['#4A90E2', '#5B9BD5', '#87CEEB'];
    } else if (response.toLowerCase().includes('angry') || response.toLowerCase().includes('mad')) {
      return ['#FF4757', '#FF3838', '#FF6B6B'];
    } else if (response.toLowerCase().includes('calm') || response.toLowerCase().includes('peace')) {
      return ['#26D0CE', '#1DD1A1', '#55A3FF'];
    } else if (response.toLowerCase().includes('excited') || response.toLowerCase().includes('energetic')) {
      return ['#FF6B35', '#F7931E', '#FFD23F'];
    } else if (response.toLowerCase().includes('love') || response.toLowerCase().includes('romantic')) {
      return ['#FF69B4', '#FF1493', '#FFB6C1'];
    }
    return ['#3B82F6', '#6366F1', '#8B5CF6']; // default
  };

  const removeColorCodesFromDisplay = (response) => {
    // Remove the MOOD COLORS section from display
    return response.replace(/🌈 \*\*MOOD COLORS\*\*:.*$/gm, '').trim();
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Please enter a sentence to analyze 🤔');
      return;
    }

    setIsLoading(true);
    setError('');
    setEmotionResult('');
    setDisplayResult('');

    try {
      const result = await analyzeEmotion(inputText);
      setEmotionResult(result);

      // Extract and set mood colors for dynamic theming
      const colors = extractColorsFromResponse(result);
      setMoodColors(colors);

      // Remove color codes from display
      const cleanResult = removeColorCodesFromDisplay(result);
      setDisplayResult(cleanResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setEmotionResult('');
    setDisplayResult('');
    setError('');
    setMoodColors(['#3B82F6', '#6366F1']); // reset to default
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAnalyze();
    }
  };

  // Dynamic gradient style based on mood colors
  const dynamicGradient = {
    background: `linear-gradient(135deg, ${moodColors[0]}15 0%, ${moodColors[1]}15 50%, ${moodColors[2] || moodColors[1]}15 100%)`
  };

  const dynamicButtonStyle = {
    background: `linear-gradient(135deg, ${moodColors} 0%, ${moodColors[1]} 100%)`
  };

  const dynamicCardStyle = {
    background: `linear-gradient(135deg, ${moodColors}08 0%, ${moodColors[1]}08 100%)`,
    borderColor: moodColors
  };

  return (
    <div className="min-h-screen py-12 px-4" style={dynamicGradient}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            🎭 Emotion Analyzer ✨
          </h1>
          <p className="text-lg text-gray-600">
            Discover your emotions and get suggestions for your mood! 🌈
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl md:p-8 p-3 mb-8 border-2" style={dynamicCardStyle}>
          <div className="mb-6">
            <label
              htmlFor="sentence-input"
              className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2"
            >
              💬 Share what's on your mind:
            </label>
            <div className="flex md:flex-row flex-col gap-4">
              <textarea
                id="sentence-input"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your thoughts, feelings, or any sentence here... 🌟"
                className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:border-transparent resize-none h-28 text-base transition-all duration-300"
                style={{
                  focusRingColor: moodColors,
                  '--tw-ring-color': moodColors
                }}
                disabled={isLoading}
              />
              <div className="flex md:flex-col justify-center gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !inputText.trim()}
                  className="px-8 md:py-4 py-2 text-white font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                  style={!isLoading && inputText.trim() ? dynamicButtonStyle : {}}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </div>
                  ) : (
                    '✨ Analyze'
                  )}
                </button>
                <button
                  onClick={handleClear}
                  className="px-8  md:py-4 py-2 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">❌</span>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {displayResult && (
            <div
              className="rounded-xl p-6 border-2 shadow-inner"
              style={{
                backgroundColor: `${moodColors[0]}08`,
                borderColor: moodColors
              }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: moodColors[1] }}>
                🎨 Your Emotional Analysis
              </h3>
              <div
                className="text-gray-800 whitespace-pre-wrap text-lg bg-white p-5 rounded-lg border-l-4 leading-relaxed shadow-sm"
                style={{ borderLeftColor: moodColors[0] }}
              >
                {displayResult}
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>🤖 Powered by Google Gemini AI • 🚀 Built with React, Vite & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default EmotionAnalyzer;
