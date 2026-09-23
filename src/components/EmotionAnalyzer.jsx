import React, { useState, useEffect } from 'react';
import { analyzeEmotion } from '../services/geminiService';

const SAMPLE_PROMPTS = [
  { text: "I just got the promotion I've worked so hard for!", label: "🎉 Promotion" },
  { text: "Feeling overwhelmed and drained after a stressful week.", label: "🌧️ Overwhelmed" },
  { text: "Enjoying a peaceful morning coffee by the window.", label: "☕ Peaceful" },
  { text: "Really nervous and anxious about speaking in public tomorrow.", label: "⚡ Anxious" },
];

const DEFAULT_COLORS = ['#3B82F6', '#6366F1', '#8B5CF6'];

const EmotionAnalyzer = () => {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [moodColors, setMoodColors] = useState(DEFAULT_COLORS);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history on mount
  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('moodify_history') || '[]');
      if (Array.isArray(savedHistory)) {
        setHistory(savedHistory);
      }
    } catch {
      setHistory([]);
    }
  }, []);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (error) setError('');
  };

  const handleAnalyze = async () => {
    const textToAnalyze = inputText.trim();
    if (!textToAnalyze) {
      setError('Please enter some thoughts or feelings to analyze 🤔');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await analyzeEmotion(textToAnalyze);
      setAnalysis(result);
      if (result.moodColors && result.moodColors.length >= 2) {
        setMoodColors(result.moodColors);
      }

      // Save to recent history
      const newEntry = {
        id: Date.now(),
        text: textToAnalyze,
        emotion: result.emotion,
        intensity: result.intensity,
        moodColors: result.moodColors,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const updatedHistory = [newEntry, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      localStorage.setItem('moodify_history', JSON.stringify(updatedHistory));
    } catch (err) {
      setError(err.message || 'Failed to analyze emotion.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setAnalysis(null);
    setError('');
    setMoodColors(DEFAULT_COLORS);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('moodify_history');
  };

  const handleKeyDown = (e) => {
    // Enter without Shift triggers analysis; Shift+Enter creates a new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  // Dynamic style calculations with valid, safe color strings
  const color1 = moodColors[0] || DEFAULT_COLORS[0];
  const color2 = moodColors[1] || DEFAULT_COLORS[1];
  const color3 = moodColors[2] || color2;

  const dynamicBackground = {
    background: `linear-gradient(135deg, ${color1}15 0%, ${color2}15 50%, ${color3}15 100%)`,
  };

  const dynamicPrimaryButton = {
    background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
  };

  const dynamicCardBorder = {
    borderColor: color1,
  };

  return (
    <div className="min-h-screen py-10 px-4 transition-colors duration-700 font-sans" style={dynamicBackground}>
      <div className="max-w-3xl mx-auto">
        
        {/* Top Navigation Bar */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎭</span>
            <span className="font-extrabold text-2xl tracking-tight text-gray-900">Moodify</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">AI</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3.5 py-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white/80 hover:bg-white text-gray-700 shadow-sm transition-all flex items-center gap-1.5"
              title="View analysis history"
            >
              <span>📜 History</span>
              {history.length > 0 && (
                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600 font-bold">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            How are you feeling right now? ✨
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            Write a sentence or paragraph describing your mood, thoughts, or day. Moodify uncovers your emotional tone, visualizes it, and gives actionable advice.
          </p>
        </div>

        {/* Main Card */}
        <main
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-5 sm:p-8 mb-8 border-2 transition-all duration-500"
          style={dynamicCardBorder}
        >
          {/* Sample Prompts */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Try a quick example:
            </p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(sample.text);
                    if (error) setError('');
                  }}
                  className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Area */}
          <div className="mb-6">
            <label
              htmlFor="sentence-input"
              className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between"
            >
              <span>💬 Express your mind:</span>
              <span className="text-xs text-gray-400 font-normal">
                {inputText.length} / 500 characters
              </span>
            </label>
            <textarea
              id="sentence-input"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              maxLength={500}
              placeholder="Type your feelings, reflections, or how your day went... (Press Enter to analyze, Shift+Enter for new line)"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none resize-none h-32 text-base transition-all duration-200 bg-gray-50/50 focus:bg-white text-gray-800"
              style={{
                borderColor: inputText ? `${color1}60` : undefined,
              }}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Tip: Press <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-[11px] font-mono text-gray-600">Enter</kbd> to analyze, or <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-[11px] font-mono text-gray-600">Shift + Enter</kbd> for a new line.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 mb-6">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !inputText.trim()}
              className="flex-1 py-3.5 px-6 text-white font-semibold rounded-xl hover:opacity-95 active:scale-[0.99] focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
              style={!isLoading && inputText.trim() ? dynamicPrimaryButton : {}}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing Emotion...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Analyze Mood</span>
                </>
              )}
            </button>

            <button
              onClick={handleClear}
              disabled={isLoading || (!inputText && !analysis && !error)}
              className="py-3.5 px-6 bg-gray-100 hover:bg-gray-200 active:scale-[0.99] text-gray-700 font-semibold rounded-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Clear
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-800 flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">Notice</p>
                <p className="text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Structured Analysis Results */}
          {analysis && (
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
              
              {/* Emotion & Intensity Card */}
              <div
                className="p-5 rounded-2xl border-2 transition-all"
                style={{
                  backgroundColor: `${color1}0c`,
                  borderColor: `${color1}40`,
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Detected Emotion
                    </span>
                    <h2 className="text-2xl font-black text-gray-900 mt-0.5">
                      {analysis.emotion}
                    </h2>
                  </div>

                  {/* Intensity Meter */}
                  <div className="bg-white/80 px-4 py-2 rounded-xl border border-gray-200 text-right">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Intensity: <span className="text-gray-900 font-black">{analysis.intensity}/10</span>
                    </div>
                    <div className="w-32 h-2.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${analysis.intensity * 10}%`,
                          backgroundColor: color1,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-base leading-relaxed bg-white/90 p-4 rounded-xl border border-gray-100 shadow-xs">
                  {analysis.summary}
                </p>
              </div>

              {/* Actionable Suggestions */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-1.5">
                  <span>💡</span>
                  <span>Suggestions for Your Mood</span>
                </h3>
                <div className="grid gap-2.5">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3.5 bg-gray-50/80 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-gray-200 text-xs font-bold flex items-center justify-center text-gray-600 shadow-2xs">
                        {index + 1}
                      </span>
                      <p className="text-gray-800 text-sm sm:text-base leading-snug">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mood Color Palette */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <span>🎨</span>
                  <span>Mood Color Harmony</span>
                </h3>
                <div className="flex items-center gap-3">
                  {analysis.moodColors.map((hex, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white shadow-xs"
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-2xs"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="font-mono text-xs font-semibold text-gray-700 uppercase">
                        {hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </main>

        {/* Recent History Drawer */}
        {showHistory && (
          <section className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>📜</span>
                <span>Recent Analyses</span>
              </h2>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear History
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                No past analyses recorded yet. Try analyzing a sentence above!
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {history.map((item) => (
                  <div key={item.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-800">{item.emotion}</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                          Intensity {item.intensity}/10
                        </span>
                        <span className="text-xs text-gray-400">{item.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1 italic">
                        "{item.text}"
                      </p>
                    </div>
                    <button
                      onClick={() => setInputText(item.text)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 bg-indigo-50 rounded"
                    >
                      Reload
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-gray-500 space-y-1">
          <p>Moodify • Powered by Google Gemini AI</p>
          <p>Built with React 19, Vite & Tailwind CSS</p>
        </footer>

      </div>
    </div>
  );
};

export default EmotionAnalyzer;
