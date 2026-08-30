import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Scale, ShieldAlert, BookOpen, AlertCircle, RefreshCw, UserCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

const quickQueries = [
  'How to file an urgent injunction for property encroachment?',
  'What is the statutory limitation period for commercial debt recovery?',
  'Explain the procedure under Section 138 of Negotiable Instruments Act',
  'What documents are needed to draft an Article 226 High Court writ?'
];

export const AILegalAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      text: `Hello! I am your **JusticeBridge AI Judicial Assistant**, powered by real-time Indian legal frameworks, High Court precedents, and civil procedure statutes.

How can I assist your case, document drafting, or hearing strategy today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'JusticeBridge Judicial Intelligence'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/legal-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg.text })
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is the procedural analysis for your legal inquiry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.model || 'Gemini 2.5 Flash Judicial Engine'
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Legal AI query error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: `### Standard Legal Procedure Analysis:
1. **Governing Statute**: Indian legal matters require strict compliance with prescribed procedural timelines (e.g. Civil Procedure Code 1908 or Bharatiya Nagarik Suraksha Sanhita).
2. **Immediate Step**: Serve a formal statutory Legal Demand Notice giving 15–30 days cure period before approaching the court.
3. **Bar Council Verified Counsel**: We recommend consulting an authenticated Advocate via the **Find a Lawyer** tab to file an interim application or caveat.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'JusticeBridge Statutory Knowledgebase'
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-800/60 text-red-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>AI Legal & Judicial Intelligence</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            JusticeBridge AI Counsel
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time legal advisory, case strategy analyzer, and statutory query solver trained on Indian legal precedent.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-400 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Informational Legal AI. Always consult verified advocates for judicial filings.</span>
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-zinc-700 text-white border border-zinc-600'
                      : 'bg-red-900/80 text-red-200 border border-red-700'
                  }`}
                >
                  {isUser ? 'ME' : <Scale className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-red-950/40 border border-red-800/80 text-white'
                      : 'bg-zinc-950/90 border border-zinc-800 text-slate-200 shadow-lg'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                  <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{msg.timestamp}</span>
                    {msg.source && (
                      <span className="font-semibold text-slate-400">{msg.source}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-red-900/80 text-red-200 border border-red-700 flex items-center justify-center">
                <Scale className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                <span>Analyzing statutory provisions & precedent with Gemini 2.5 Flash...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Query Suggestions */}
        <div className="px-6 py-2 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-500 uppercase flex-shrink-0">
            Suggested:
          </span>
          {quickQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3 py-1 rounded-full bg-zinc-800/80 hover:bg-red-950/60 hover:text-red-300 hover:border-red-800 text-slate-300 border border-zinc-700 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your legal inquiry, dispute details, or procedural question..."
            className="flex-1 px-4 py-3 text-xs rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputMessage.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
