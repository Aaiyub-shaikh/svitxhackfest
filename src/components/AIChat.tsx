import React, { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, Volume, Mic, Send, X } from 'lucide-react';
import { assistantApi } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

const LANGUAGES = [
  { label: 'English', code: 'en' },
  { label: 'Hindi', code: 'hi' },
  { label: 'Gujarati', code: 'gu' },
  { label: 'Tamil', code: 'ta' },
  { label: 'Telugu', code: 'te' },
  { label: 'Kannada', code: 'kn' },
  { label: 'Malayalam', code: 'ml' },
  { label: 'Marathi', code: 'mr' },
  { label: 'Bengali', code: 'bn' },
  { label: 'Punjabi', code: 'pa' },
];

type Message = {
  id: string;
  from: 'user' | 'assistant';
  text: string;
  audio_url?: string | null;
};

const AIChat: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const userType = (user?.user_metadata?.user_type || 'farmer') as 'farmer' | 'buyer';

  useEffect(() => {
    if (!open) return;
    // scroll to bottom when messages change
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Detect if translation is needed: selected language is not English and input appears in Latin characters
    const needsTranslation = language !== 'en' && /[A-Za-z]/.test(text);

    const userMsgId = Date.now().toString();
    const msg: Message = { id: userMsgId, from: 'user', text } as any;
    setMessages((s) => [...s, msg]);
    setInput('');

    setLoading(true);
    try {
      const resp = await assistantApi.chat({ message: text, language, user_role: userType, needs_translation: needsTranslation, original_text: needsTranslation ? text : undefined });
      if (resp.error) {
        setMessages((s) => [...s, { id: Date.now().toString(), from: 'assistant', text: 'Error: ' + resp.error.message }]);
      } else {
        const data = resp.data;

        // If translation happened, attach translated input to user's message (to display under user's bubble)
        if (data.translated_input) {
          setMessages((s) => s.map((m) => (m.id === userMsgId ? { ...m, translated: data.translated_input } : m)));
        }

        setMessages((s) => [...s, { id: Date.now().toString(), from: 'assistant', text: data.reply || '', audio_url: data.audio_url || null }]);
        if (data.audio_url) {
          // play audio
          if (audioRef.current) {
            audioRef.current.src = data.audio_url;
            audioRef.current.play().catch(() => {});
          }
        }
      }
    } catch (err) {
      setMessages((s) => [...s, { id: Date.now().toString(), from: 'assistant', text: 'Network error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Browser speech recognition
  const startRecognition = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((s) => [...s, { id: Date.now().toString(), from: 'assistant', text: 'Speech recognition not supported in this browser.' }]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setRecognizing(true);
    recognition.onend = () => setRecognizing(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };

    recognition.onerror = (event: any) => {
      setMessages((s) => [...s, { id: Date.now().toString(), from: 'assistant', text: 'Voice input error: ' + event.error }]);
      setRecognizing(false);
    };

    recognition.start();
  };

  if (!user) return null; // Only show to authenticated users

  return (
    <div>
      <audio ref={audioRef} />

      {/* Floating button */}
      <button
        aria-label="Toggle AI Assistant"
        title="AI Assistant"
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-transform ${open ? 'w-20 h-20 scale-105' : 'w-14 h-14 hover:scale-105'}`}
      >
        <Bot className={`${open ? 'w-8 h-8' : 'w-6 h-6'} text-emerald-600`} />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-semibold">AI Assistant</div>
                <div className="text-xs text-muted-foreground">{userType === 'farmer' ? 'Farmer assistant' : 'Buyer assistant'}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select className="text-sm p-1 border rounded" value={language} onChange={(e) => setLanguage(e.target.value)}>
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div ref={listRef} className="flex-1 p-3 space-y-3 overflow-auto bg-white/50 max-h-[60vh]">
            {messages.length === 0 && (
              <div className="text-sm text-gray-500">Ask me about crops, irrigation, weather, diseases or marketplace</div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-lg ${m.from === 'user' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-black'}`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  {/* Show translated input (if this is user message and translation occurred) */}
                  {m.from === 'user' && (m as any).translated && (
                    <div className="mt-1 text-xs text-gray-500 italic">Translated: {(m as any).translated}</div>
                  )}
                  {m.audio_url && (
                    <div className="mt-2 flex items-center space-x-2 text-sm">
                      <button onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.src = m.audio_url;
                          audioRef.current.play().catch(()=>{});
                        }
                      }} className="flex items-center space-x-1 text-emerald-600">
                        <Volume className="w-4 h-4" />
                        <span>Play</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 py-2 border-t bg-white">
            <div className="flex items-center space-x-2">
              <button onClick={() => startRecognition()} className={`p-3 rounded ${recognizing ? 'bg-red-100' : 'hover:bg-gray-100'}`} aria-label="Record">
                <Mic className={`w-5 h-5 ${recognizing ? 'text-red-500' : 'text-black'}`} />
              </button>

              <input
                className="flex-1 px-3 py-2 border rounded focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) sendMessage(input);
                }}
                placeholder="Type your message..."
                aria-label="Message input"
              />

              <button
                onClick={() => sendMessage(input)}
                disabled={loading}
                aria-label="Send message"
                className={`p-3 rounded ${loading ? 'bg-gray-200' : 'bg-emerald-600 text-white'}`}>
                {loading ? <MessageCircle className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;