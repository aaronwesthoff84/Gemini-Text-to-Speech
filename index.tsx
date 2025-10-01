
import React, { useState, useCallback, useEffect, useRef } from 'react';
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

const MAX_SCRIPT_LENGTH = 5000;
const FALLBACK_VOICE = 'Zephyr';

interface Voice {
    id: string;
    name: string;
}

interface VoiceGroup {
    label: string;
    voices: Voice[];
}

const VOICE_GROUPS: VoiceGroup[] = [
    {
        label: 'Male Voices',
        voices: [
            { id: 'Puck', name: 'Puck' },
            { id: 'Charon', name: 'Charon' },
            { id: 'Fenrir', name: 'Fenrir' },
            { id: 'Orus', name: 'Orus' },
            { id: 'Enceladus', name: 'Enceladus' },
            { id: 'Iapetus', name: 'Iapetus' },
            { id: 'Umbriel', name: 'Umbriel' },
            { id: 'Algieba', name: 'Algieba' },
            { id: 'Algenib', name: 'Algenib' },
            { id: 'Rasalgethi', name: 'Rasalgethi' },
            { id: 'Achernar', name: 'Achernar' },
            { id: 'Alnilam', name: 'Alnilam' },
            { id: 'Schedar', name: 'Schedar' },
            { id: 'Gacrux', name: 'Gacrux' },
            { id: 'Achird', name: 'Achird' },
            { id: 'Zubenelgenubi', name: 'Zubenelgenubi' },
            { id: 'Sadachbia', name: 'Sadachbia' },
            { id: 'Sadaltager', name: 'Sadaltager' },
            { id: 'Sulafar', name: 'Sulafar' },
        ],
    },
    {
        label: 'Female Voices',
        voices: [
            { id: 'Zephyr', name: 'Zephyr' },
            { id: 'Kore', name: 'Kore' },
            { id: 'Leda', name: 'Leda' },
            { id: 'Aoede', name: 'Aoede' },
            { id: 'Callirhoe', name: 'Callirhoe' },
            { id: 'Autonoe', name: 'Autonoe' },
            { id: 'Despina', name: 'Despina' },
            { id: 'Erinome', name: 'Erinome' },
            { id: 'Laomedeia', name: 'Laomedeia' },
            { id: 'Pulcherrima', name: 'Pulcherrima' },
            { id: 'Vindemiatrix', name: 'Vindemiatrix' },
        ],
    },
];

const initialScript = `Hello, world. Welcome to the future of audio generation. Select a voice and hear me speak.`;

interface GeneratedAudio {
  name: string;
  url: string;
}

const getInitialTheme = (): string => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};


const App = () => {
  const [script, setScript] = useState<string>(initialScript);
  const [selectedVoice, setSelectedVoice] = useState<string>(VOICE_GROUPS[0].voices[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audios, setAudios] = useState<GeneratedAudio[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [theme, setTheme] = useState<string>(getInitialTheme);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [isAutoplayPending, setIsAutoplayPending] = useState<boolean>(false);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);


  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Effect to handle starting the autoplay sequence
  useEffect(() => {
    if (audios.length > 0 && isAutoplayPending) {
        setCurrentlyPlaying(0);
        setIsAutoplayPending(false);
    }
  }, [audios, isAutoplayPending]);

  // Effect to handle playing the current audio in the sequence
  useEffect(() => {
    if (currentlyPlaying !== null) {
      const audioEl = audioRefs.current[currentlyPlaying];
      if (audioEl) {
        audioEl.play().catch(e => {
          console.error("Audio autoplay failed.", e);
          setError("Audio autoplay was blocked by the browser. Please press play manually.");
          setCurrentlyPlaying(null);
        });
      }
    }
  }, [currentlyPlaying]);

  const toggleTheme = () => {
      setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleGenerateAudio = useCallback(async () => {
    // --- Input Validation ---
    if (!script.trim()) {
      setError("Please enter a script to generate audio.");
      return;
    }

    if (script.length > MAX_SCRIPT_LENGTH) {
      setError(`Script exceeds the maximum length of ${MAX_SCRIPT_LENGTH} characters.`);
      return;
    }
    // --- End Validation ---

    setIsLoading(true);
    setAudios([]);
    setCurrentlyPlaying(null);
    setIsAutoplayPending(true);
    setError('');
    setStatusMessage('Initializing audio generation...');

    // --- First attempt with selected voice ---
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-pro-preview-tts';
      
      const config = {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice }
            }
        },
      };

      const contents = [{ role: 'user', parts: [{ text: script }] }];
      
      setStatusMessage(`Generating with voice: ${selectedVoice}...`);
      const responseStream = await ai.models.generateContentStream({
        model,
        contents,
        config,
      });

      let fileIndex = 0;
      for await (const chunk of responseStream) {
        const inlineData = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        if (inlineData?.data && inlineData?.mimeType) {
          
          let audioBlob: Blob;
          if (inlineData.mimeType.startsWith('audio/L')) {
             audioBlob = convertToWav(inlineData.data, inlineData.mimeType);
          } else {
             const audioData = base64ToUint8Array(inlineData.data);
             audioBlob = new Blob([audioData], { type: inlineData.mimeType });
          }
          
          const url = URL.createObjectURL(audioBlob);
          const newAudio = {
            name: `audio_chunk_${fileIndex++}.wav`,
            url: url,
          };

          setAudios(prev => [...prev, newAudio]);
          setStatusMessage(`Generated audio chunk ${fileIndex}.`);
        }
      }
      setStatusMessage('Audio generation complete!');

    } catch (err) {
      console.error(`Error with voice ${selectedVoice}:`, err);

      // If the selected voice wasn't the fallback, try the fallback.
      if (selectedVoice !== FALLBACK_VOICE) {
        setStatusMessage(`Voice '${selectedVoice}' failed. Trying fallback voice '${FALLBACK_VOICE}'...`);
        // Clear any partial results from the failed attempt
        setAudios([]);

        // --- Second attempt with fallback voice ---
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const model = 'gemini-2.5-pro-preview-tts';
          
          const config = {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: FALLBACK_VOICE }
                }
            },
          };

          const contents = [{ role: 'user', parts: [{ text: script }] }];
          
          const responseStream = await ai.models.generateContentStream({
            model,
            contents,
            config,
          });

          let fileIndex = 0;
          for await (const chunk of responseStream) {
            const inlineData = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData;
            if (inlineData?.data && inlineData?.mimeType) {
              
              let audioBlob: Blob;
              if (inlineData.mimeType.startsWith('audio/L')) {
                 audioBlob = convertToWav(inlineData.data, inlineData.mimeType);
              } else {
                 const audioData = base64ToUint8Array(inlineData.data);
                 audioBlob = new Blob([audioData], { type: inlineData.mimeType });
              }
              
              const url = URL.createObjectURL(audioBlob);
              const newAudio = {
                name: `audio_chunk_${fileIndex++}.wav`,
                url: url,
              };

              setAudios(prev => [...prev, newAudio]);
              setStatusMessage(`Generated audio chunk ${fileIndex} with fallback.`);
            }
          }
          setStatusMessage('Audio generation complete with fallback voice!');
        } catch (fallbackErr) {
            console.error(`Error with fallback voice ${FALLBACK_VOICE}:`, fallbackErr);
            setError(`An error occurred: ${(fallbackErr as Error).message}`);
            setStatusMessage('');
        }
      } else {
        // The selected voice was already the fallback, so just fail.
        setError(`An error occurred: ${(err as Error).message}`);
        setStatusMessage('');
      }
    } finally {
      setIsLoading(false);
    }
  }, [script, selectedVoice]);

  return (
    <div className="app-container">
      <header>
        <div className="header-content">
          <h1>Gemini Text-to-Speech</h1>
          <p className="description">
              Enter some text, choose a voice, and listen to the generated audio.
          </p>
        </div>
        <button onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <svg className="icon-sun" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            <svg className="icon-moon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>
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
           <div className={`char-counter ${script.length > MAX_SCRIPT_LENGTH ? 'error' : ''}`}>
            {script.length} / {MAX_SCRIPT_LENGTH}
          </div>
        </div>
        <div className="settings-section">
            <label htmlFor="voice-select">Select a Voice</label>
            <select
                id="voice-select"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                disabled={isLoading}
                aria-label="Select voice"
            >
                {VOICE_GROUPS.map(group => (
                    <optgroup key={group.label} label={group.label}>
                        {group.voices.map(voice => (
                            <option key={voice.id} value={voice.id}>{voice.name}</option>
                        ))}
                    </optgroup>
                ))}
            </select>
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
                    <audio
                        // FIX: The ref callback for a DOM element should not return a value.
                        // Using curly braces ensures the function has a void return type.
                        ref={el => { audioRefs.current[index] = el; }}
                        controls 
                        src={audio.url} 
                        aria-label={`Playback for ${audio.name}`}
                        onEnded={() => {
                            if (currentlyPlaying === index && index < audios.length - 1) {
                                setCurrentlyPlaying(index + 1);
                            } else if (currentlyPlaying === index) {
                                setCurrentlyPlaying(null); // Playlist finished
                            }
                        }}
                    ></audio>
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
