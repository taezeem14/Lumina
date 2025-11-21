import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Wand2, Download, RotateCcw, History, 
  ChevronLeft, Eraser, Zap, Maximize, Palette, ScanFace, 
  Clock, Image as ImageIcon, Menu, X, Home, Camera 
} from 'lucide-react';
import { TOOLS, PLACEHOLDER_IMG, MAX_HISTORY } from './constants';
import { ToolId, ToolConfig, HistoryItem, SystemStats } from './types';
import * as geminiService from './services/geminiService';

import ImageUploader from './components/ImageUploader';
import ComparisonSlider from './components/ComparisonSlider';
import ProcessingOverlay from './components/ProcessingOverlay';
import StatsModal from './components/StatsModal';

// Icon Mapping
const Icons: Record<string, React.ElementType> = {
  'Eraser': Eraser,
  'Wand2': Wand2,
  'ScanFace': ScanFace,
  'Maximize': Maximize,
  'Palette': Palette,
  'Zap': Zap,
  'Clock': Clock,
  'ImageIcon': ImageIcon,
};

export default function App() {
  // -- State --
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [view, setView] = useState<'hero' | 'editor'>('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  
  const [activeToolId, setActiveToolId] = useState<ToolId>(ToolId.NONE);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);

  // -- System Stats State --
  const [stats, setStats] = useState<SystemStats>({
    gpuLoad: 0,
    memoryUsage: 2.1,
    requests: 0,
    latency: 0
  });

  // -- Effects --
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Simulate background stats updates
  useEffect(() => {
    const interval = setInterval(() => {
        setStats(prev => ({
            ...prev,
            gpuLoad: isProcessing ? Math.min(98, prev.gpuLoad + 5) : Math.max(10, prev.gpuLoad - 5),
            memoryUsage: isProcessing ? 4.5 : 2.1
        }));
    }, 2000);
    return () => clearInterval(interval);
  }, [isProcessing]);

  // -- Handlers --

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleImageUpload = (base64: string) => {
    setOriginalImage(base64);
    setCurrentImage(base64);
    setHistory([{ id: Date.now().toString(), imageData: base64, action: 'Original', timestamp: Date.now() }]);
    setView('editor');
  };

  const addToHistory = (newImage: string, action: string) => {
    setHistory(prev => {
      const newHistory = [...prev, { id: Date.now().toString(), imageData: newImage, action, timestamp: Date.now() }];
      if (newHistory.length > MAX_HISTORY) return newHistory.slice(newHistory.length - MAX_HISTORY);
      return newHistory;
    });
    setCurrentImage(newImage);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop(); // Remove current
    setHistory(newHistory);
    setCurrentImage(newHistory[newHistory.length - 1].imageData);
  };

  const handleToolClick = (tool: ToolConfig) => {
    setActiveToolId(tool.id);
    if (tool.requiresInput) {
      setShowPromptInput(true);
      setCustomPrompt('');
    } else {
      executeTool(tool);
    }
  };

  const executeTool = async (tool: ToolConfig, userInput?: string) => {
    if (!currentImage) return;
    
    setIsProcessing(true);
    setProcessingMessage(`Applying ${tool.label}...`);
    setShowPromptInput(false);

    const startTime = Date.now();

    try {
      let prompt = tool.promptTemplate;
      if (userInput) {
        prompt = prompt.replace('[USER_INPUT]', userInput);
      }

      const resultImage = await geminiService.generateEditedImage(currentImage, prompt);
      
      const endTime = Date.now();
      const latency = endTime - startTime;

      setStats(prev => ({
          ...prev,
          requests: prev.requests + 1,
          latency: latency
      }));

      addToHistory(resultImage, tool.label);
      setActiveToolId(ToolId.NONE); // Reset selection
    } catch (error) {
      console.error(error);
      alert("Failed to process image. Please check your API Key configuration or try a different image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `lumina-edit-${Date.now()}.png`;
    link.click();
  };

  // -- Render Sections --

  const renderHero = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] animate-pulse-slow pointer-events-none delay-1000"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-primary-500 mb-4">
                <Wand2 size={14} className="mr-2" />
                <span>Generative AI 2.5 Powered</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Edit Smarter. <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-600">
                    Create Faster.
                </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Transform your photos instantly with Lumina. Remove objects, enhance details, and explore creative styles with the power of Gemini.
            </p>

            <div className="mt-10 w-full max-w-xl mx-auto transform hover:scale-105 transition-transform duration-300">
                <ImageUploader onImageSelect={handleImageUpload} />
            </div>

            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto opacity-70">
                <div className="flex flex-col items-center gap-2">
                    <Zap className="text-yellow-500" />
                    <span className="text-sm font-medium dark:text-white">Instant Edits</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <ScanFace className="text-primary-500" />
                    <span className="text-sm font-medium dark:text-white">Face Enhance</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Maximize className="text-purple-500" />
                    <span className="text-sm font-medium dark:text-white">4K Upscale</span>
                </div>
            </div>
        </div>
    </div>
  );

  const renderEditor = () => (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] bg-gray-100 dark:bg-dark-950 overflow-hidden relative">
        {/* Tools Sidebar (Left) */}
        <div className="w-full lg:w-80 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-20 overflow-y-auto">
             <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                 <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                     <Wand2 size={20} className="text-primary-500" />
                     AI Tools
                 </h2>
                 <button onClick={() => setView('hero')} className="lg:hidden p-2 text-gray-500">
                     <X size={20} />
                 </button>
             </div>
             
             <div className="p-4 space-y-3 flex-1">
                 {TOOLS.map((tool) => {
                     const Icon = Icons[tool.icon] || Wand2;
                     return (
                         <button
                            key={tool.id}
                            onClick={() => handleToolClick(tool)}
                            disabled={isProcessing}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 border ${
                                activeToolId === tool.id 
                                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400' 
                                : 'bg-white dark:bg-dark-800 border-transparent hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300'
                            }`}
                         >
                             <div className={`p-2 rounded-lg ${activeToolId === tool.id ? 'bg-primary-200 dark:bg-primary-800/50' : 'bg-gray-100 dark:bg-dark-700'}`}>
                                 <Icon size={20} />
                             </div>
                             <div className="text-left">
                                 <div className="font-medium text-sm">{tool.label}</div>
                                 <div className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{tool.description}</div>
                             </div>
                         </button>
                     )
                 })}
             </div>
        </div>

        {/* Canvas Area (Center) */}
        <div className="flex-1 bg-gray-100 dark:bg-[#0b0f17] relative flex flex-col p-4 lg:p-8 overflow-hidden">
            {/* Toolbar (Top) */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2 bg-white dark:bg-dark-800 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                 <button onClick={handleUndo} disabled={history.length <= 1} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full disabled:opacity-30 transition text-gray-700 dark:text-white" title="Undo">
                     <RotateCcw size={20} />
                 </button>
                 <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                 <button onClick={handleDownload} className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition shadow-md flex items-center gap-2 px-4">
                     <Download size={18} />
                     <span className="text-sm font-medium hidden sm:block">Download</span>
                 </button>
            </div>

            {/* Main Image Container */}
            <div className="flex-1 relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-gray-50 dark:bg-dark-900">
                {currentImage && originalImage ? (
                    <ComparisonSlider original={originalImage} modified={currentImage} />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Loaded</div>
                )}
                <ProcessingOverlay isProcessing={isProcessing} message={processingMessage} />
            </div>
        </div>
        
        {/* Prompt Input Modal (Absolute positioned) */}
        {showPromptInput && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-4 dark:text-white">Custom Instruction</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        {TOOLS.find(t => t.id === activeToolId)?.label === 'Magic Eraser' 
                            ? "What would you like to remove?" 
                            : "Describe the changes you want to make."}
                    </p>
                    <input 
                        type="text" 
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="e.g., red car, sunglasses, tree"
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-dark-800 border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-dark-950 transition-all outline-none dark:text-white mb-6"
                    />
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setShowPromptInput(false)}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => {
                                const tool = TOOLS.find(t => t.id === activeToolId);
                                if (tool) executeTool(tool, customPrompt);
                            }}
                            disabled={!customPrompt.trim()}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300 font-sans selection:bg-primary-500/30">
      {/* Navigation */}
      <nav className="h-20 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 lg:px-12 bg-white/80 dark:bg-dark-950/80 backdrop-blur-lg sticky top-0 z-40">
         <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('hero')}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
               <Camera className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Lumina
            </span>
         </div>

         <div className="hidden md:flex items-center gap-8">
             <button onClick={() => setView('hero')} className={`text-sm font-medium transition-colors ${view === 'hero' ? 'text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>Home</button>
             <button onClick={() => currentImage && setView('editor')} className={`text-sm font-medium transition-colors ${view === 'editor' ? 'text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'} ${!currentImage && 'opacity-50 cursor-not-allowed'}`}>Editor</button>
             <button onClick={() => setShowStats(true)} className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Stats</button>
         </div>

         <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="md:hidden p-2 text-gray-600 dark:text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
         </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-white dark:bg-dark-950 pt-24 px-6 space-y-6">
              <button onClick={() => { setView('hero'); setIsMenuOpen(false); }} className="block w-full text-left text-lg font-medium dark:text-white">Home</button>
              <button onClick={() => { if(currentImage) { setView('editor'); setIsMenuOpen(false); }}} className={`block w-full text-left text-lg font-medium dark:text-white ${!currentImage && 'opacity-50'}`}>Editor</button>
              <button onClick={() => { setShowStats(true); setIsMenuOpen(false); }} className="block w-full text-left text-lg font-medium dark:text-white">Stats</button>
          </div>
      )}

      <main>
        {view === 'hero' ? renderHero() : renderEditor()}
      </main>

      {view === 'hero' && (
        <footer className="py-12 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-dark-900">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Lumina AI Studio. All rights reserved.
                </div>
                <div className="flex gap-6">
                    <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">Twitter</a>
                    <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">GitHub</a>
                    <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">Discord</a>
                </div>
            </div>
        </footer>
      )}

      <StatsModal 
        isOpen={showStats} 
        onClose={() => setShowStats(false)} 
        stats={stats}
      />

    </div>
  );
}