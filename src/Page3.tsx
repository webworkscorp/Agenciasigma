import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Target, Crosshair, Map, Activity, Fingerprint, Lock, CheckCircle } from 'lucide-react';

export default function Page3({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const [time, setTime] = useState('02.45.12');
  const [authStatus, setAuthStatus] = useState<'idle' | 'authenticating' | 'granted' | 'blackout'>('idle');
  const [hash, setHash] = useState('');

  const handleLogin = () => {
    if (authStatus !== 'idle') return;
    setAuthStatus('authenticating');
    
    let i = 0;
    const interval = setInterval(() => {
      const chars = '0123456789ABCDEF!@#$%^&*';
      let r = '';
      for(let k=0; k<24; k++) r += chars[Math.floor(Math.random()*chars.length)];
      setHash(r);
      i++;
      if (i > 40) {
        clearInterval(interval);
        setAuthStatus('granted');
        setTimeout(() => {
          setAuthStatus('blackout');
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess();
          }, 800);
        }, 1500);
      }
    }, 40);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const hh = String(date.getHours()).padStart(2, '0');
      const mm = String(date.getMinutes()).padStart(2, '0');
      const ss = String(date.getSeconds()).padStart(2, '0');
      setTime(`${hh}.${mm}.${ss}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#050505] text-gray-300 font-mono overflow-hidden uppercase flex items-center justify-center select-none selection:bg-red-900 selection:text-white">
      
      {/* Blackout overlay for transition */}
      <AnimatePresence>
        {authStatus === 'blackout' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 z-[100] bg-black"
          />
        )}
      </AnimatePresence>

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
        <Map size={1400} strokeWidth={0.5} className="text-white" />
      </div>
      
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}
      />
      
      <div className="absolute inset-0 z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />
      
      {/* Minimal scanlines */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-20" />
      
      {/* Heavy vignette for cinematic dark atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-radial-gradient from-transparent via-[#050505]/95 to-[#000000] opacity-100" />

      {/* Top Left Metadata */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1 text-[10px] tracking-[0.2em] text-gray-500">
        <div className="flex items-center gap-2">
          <span>TERMINAL SECURE</span>
          <div className="w-1.5 h-1.5 bg-red-600 rounded-none animate-pulse" />
        </div>
        <div className="text-gray-400">{time}</div>
      </div>

      {/* Top Right Metadata */}
      <div className="absolute top-6 right-6 z-10 flex flex-col items-end gap-1 text-[10px] tracking-[0.2em] text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-600 rounded-none animate-pulse" />
          <span>NODO: CR-SEMA-04</span>
        </div>
        <div className="text-gray-400">ESTADO: EN LÍNEA</div>
      </div>

      {/* Lower Left Corner */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-1 text-[8px] tracking-[0.2em] text-gray-600">
        <div>SYS.ID: 994-A-X</div>
        <div>LAT: 47.9023 N // LON: 12.0934 E</div>
        <div>UPLINK: ACTIVE // FREQ: 144.2 MHz</div>
      </div>

      {/* Lower Right Corner */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end gap-1 text-[8px] tracking-[0.2em] text-gray-600">
        <div>MODULE: AUTORIZACIÓN</div>
        <div>VER: 9.4.1.002</div>
      </div>

      {/* Main Login Panel */}
      <div className="z-10 w-full max-w-[340px] flex flex-col items-center">
        
        {/* Top Headers */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-6 h-6 border-[1px] border-gray-600 mb-3 flex items-center justify-center">
            <span className="text-[10px] text-gray-400">Σ</span>
          </div>
          <div className="text-center">
            <h2 className="text-gray-300 text-[11px] tracking-[0.3em] font-bold mb-1">AGENCIA SIGMA</h2>
            <h3 className="text-gray-500 text-[8px] tracking-[0.2em]">CENTRO DE INVESTIGACIÓN</h3>
            <h3 className="text-gray-500 text-[8px] tracking-[0.2em]">Y ANÁLISIS ESTRATÉGICO</h3>
          </div>
        </div>

        {/* The Terminal Box (Strict flat UI, no glass) */}
        <div className="relative w-full border-[1px] border-gray-800 bg-[#080808] p-7">
          
          <AnimatePresence>
            {(authStatus === 'authenticating' || authStatus === 'granted') && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-8 border-[1px] border-gray-700"
              >
                {authStatus === 'authenticating' ? (
                  <>
                    <Lock size={32} className="text-red-600 mb-4 animate-pulse" strokeWidth={1} />
                    <div className="text-[10px] text-red-500 mb-4 tracking-[0.3em]">AUTHENTICATING...</div>
                    <div className="text-[9px] text-gray-600 tracking-widest break-all text-justify leading-relaxed h-10 w-full">
                      {hash}
                    </div>
                  </>
                ) : (
                  <motion.div className="flex flex-col items-center">
                    <CheckCircle size={32} className="text-gray-300 mb-4" strokeWidth={1} />
                    <div className="text-[11px] text-gray-200 mb-2 tracking-[0.3em]">ACCESS GRANTED</div>
                    <div className="text-[8px] text-gray-500 tracking-widest">INITIATING SECURE HANDOFF...</div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Secure Header */}
          <div className="w-full text-center border-b-[1px] border-gray-800 pb-3 mb-6">
            <span className="text-gray-500 text-[8px] tracking-[0.3em]">
              /// TOP SECRET // UMBRA // NOFORN ///
            </span>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <Shield size={40} strokeWidth={1} className="text-gray-400" />
            </div>
            
            <h1 className="text-lg text-gray-200 tracking-[0.4em] mb-3 font-normal">
              AGENCIA SIGMA
            </h1>
            
            <div className="flex flex-col items-center text-red-500 text-[8px] tracking-[0.2em] bg-[#1a0505] border-[1px] border-red-900/50 px-4 py-2">
              <span className="mb-1 text-red-600 font-bold">[ ACCESO RESTRINGIDO ]</span>
              <span className="text-red-500/80">SOLO PERSONAL AUTORIZADO</span>
            </div>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-4 w-full mb-8">
            <div className="flex flex-col gap-1">
              <label className="text-[8px] tracking-widest text-gray-500">IDENTIFICACIÓN</label>
              <input 
                type="text" 
                className="w-full bg-[#030303] border-[1px] border-gray-800 text-gray-300 text-[10px] tracking-[0.2em] p-2.5 outline-none focus:border-gray-500 transition-colors rounded-none"
                spellCheck="false"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[8px] tracking-widest text-gray-500">CONTRASEÑA</label>
              <input 
                type="password" 
                className="w-full bg-[#030303] border-[1px] border-gray-800 text-gray-300 text-[10px] tracking-[0.2em] p-2.5 outline-none focus:border-gray-500 transition-colors rounded-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[8px] tracking-widest text-gray-500">CÓDIGO DE SEGURIDAD</label>
              <input 
                type="password" 
                className="w-full bg-[#030303] border-[1px] border-gray-800 text-gray-300 text-[10px] tracking-[0.2em] p-2.5 outline-none focus:border-gray-500 transition-colors rounded-none"
              />
            </div>
          </div>

          {/* Login Button */}
          <button 
            onClick={handleLogin}
            disabled={authStatus !== 'idle'}
            className="w-full border-[1px] border-red-900 bg-[#160404] hover:bg-[#2a0808] hover:border-red-700 transition-colors duration-0 py-3 flex items-center justify-center mb-6 rounded-none cursor-pointer"
          >
            <span className="text-red-500 text-[10px] tracking-[0.4em]">
              INICIAR SESIÓN
            </span>
          </button>

          {/* Bottom Indicators */}
          <div className="flex flex-col items-center gap-1.5 text-[7px] tracking-[0.2em] text-gray-600">
            <div>CONEXIÓN SEGURA ESTABLECIDA</div>
            <div>CIFRADO AES-256 // PROTOCOLO SIGMA SECURE</div>
          </div>

        </div>
      </div>

    </div>
  );
}
