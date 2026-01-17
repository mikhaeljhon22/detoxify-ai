import React, { useState, useCallback, useEffect } from 'react';
import { analyzeTextToxicity, initializeModel } from './services/localMLService';
import { AnalysisResult, AnalysisStatus } from './types';
import AnalysisChart from './components/AnalysisChart';
import ScoreGauge from './components/ScoreGauge';
import { 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Send, 
  Info,
  Cpu,
  Database
} from 'lucide-react';
import { TRAINING_DATA } from './data/dataset';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await initializeModel();
        setModelReady(true);
      } catch (e) {
        console.error("Failed to load model", e);
      }
    };
    loadModel();
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) return;

    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeTextToxicity(inputText);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (err) {
      setError("Failed to analyze text. Please try again.");
      setStatus(AnalysisStatus.ERROR);
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Detoxify ML (Local)
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full">
               <Database className="w-3.5 h-3.5" />
               <span className="text-xs font-medium">{TRAINING_DATA.length} Samples</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${modelReady ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
               <Cpu className="w-3.5 h-3.5" />
               <span className="text-xs font-medium">{modelReady ? 'Model Ready' : 'Training...'}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <label htmlFor="input-text" className="block text-sm font-semibold text-slate-700 mb-2">
                Content to Analyze
              </label>
              <div className="relative">
                <textarea
                  id="input-text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type text to analyze..."
                  className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none transition-all text-base"
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                  {inputText.length} chars
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Press <kbd className="font-sans bg-slate-100 px-1 rounded">Cmd + Enter</kbd>
                </p>
                <button
                  onClick={handleAnalyze}
                  disabled={status === AnalysisStatus.ANALYZING || !inputText.trim() || !modelReady}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white shadow-md transition-all
                    ${status === AnalysisStatus.ANALYZING || !inputText.trim() || !modelReady
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg active:transform active:scale-95'
                    }`}
                >
                  {status === AnalysisStatus.ANALYZING ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Run Model
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {status === AnalysisStatus.ERROR && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {status === AnalysisStatus.COMPLETE && result && (
              <div className="space-y-6 animate-fade-in-up">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ScoreGauge score={result.toxicityScore} />
                  <AnalysisChart data={result} />
                </div>
                
              </div>
            )}
            
            {status === AnalysisStatus.ANALYZING && (
              <div className="space-y-6 animate-pulse">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="h-56 bg-slate-200 rounded-xl"></div>
                    <div className="h-56 bg-slate-200 rounded-xl"></div>
                 </div>
              </div>
            )}

             {status === AnalysisStatus.IDLE && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-2xl">
                 <ShieldCheck className="w-12 h-12 mb-3 opacity-20" />
                 <p>Enter text to see toxicity score</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;