import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface ProcessingOverlayProps {
  isProcessing: boolean;
  message?: string;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ isProcessing, message = "AI is processing..." }) => {
  if (!isProcessing) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg transition-all duration-300">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full opacity-75 blur animate-pulse-slow"></div>
        
        <div className="relative bg-dark-900 p-6 rounded-2xl border border-white/10 flex flex-col items-center space-y-4 shadow-2xl">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary-400 animate-spin-slow" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-1">Enhancing Image</h3>
            <p className="text-sm text-gray-400 animate-pulse">{message}</p>
          </div>
          
          {/* Progress bar simulation */}
          <div className="w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 w-full animate-[shimmer_2s_infinite_linear]" 
                 style={{ backgroundSize: '200% 100%' }}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;