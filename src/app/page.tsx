'use client';

import { useState } from 'react';
import { Loader2, Video, Lock, Wand2 } from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return setError('Please describe your video first.');
    if (!accessCode) return setError('Please enter the Access Code.');
    
    setLoading(true);
    setError('');
    setVideoUrl(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, accessCode }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Generation failed');
      
      setVideoUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl shadow-lg shadow-blue-900/20">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AI Video Generator
          </h1>
          <p className="text-gray-400 text-lg">Turn text into motion instantly.</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6">
          
          {/* Access Code Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Access Code
            </label>
            <input 
              type="text" 
              placeholder="Enter VIP Code (e.g. ASJVIP)"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Wand2 className="w-4 h-4" /> Your Prompt
            </label>
            <textarea 
              placeholder="A futuristic city with flying cars in a cyberpunk style, cinematic lighting..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-black/50 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-600"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Generating Magic...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Video</span>
              </>
            )}
          </button>
        </div>

        {/* Video Result */}
        {videoUrl && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              loop 
              className="w-full aspect-video object-cover"
            />
            <div className="p-4 bg-gray-900 flex justify-center">
              <a 
                href={videoUrl} 
                download 
                target="_blank"
                className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-2"
              >
                Download Video ⬇
              </a>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
