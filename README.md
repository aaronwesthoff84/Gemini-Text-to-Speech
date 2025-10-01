# Gemini Text-to-Speech

A powerful web application that converts text into high-quality, natural-sounding speech using the Google Gemini API. This app showcases the streaming TTS capabilities of Gemini, providing real-time audio generation from text.

## ✨ Features

-   **High-Quality Audio**: Leverages Gemini's advanced TTS models for clear and natural speech.
-   **Voice Variety**: Choose from a diverse collection of male and female voices.
-   **Real-time Streaming**: Audio is generated and delivered in chunks, allowing playback to start before the full script is processed.
-   **Tone Control**: Guide the AI's performance by adding descriptive cues in your script (e.g., "Read in a warm, welcoming tone").
-   **Playback Controls**: Adjust the playback speed for each audio clip.
-   **Downloadable Audio**: Save the generated audio chunks as `.wav` files.
-   **Light & Dark Mode**: A sleek, modern UI that adapts to your system's theme.
-   **Responsive Design**: Works beautifully on both desktop and mobile devices.

## 🚀 Quick Start

### Option 1: Run in Google AI Studio
The easiest way to get started.
1.  Open this project in **Google AI Studio**.
2.  Configure your Gemini API key in the studio's secrets manager.
3.  Click the **Run** button to launch the application instantly.

### Option 2: Run Locally from GitHub
For developers who want to run the app on their own machine.

```bash
# 1. Clone the repository
git clone https://github.com/aaronwesthoff84/gemini-text-to-speech.git
cd gemini-text-to-speech

# 2. Set up your API Key
# The app is designed to run in an environment where process.env.API_KEY is available.
# You will need to configure this for your local setup.

# 3. Serve the application
# Use any simple static file server. For example, with Python:
python -m http.server 8000
```
Then, open `http://localhost:8000` in your browser.

## 📁 Repository Structure

```
├── index.html          # Main HTML entry point
├── index.css           # Stylesheet for the application
├── index.tsx           # Main React application logic
├── metadata.json       # Configuration for Google AI Studio
└── README.md           # This file
```

## 🛠️ Usage Examples

### Basic Usage
1.  **Enter Script**: Type your text into the "Your Script" area.
2.  **Select Voice**: Pick a voice from the dropdown.
3.  **Generate**: Click "Generate Audio".
4.  **Listen**: The audio will be generated in chunks and play automatically.

### Controlling the Tone
You can direct the AI's vocal performance by adding cues directly in the script.

**Example Script:**
```
Read this first part in a calm, soothing voice

Welcome to this guided meditation. Find a comfortable position and gently close your eyes.

Now, read this part with excitement and energy!

And that's how you can achieve your goals!
```

## 🔧 Requirements

### For All Users
-   **Browser**: A modern web browser (Chrome, Firefox, Safari, Edge).
-   **API Key**: A Google Gemini API Key.

### For Local Development
-   **Git**: For cloning the repository.
-   **HTTP Server**: A way to serve static files (like Python's `http.server` or Node's `serve`).

## 🐛 Troubleshooting

### Common Issues

**"An error occurred" message appears**
-   **Invalid API Key**: Double-check that your Gemini API key is correct and active.
-   **Network Error**: Ensure you have a stable internet connection.
-   **Model Access**: You may not have access to the specific TTS model. Check the [Google AI for Developers](https://ai.google.dev/) website for model availability.

**Audio doesn't autoplay**
-   Modern browsers often block autoplay until you interact with the page. Click anywhere on the page or press the play button on the first audio clip to start the playback sequence.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  **Fork** the Project
2.  **Create** your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  **Push** to the Branch (`git push origin feature/AmazingFeature`)
5.  **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Copyright (c) 2024 Google

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
