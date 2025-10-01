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

## 🚀 How to Run

### Option 1: In Google AI Studio (Recommended)

The easiest way to get started, with no setup required.

1.  **Open in AI Studio**: Open this project directly in **Google AI Studio**.
2.  **Add API Key**: In the left panel, navigate to the "Secrets" section (it looks like a key icon 🔑). Add a new secret named `API_KEY` and paste your Google Gemini API key as the value.
3.  **Run**: Click the **Run** button at the top of the interface. The application will start in a new panel within AI Studio.

### Option 2: On Your Local Machine

For developers who want to run and modify the code locally.

**Prerequisites:**
*   [Git](https://git-scm.com/) installed to clone the repository.
*   A simple web server. We provide instructions for Python's built-in server and a Node.js-based one.

**Step-by-Step Instructions:**

1.  **Clone the Repository**
    Open your terminal or command prompt and run the following command to download the project files:
    ```bash
    git clone https://github.com/aaronwesthoff84/Gemini-Text-to-Speech
    ```

2.  **Navigate to the Project Directory**
    Change your current directory to the newly created project folder:
    ```bash
    cd aistudio-gemini-text-to-speech-react
    ```
    All subsequent commands should be run from inside this directory.

3.  **Configure Your API Key**
    This application needs your Google Gemini API key to work. For local development, you need to add it directly to the code.

    *   Open the `index.tsx` file in a text editor.
    *   Find the line that contains `process.env.API_KEY`. It will be inside the `handleGenerateAudio` function.
    *   Replace `process.env.API_KEY` with your actual API key in quotes.

        **Change this:**
        ```javascript
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        ```
        **To this:**
        ```javascript
        // ⚠️ IMPORTANT: Replace with your actual key for local testing
        const ai = new GoogleGenAI({ apiKey: 'YOUR_GEMINI_API_KEY_HERE' });
        ```
    > **Security Warning**: Do not commit this change or share your code publicly with the API key inside it. This method is only for local testing. Always remove your key before pushing changes to a public repository like GitHub.

4.  **Start the Local Web Server**
    This project is a static website and needs to be served by a web server to function correctly (you cannot just open `index.html` from your file system).

    Choose **one** of the following methods from your terminal:

    *   **Using Python (if you have Python installed):**
        ```bash
        # For Python 3
        python3 -m http.server
        
        # Or for Python 2
        python -m SimpleHTTPServer
        ```

    *   **Using Node.js (if you have Node.js and npm installed):**
        This command uses `npx` to run a server without installing it globally.
        ```bash
        npx serve
        ```

5.  **Open the Application**
    Once the server is running, it will print a local address in your terminal. It will likely be one of these:
    *   `http://localhost:8000`
    *   `http://127.0.0.1:8000`
    *   `http://localhost:3000` (if using `npx serve`)

    Open this URL in your web browser to use the application.


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
