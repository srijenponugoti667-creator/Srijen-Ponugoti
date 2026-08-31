import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Scale, ShieldAlert, BookOpen, AlertCircle, RefreshCw, Mic, MicOff, Volume2, VolumeX, Globe, FileText, CheckCircle2 } from 'lucide-react';
import { INDIAN_LANGUAGES, LanguageOption } from '../languages';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  lang?: string;
}

interface AILegalAssistantProps {
  onOpenFileCaseModal?: () => void;
  onOpenVoiceCaseFilerModal?: () => void;
  currentLanguage?: string;
  onLanguageChange?: (langCode: string) => void;
}

const quickQueriesByLang: Record<string, string[]> = {
  en: [
    'How to file an urgent injunction for property encroachment?',
    'What is the statutory limitation period for commercial debt recovery?',
    'Explain the procedure under Section 138 of Negotiable Instruments Act',
    'What documents are needed to draft an Article 226 High Court writ?'
  ],
  te: [
    'భూ ఆక్రమణపై కోర్టులో ఇంజంక్షన్ ఆర్డర్ ఎలా పొందాలి?',
    'చెక్కు బౌన్స్ అయితే నోటీస్ ఇచ్చే చట్టపరమైన విధానం ఏమిటి?',
    'పోలీసులు ఎఫ్ఐఆర్ నమోదు చేయకపోతే కోర్టు ద్వారా ఎలా ఫిర్యాదు చేయాలి?',
    'వ్యవసాయ భూమి సరిహద్దు వివాదాలకు సంబంధించి ఏ చట్టాలు వర్తిస్తాయి?'
  ],
  hi: [
    'जमीन पर अवैध कब्जे के खिलाफ स्टे आर्डर कैसे प्राप्त करें?',
    'चेक बाउंस होने पर धारा 138 एनआई एक्ट की कानूनी प्रक्रिया क्या है?',
    'पुलिस एफआईआर दर्ज न करे तो कोर्ट में 156(3) कैसे लगाएं?',
    'उपभोक्ता फोरम में मुआवजा पाने की प्रक्रिया क्या है?'
  ],
  ta: [
    'நில ஆக்கிரமிப்புக்கு எதிராக தடை ஆணை பெறுவது எப்படி?',
    'காசோலை பவுன்ஸ் ஆன வழக்கில் சட்ட நடைமுறை என்ன?'
  ]
};

export const AILegalAssistant: React.FC<AILegalAssistantProps> = ({
  onOpenFileCaseModal,
  onOpenVoiceCaseFilerModal,
  currentLanguage = 'en',
  onLanguageChange,
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(() => {
    return INDIAN_LANGUAGES.find(l => l.code === currentLanguage) || INDIAN_LANGUAGES[0];
  });

  useEffect(() => {
    if (currentLanguage) {
      const found = INDIAN_LANGUAGES.find(l => l.code === currentLanguage);
      if (found && found.code !== selectedLang.code) {
        setSelectedLang(found);
      }
    }
  }, [currentLanguage]);

  const handleSelectLanguage = (l: LanguageOption) => {
    setSelectedLang(l);
    if (onLanguageChange) {
      onLanguageChange(l.code);
    }
  };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      text: `Namaste! I am your **JusticeBridge AI Judicial Assistant**, trained on Indian Constitutional, Civil & Criminal Jurisprudence (BNS, BNSS, CPC, Commercial Courts Act, NI Act).

మీరు ఏ భారతీయ భాషలోనైనా మాట్లాడవచ్చు / आप अपनी मातृभाषा में कानूनी सलाह प्राप्त कर सकते हैं।
Select your preferred language above or press the **Mic** button to speak your grievance.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'JusticeBridge Judicial Intelligence'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = selectedLang.speechLocale;

      rec.onresult = (e: any) => {
        let text = '';
        for (let i = 0; i < e.results.length; i++) {
          text += e.results[i][0].transcript;
        }
        setInputMessage(text);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      rec.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [selectedLang]);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.lang = selectedLang.speechLocale;
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.warn('Mic start error:', e);
      }
    }
  };

  // Text-to-Speech audio playback for illiterate or vernacular citizens
  const toggleSpeak = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLang.speechLocale;
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lang: selectedLang.code
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/legal-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg.text,
          language: selectedLang.code,
          langName: selectedLang.name
        })
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is the procedural legal analysis for your inquiry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.model || 'Gemini 2.5 Flash Judicial Engine',
        lang: selectedLang.code
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Legal AI query error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: `### Standard Legal Strategy (${selectedLang.name}):
1. **Governing Statute**: Indian legal matters require strict compliance with prescribed procedural timelines (BNS, CPC 1908, or BNSS).
2. **Immediate Step**: Serve a formal statutory Legal Demand Notice giving 15–30 days cure period before approaching the court.
3. **Bar Council Verified Counsel**: Consult an authenticated Advocate via the **Advocate Directory** to file an urgent petition.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'JusticeBridge Statutory Knowledgebase',
        lang: selectedLang.code
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const activeQueries = quickQueriesByLang[selectedLang.code] || quickQueriesByLang['en'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner & Language Ribbon */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-800/60 text-red-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>AI Legal & Judicial Intelligence &bull; 24 Indian Languages</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-cinzel">
            JusticeBridge AI Judicial Counsel
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Voice-enabled statutory advisor, delay risk evaluator, and case formulation engine.
          </p>
        </div>

        {/* Quick Action: Voice Case Filing for Illiterate Citizens */}
        {onOpenVoiceCaseFilerModal && (
          <button
            onClick={onOpenVoiceCaseFilerModal}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-700 via-red-800 to-amber-700 hover:from-red-600 text-white font-bold text-xs shadow-xl border border-red-500/50 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Mic className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Voice Case Filing (మాట్లాడి కేసు నమోదు / बोलकर केस दर्ज करें)</span>
          </button>
        )}
      </div>

      {/* Language Ribbon */}
      <div className="mb-4 p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center space-x-2 text-xs text-slate-400 flex-shrink-0">
          <Globe className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-200">AI Response Language:</span>
        </div>
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {INDIAN_LANGUAGES.slice(0, 10).map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelectLanguage(l)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedLang.code === l.code
                  ? 'bg-red-900 text-white border border-red-700 shadow-md font-bold'
                  : 'bg-zinc-950/80 hover:bg-zinc-800 text-slate-400 border border-zinc-800'
              }`}
            >
              {l.nativeName} ({l.name})
            </button>
          ))}
          <select
            value={selectedLang.code}
            onChange={(e) => {
              const found = INDIAN_LANGUAGES.find(item => item.code === e.target.value);
              if (found) handleSelectLanguage(found);
            }}
            className="px-2.5 py-1 rounded-xl bg-zinc-950 text-slate-300 border border-zinc-800 text-xs outline-none focus:border-red-600 cursor-pointer"
          >
            <option value="" disabled>More Languages...</option>
            {INDIAN_LANGUAGES.slice(10).map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName} - {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col h-[620px] overflow-hidden">
        
        {/* Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-zinc-700 text-white border border-zinc-600'
                      : 'bg-gradient-to-br from-red-800 to-red-950 text-red-200 border border-red-700 shadow-md'
                  }`}
                >
                  {isUser ? 'ME' : <Scale className="w-5 h-5" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-2xl rounded-3xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-red-950/50 border border-red-800/80 text-white'
                      : 'bg-zinc-950/90 border border-zinc-800 text-slate-200 shadow-lg'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                  <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{msg.timestamp}</span>
                    <div className="flex items-center space-x-2">
                      {msg.source && (
                        <span className="font-semibold text-slate-400">{msg.source}</span>
                      )}
                      {/* Audio Read-Aloud Button */}
                      {!isUser && (
                        <button
                          onClick={() => toggleSpeak(msg.text, msg.id)}
                          className="px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-zinc-800 flex items-center space-x-1 transition-colors"
                          title="Listen in chosen Indian language"
                        >
                          {speakingMessageId === msg.id ? (
                            <>
                              <VolumeX className="w-3 h-3 text-red-400" />
                              <span className="text-[10px]">Stop Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span className="text-[10px]">Listen (వినండి / सुनिए)</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-red-900/80 text-red-200 border border-red-700 flex items-center justify-center">
                <Scale className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                <span>Formulating legal analysis in {selectedLang.name} with Gemini 2.5 Flash...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Query Suggestions */}
        <div className="px-6 py-2.5 bg-zinc-950/70 border-t border-zinc-800/80 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-500 uppercase flex-shrink-0">
            Suggested ({selectedLang.nativeName}):
          </span>
          {activeQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3 py-1 rounded-full bg-zinc-800/80 hover:bg-red-950/60 hover:text-red-300 hover:border-red-800 text-slate-300 border border-zinc-700 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar with Speech Recognition Mic */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center space-x-3">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex-shrink-0 ${
              isRecording
                ? 'bg-red-600 border-white text-white animate-pulse shadow-lg shadow-red-600/50'
                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-slate-300 hover:text-white'
            }`}
            title={`Speak in ${selectedLang.name} (${selectedLang.nativeName})`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? `Listening in ${selectedLang.nativeName}... Speak now...` : `Type or speak in ${selectedLang.name} (${selectedLang.nativeName})...`}
            className="flex-1 px-4 py-3 text-xs rounded-2xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputMessage.trim()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
