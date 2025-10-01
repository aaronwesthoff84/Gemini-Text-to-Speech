import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Modality } from '@google/genai';

// --- Browser-compatible WAV conversion utilities ---

interface WavConversionOptions {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
}

function parseMimeType(mimeType: string): WavConversionOptions {
  const params = mimeType.split(';').map(s => s.trim());
  const options: Partial<WavConversionOptions> = { numChannels: 1 }; // Default to mono

  for (const param of params) {
    if (param.startsWith('rate=')) {
      options.sampleRate = parseInt(param.substring(5), 10);
    } else if (param.startsWith('audio/L')) {
      const bits = parseInt(param.substring(7), 10);
      if (!isNaN(bits)) {
        options.bitsPerSample = bits;
      }
    }
  }

  if (!options.sampleRate) throw new Error('Sample rate not found in mime type');
  if (!options.bitsPerSample) throw new Error('Bit depth not found in mime type');
  
  return options as WavConversionOptions;
}

function createWavHeader(dataLength: number, options: WavConversionOptions): ArrayBuffer {
  const { numChannels, sampleRate, bitsPerSample } = options;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // RIFF identifier
  view.setUint8(0, 'R'.charCodeAt(0));
  view.setUint8(1, 'I'.charCodeAt(0));
  view.setUint8(2, 'F'.charCodeAt(0));
  view.setUint8(3, 'F'.charCodeAt(0));
  // RIFF chunk size
  view.setUint32(4, 36 + dataLength, true);
  // WAVE identifier
  view.setUint8(8, 'W'.charCodeAt(0));
  view.setUint8(9, 'A'.charCodeAt(0));
  view.setUint8(10, 'V'.charCodeAt(0));
  view.setUint8(11, 'E'.charCodeAt(0));
  // fmt sub-chunk identifier
  view.setUint8(12, 'f'.charCodeAt(0));
  view.setUint8(13, 'm'.charCodeAt(0));
  view.setUint8(14, 't'.charCodeAt(0));
  view.setUint8(15, ' '.charCodeAt(0));
  // fmt chunk size
  view.setUint32(16, 16, true);
  // Audio format (1 is PCM)
  view.setUint16(20, 1, true);
  // Number of channels
  view.setUint16(22, numChannels, true);
  // Sample rate
  view.setUint32(24, sampleRate, true);
  // Byte rate
  view.setUint32(28, byteRate, true);
  // Block align
  view.setUint16(32, blockAlign, true);
  // Bits per sample
  view.setUint16(34, bitsPerSample, true);
  // data sub-chunk identifier
  view.setUint8(36, 'd'.charCodeAt(0));
  view.setUint8(37, 'a'.charCodeAt(0));
  view.setUint8(38, 't'.charCodeAt(0));
  view.setUint8(39, 'a'.charCodeAt(0));
  // data chunk size
  view.setUint32(40, dataLength, true);

  return buffer;
}

function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}


function convertToWav(rawData: string, mimeType: string): Blob {
    const pcmData = base64ToUint8Array(rawData);
    const options = parseMimeType(mimeType);
    const wavHeader = createWavHeader(pcmData.byteLength, options);
    
    const wavBlob = new Blob([wavHeader, pcmData], { type: 'audio/wav' });
    return wavBlob;
}


// --- React App Component ---

const initialScript = `leda: "Hello, world."
Fenrir: "Welcome to the future of audio generation."`;

interface GeneratedAudio {
  name: string;
  url: string;
}

const App = () => {
  const [script, setScript] = useState<string>(initialScript);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audios, setAudios] = useState<GeneratedAudio[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGenerateAudio = useCallback(async () => {
    if (!script.trim()) {
      setError("Please enter some text to generate audio.");
      return;
    }

    setIsLoading(true);
    setAudios([]);
    setError('');
    setStatusMessage('Initializing audio generation...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // NOTE: 'gemini-2.5-pro-preview-tts' is a model specified in the user's code snippet.
      // Its availability may vary, and a different model may be required.
      const model = 'gemini-2.5-pro-preview-tts';
      
      const config = {
        // The modality must be Modality.AUDIO for text-to-speech.
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              { speaker: 'leda', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Leda' } } },
              { speaker: 'Fenrir', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } } },
            ]
          },
        },
      };

      const contents = [{ role: 'user', parts: [{ text: script }] }];
      
      const responseStream = await ai.models.generateContentStream({
        model,
        contents,
        config,
      });

      let fileIndex = 0;
      setStatusMessage('Receiving audio stream...');

      for await (const chunk of responseStream) {
        const inlineData = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        if (inlineData?.data && inlineData?.mimeType) {
          
          let audioBlob: Blob;
          // The snippet suggests the raw audio is PCM and needs a WAV header.
          if (inlineData.mimeType.startsWith('audio/L')) {
             audioBlob = convertToWav(inlineData.data, inlineData.mimeType);
          } else {
             // If it's already a standard format, create a blob directly.
             const audioData = base64ToUint8Array(inlineData.data);
             audioBlob = new Blob([audioData], { type: inlineData.mimeType });
          }
          
          const url = URL.createObjectURL(audioBlob);
          const newAudio: GeneratedAudio = {
            name: `audio_chunk_${fileIndex++}.wav`,
            url: url,
          };
          setAudios(prev => [...prev, newAudio]);
          setStatusMessage(`Generated audio chunk ${fileIndex}.`);
        }
      }
      setStatusMessage('Audio generation complete!');

    } catch (err) {
      console.error(err);
      setError(`An error occurred: ${(err as Error).message}`);
      setStatusMessage('');
    } finally {
      setIsLoading(false);
    }
  }, [script]);

  return (
    <div className="app-container">
      <header>
        <h1>Gemini Text-to-Speech</h1>
        <p className="description">Enter a script with speaker tags to generate multi-voice audio.</p>
      </header>
      <main>
        <div className="input-section">
          <label htmlFor="script-input">Your Script</label>
          <textarea
            id="script-input"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            disabled={isLoading}
            aria-label="Script input for text to speech"
            placeholder="Enter your script here..."
          />
        </div>
        <div className="controls">
          <button onClick={handleGenerateAudio} disabled={isLoading}>
            {isLoading && <span className="loader"></span>}
            {isLoading ? 'Generating...' : 'Generate Audio'}
          </button>
        </div>
        
        {(statusMessage && !error) && <div className="status-message info">{statusMessage}</div>}
        {error && <div className="status-message error">{error}</div>}

        {audios.length > 0 && (
          <section className="output-section">
            <h2>Generated Audio</h2>
            <ul id="audio-list">
              {audios.map((audio, index) => (
                <li key={index} className="audio-item">
                  <span className="audio-info">{audio.name}</span>
                  <div className="audio-controls">
                    <audio controls src={audio.url} aria-label={`Playback for ${audio.name}`}></audio>
                    <a href={audio.url} download={audio.name} className="download-btn" aria-label={`Download ${audio.name}`}>
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);