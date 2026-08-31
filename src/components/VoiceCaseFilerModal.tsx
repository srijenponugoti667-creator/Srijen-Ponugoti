import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Scale, CheckCircle2, FileText, ArrowRight, ShieldCheck, X, AlertCircle, RefreshCw, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INDIAN_LANGUAGES, LanguageOption } from '../languages';
import { User, CaseMatter } from '../types';

interface VoiceCaseFilerModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onCaseFiled: (newCase: CaseMatter) => void;
  initialLanguage?: string;
}

interface ExtractedVoiceCase {
  title: string;
  caseType: string;
  courtName: string;
  respondent: string;
  summaryBrief: string;
  legalSections: string[];
  reliefSought: string;
  keyFacts: string[];
  spokenSummaryInNativeLang?: string;
}

const SAMPLE_VOICE_STORIES = [
  {
    title: 'Land Encroachment (భూ ఆక్రమణ / जमीन विवाद)',
    lang: 'te',
    text: 'నా పేరు రోహన్. మా గ్రామంలోని 2 ఎకరాల వ్యవసాయ భూమిని పొరుగింటి వ్యక్తి సురేష్ అక్రమంగా ఆక్రమించి కంచె వేశాడు. నేను అడిగితే నన్ను, నా కుటుంబాన్ని చంపేస్తానని బెదిరిస్తున్నాడు. నాకు తక్షణ రక్షణ మరియు భూమి తిరిగి ఇప్పించాలి.'
  },
  {
    title: 'Cheque Bounce / Loan Fraud (చెక్కు బౌన్స్ / चेक बाउंस)',
    lang: 'hi',
    text: 'मैंने व्यापारिक साझेदार रमेश कुमार को ₹5,00,000 का सामान दिया था। उसने मुझे बैंक चेक दिया जो बाउंस हो गया। अब वह फोन नहीं उठा रहा और पैसे देने से मना कर रहा है। मुझे कानूनी नोटिस और कोर्ट केस दाखिल करना है।'
  },
  {
    title: 'Unpaid Labour Wages (జీతాల బకాయిలు / मजदूरी का बकाया)',
    lang: 'te',
    text: 'నేను మరియు మరో ఐదుగురు కార్మికులు ఒక ప్రైవేట్ బిల్డర్ వద్ద 6 నెలలు పనిచేశాము. మాకు రావాల్సిన ₹1,80,000 జీతాన్ని ఇవ్వకుండా కాంట్రాక్టర్ పారిపోయాడు. మా కష్టార్జితం మాకు ఇప్పించండి.'
  },
  {
    title: 'Consumer Product Fraud (వినియోగదారుల మోసం / उपभोक्ता धोखाधड़ी)',
    lang: 'en',
    text: 'I purchased heavy industrial machinery worth 4.5 Lakhs from Apex Machinery Ltd. It stopped working within 10 days, and the vendor is refusing warranty replacement or refund.'
  }
];

export const VoiceCaseFilerModal: React.FC<VoiceCaseFilerModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onCaseFiled,
  initialLanguage = 'te'
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(
    INDIAN_LANGUAGES.find(l => l.code === initialLanguage) || INDIAN_LANGUAGES[2] // Default Telugu
  );

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [extractedResult, setExtractedResult] = useState<ExtractedVoiceCase | null>(null);
  const [filedCase, setFiledCase] = useState<CaseMatter | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang.speechLocale;

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentText.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access denied. You can also paste or type your spoken story below.');
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  // Handle language change
  const handleLanguageChange = (code: string) => {
    const found = INDIAN_LANGUAGES.find(l => l.code === code);
    if (found) {
      setSelectedLang(found);
      if (recognitionRef.current) {
        recognitionRef.current.lang = found.speechLocale;
      }
    }
  };

  const startVoiceRecording = () => {
    setErrorMessage(null);
    if (!recognitionRef.current) {
      setErrorMessage('Speech Recognition is not supported by your browser. Please type or select a sample story.');
      return;
    }

    try {
      recognitionRef.current.lang = selectedLang.speechLocale;
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start voice recognition:', err);
      // Toggle off if already active
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }
  };

  // Text-to-Speech (TTS) to read aloud in the native Indian language
  const speakAloud = (textToRead: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = selectedLang.speechLocale;
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Analyze Voice & Formulate Legal Petition
  const handleAnalyzeAndFile = async (autoSubmitCase: boolean = true) => {
    if (!transcript.trim()) {
      setErrorMessage('Please speak or enter your legal grievance details first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/voice-file-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceTranscript: transcript,
          languageCode: selectedLang.code,
          languageName: selectedLang.name,
          autoFile: autoSubmitCase
        })
      });

      const data = await res.json();

      if (data.success && data.extractedData) {
        setExtractedResult(data.extractedData);

        if (data.registeredCase) {
          setFiledCase(data.registeredCase);
          onCaseFiled(data.registeredCase);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });

          // Read aloud confirmation in citizen's mother tongue
          if (data.extractedData.spokenSummaryInNativeLang) {
            speakAloud(data.extractedData.spokenSummaryInNativeLang);
          }
        }
      } else {
        setErrorMessage('Could not process speech. Please try speaking again.');
      }
    } catch (err) {
      console.error('Voice file case error:', err);
      setErrorMessage('Failed to connect to JusticeBridge AI Voice Server.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_VOICE_STORIES[0]) => {
    setTranscript(sample.text);
    handleLanguageChange(sample.lang);
  };

  const handleReset = () => {
    setTranscript('');
    setExtractedResult(null);
    setFiledCase(null);
    setErrorMessage(null);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 text-slate-200">
        
        {/* Close Button */}
        <button
          onClick={() => {
            if (isSpeaking) window.speechSynthesis.cancel();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 via-red-800 to-zinc-950 border border-red-500/50 flex items-center justify-center text-red-200 shadow-lg shadow-red-950/50">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                Voice Justice Access &bull; పౌర న్యాయ సహాయం
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-cinzel tracking-tight">
              Voice Case Filing Assistant
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          Designed so **every citizen (even if illiterate or unable to read/write)** can file a real court case simply by **talking in their mother tongue**. The AI automatically listens, categorizes laws, prepares a formal petition, and registers the CNR docket.
        </p>

        {/* Language Selector Ribbon */}
        <div className="mb-6 p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Choose Your Spoken Language (మీ భాషను ఎంచుకోండి):</span>
            </label>
            <span className="text-[10px] text-amber-400 font-medium">
              24 Indian Languages Supported
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1.5 max-h-32 overflow-y-auto p-1 scrollbar-thin">
            {INDIAN_LANGUAGES.map((lang) => {
              const isSelected = selectedLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold text-left transition-all truncate flex flex-col ${
                    isSelected
                      ? 'bg-red-950 border border-red-700 text-white shadow-md'
                      : 'bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800/80 text-slate-300'
                  }`}
                >
                  <span className="truncate">{lang.nativeName}</span>
                  <span className="text-[9px] text-slate-400 font-normal">{lang.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Successful Case Filing Banner */}
        {filedCase ? (
          <div className="p-6 rounded-3xl bg-zinc-900 border border-emerald-600/80 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200 text-[10px] font-bold uppercase">
                    Petition Registered Successfully
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {filedCase.title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  CNR Tracking ID: <span className="font-mono font-bold text-amber-400">{filedCase.cnrNumber}</span> &bull; Court: <span className="text-white">{filedCase.courtName}</span>
                </p>
              </div>
            </div>

            {/* Extracted Details Pill Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-semibold text-red-300">{filedCase.caseType}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Opposing Party</span>
                <span className="font-semibold text-white">{filedCase.respondent}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Legal Relief Prayed</span>
                <span className="text-slate-200">{extractedResult?.reliefSought || filedCase.summaryBrief}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Applicable Sections</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {extractedResult?.legalSections?.map((sec, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700 text-amber-300 text-[11px] font-medium">
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Spoken summary player */}
            {extractedResult?.spokenSummaryInNativeLang && (
              <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Volume2 className="w-5 h-5 text-red-400 animate-pulse flex-shrink-0" />
                  <p className="text-xs text-red-200 leading-snug">
                    "{extractedResult.spokenSummaryInNativeLang}"
                  </p>
                </div>
                <button
                  onClick={() => speakAloud(extractedResult.spokenSummaryInNativeLang!)}
                  className="px-3 py-1.5 rounded-xl bg-red-900 hover:bg-red-800 text-white text-xs font-bold transition-colors cursor-pointer flex-shrink-0"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2"
              >
                <span>View in My Cases Vault</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-300 text-xs font-semibold"
              >
                File Another Case
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Live Recording / Mic Action Zone */}
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
              
              {/* Pulsing Mic Button */}
              <div className="relative mb-4">
                {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-60"></div>
                )}
                <button
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 cursor-pointer ${
                    isRecording
                      ? 'bg-red-600 text-white border-4 border-white shadow-red-600/60'
                      : 'bg-gradient-to-br from-red-700 via-red-800 to-zinc-900 text-white border-2 border-red-500/60 hover:scale-105'
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8 animate-bounce" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>

              <h4 className="text-base font-bold text-white">
                {isRecording ? (
                  <span className="text-red-400 animate-pulse">
                    Listening in {selectedLang.name} ({selectedLang.nativeName})... Speak your story now!
                  </span>
                ) : (
                  <span>
                    Tap the Microphone & Speak in {selectedLang.nativeName}
                  </span>
                )}
              </h4>
              
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                {isRecording
                  ? 'Describe who caused the problem, what happened, dates, and what help you want.'
                  : 'Speak freely as if you are talking to a judge or legal advisor. No legal jargon required.'}
              </p>

              {/* Sample Story Shortcuts */}
              {!isRecording && !transcript && (
                <div className="mt-4 pt-4 border-t border-zinc-800/80 w-full text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Or Test with a Voice Scenario (నమూనా సమస్యలు):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SAMPLE_VOICE_STORIES.map((story, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectSample(story)}
                        className="p-2.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 text-left text-xs transition-colors group"
                      >
                        <div className="font-semibold text-slate-200 group-hover:text-red-300 truncate">
                          {story.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          "{story.text.slice(0, 45)}..."
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-amber-950/50 border border-amber-800 text-xs text-amber-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Spoken Voice Transcript Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-red-400" />
                  <span>Captured Citizen Narrative (మీ మాటల సారాంశం):</span>
                </label>
                {transcript && (
                  <button
                    onClick={() => speakAloud(transcript)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Read Aloud</span>
                  </button>
                )}
              </div>

              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={`Speak using the mic or type your legal grievance in ${selectedLang.name}...`}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs leading-relaxed outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>

            {/* Submit / File Petition Button */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => handleAnalyzeAndFile(true)}
                disabled={isAnalyzing || !transcript.trim()}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 disabled:opacity-50 text-white font-bold text-xs shadow-xl border border-red-600/50 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Analyzing Legal Provisions & Filing Case Petition with Gemini 2.5 Flash...</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4" />
                    <span>Draft & File Court Petition Automatically (కేసును నమోదు చేయండి)</span>
                  </>
                )}
              </button>

              {transcript && (
                <button
                  onClick={handleReset}
                  className="px-4 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-400 text-xs font-semibold transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Tenant and Privacy Assurance */}
            <div className="p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Encrypted E-Filing & Client Isolated Vault</span>
              </span>
              <span className="text-slate-500">Petitioner: {currentUser.name}</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
