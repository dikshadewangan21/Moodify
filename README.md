# 🎭 Moodify — AI Emotion & Mood Analyzer

> Discover your emotions, visualize mood harmonies, and receive empathetic, actionable suggestions powered by Google Gemini AI.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Overview

**Moodify** is an intelligent, responsive web application that analyzes the emotional tone, sentiment, and nuances in your thoughts and writing. By utilizing Google's Gemini generative AI model with structured schema output, Moodify:

1. **Identifies primary emotions** with expressive matching emoji cues.
2. **Evaluates emotional intensity** on a dynamic 1–10 visual scale.
3. **Generates actionable, uplifting suggestions** tailored to your current headspace.
4. **Extracts dynamic mood color palettes** to dynamically adapt the background gradient, button styles, and card accents in real-time.
5. **Maintains a local mood journal** of recent analyses so you can track your reflections.

---

## ✨ Features

- **Empathetic AI Analysis**: Powered by Google's `gemini-1.5-flash` model using structured JSON output for deterministic, reliable parsing.
- **Dynamic Theming**: The interface shifts its color palette and gradient lighting based on the emotional palette returned by the AI.
- **Intensity Meter**: Visual 1–10 gauge showing how strong the detected sentiment is.
- **Actionable Advice**: Tailored, practical suggestions on activities, mindset shifts, or habits to try.
- **Secure Environment Configuration**: Store your API key directly in `.env` using `VITE_GEMINI_API_KEY`, protected from Git tracking via `.gitignore`.
- **Recent Mood History**: View, reload, and clear your recent mood reflections without any database setup.
- **Intuitive Keyboard Controls**: Press <kbd>Enter</kbd> to analyze, or <kbd>Shift</kbd> + <kbd>Enter</kbd> to type multiline paragraphs.
- **Quick-Start Prompts**: Click one of the sample prompt pills to test the application instantly.
- **Zero-Vulnerability Dependencies**: Cleaned package tree with modern Tailwind CSS v4 and React 19.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component-based UI library |
| **Vite 6** | Next-generation build tool & dev server |
| **Tailwind CSS v4** | Modern utility-first CSS styling engine |
| **@google/generative-ai** | Official Google Gemini AI SDK |
| **ESLint 9** | Modern flat-config code quality and linting |

---

## 📁 Project Structure

```text
Moodify/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Project icons and graphics
│   ├── components/
│   │   └── EmotionAnalyzer.jsx  # Main interactive analyzer UI component
│   ├── services/
│   │   └── geminiService.js     # Gemini API integration & structured JSON parsing
│   ├── App.jsx             # Root layout container
│   ├── App.css             # Component-level styles
│   ├── index.css           # Tailwind CSS v4 imports
│   └── main.jsx            # React root mount point
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules (protects API keys)
├── eslint.config.js        # ESLint flat configuration
├── index.html              # HTML document root with custom metadata & favicon
├── package.json            # Dependencies and npm scripts
└── vite.config.js          # Vite and Tailwind plugin configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version **18.0.0** or higher recommended)
- [npm](https://www.npmjs.com/) (version **9.0.0** or higher)
- A free **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone or extract the repository**:
   ```bash
   git clone https://github.com/your-username/moodify.git
   cd moodify
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure your Gemini API Key**:
   - Open the [.env](file:///.env) file located at the project root.
   - Insert your Gemini API key:
     ```env
     VITE_GEMINI_API_KEY=AIzaSy...your_key_here
     ```
   *(If creating a new file, copy `.env.example` to `.env`)*

4. **Launch the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts Vite HMR dev server at `http://localhost:5173` |
| **Build** | `npm run build` | Bundles and optimizes the production build to `/dist` |
| **Lint** | `npm run lint` | Runs ESLint to verify code quality and rule conformance |
| **Preview** | `npm run preview` | Locally serves the compiled production build from `/dist` |

---

## 🚢 Deployment

### Deploying to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project into [Vercel](https://vercel.com/).
3. Set the Framework Preset to **Vite**.
4. In **Environment Variables**, add:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API Key *(Optional if users will input keys via the in-app settings)*.
5. Click **Deploy**.

### Deploying to Netlify

1. Link your repository in [Netlify](https://netlify.com/).
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables under **Site configuration > Environment variables**.
5. Deploy site.

---

## 🛡️ Security & Privacy Notice

- **Secret Protection**: `.env` and `.env.*` files are explicitly ignored in `.gitignore` to prevent leaking API keys to public repositories.
- **Client-Side Key Storage**: When you enter an API key into the in-app Settings modal, it is stored only inside your browser's `localStorage`. It is communicated directly to Google's Generative AI endpoints and never sent to any third-party intermediate server.
- **Production Tip**: For commercial deployments with sensitive API quotas, consider routing requests through a serverless backend function (e.g., Vercel Edge Function or Express API) to protect the key from browser exposure.

---

## ❓ Troubleshooting FAQ

<details>
<summary><b>1. Error: "Invalid or revoked API key"</b></summary>
Your API key may have been deactivated or reported as leaked. Visit <a href="https://aistudio.google.com/app/apikey">Google AI Studio</a>, generate a fresh key, and paste it into the in-app <b>Settings ⚙️</b> modal.
</details>

<details>
<summary><b>2. Error: "API quota or rate limit exceeded"</b></summary>
The free tier of Gemini has per-minute request limits. Wait 30–60 seconds before submitting another analysis, or ensure you are using your own API key rather than a shared key.
</details>

<details>
<summary><b>3. Textarea submits when pressing Enter</b></summary>
Press <kbd>Shift</kbd> + <kbd>Enter</kbd> to start a new line. Pressing <kbd>Enter</kbd> alone is a convenient shortcut to trigger the analysis.
</details>

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
