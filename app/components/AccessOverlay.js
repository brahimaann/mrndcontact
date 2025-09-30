"use client";
export default function AccessOverlay({ show, onClose }){
  if(!show) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="px-8 py-6 border border-green-400 rounded-xl text-center font-mono text-green-400 shadow-[0_0_30px_rgba(35,255,124,.3)]">
        <div className="text-2xl tracking-[0.3em]">ACCESS GRANTED</div>
        <div className="text-xs mt-2 opacity-80">Tap anywhere to continue</div>
      </div>
    </div>
  );
}
