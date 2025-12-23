
import React, { useEffect, useState } from 'react';

interface AdInterstitialProps {
  onClose: () => void;
}

const AdInterstitial: React.FC<AdInterstitialProps> = ({ onClose }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full">
        <div className="bg-white/10 text-white/40 text-[10px] uppercase tracking-widest mb-8 border border-white/20 py-1 rounded">
          Advertisement
        </div>
        
        <div className="bg-slate-800 aspect-video rounded-2xl border border-slate-700 flex items-center justify-center mb-8 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-blue-500/20 animate-pulse"></div>
          <p className="text-slate-400 font-bold">AdMob Interstitial Simulation</p>
        </div>

        <h2 className="text-white text-2xl font-bold mb-2">Check out our Study Pro!</h2>
        <p className="text-slate-400 mb-10">Get access to premium notes and offline mock tests.</p>

        <button 
          onClick={onClose}
          disabled={countdown > 0}
          className={`w-full py-4 rounded-xl font-bold transition-all ${
            countdown > 0 
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
            : 'bg-white text-slate-900 hover:bg-slate-100 scale-105 shadow-xl'
          }`}
        >
          {countdown > 0 ? `Closing in ${countdown}...` : 'Close Ad & Continue'}
        </button>
      </div>
    </div>
  );
};

export default AdInterstitial;
