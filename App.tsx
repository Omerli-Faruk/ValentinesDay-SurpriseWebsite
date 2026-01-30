import React, { useRef, useState } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { Envelope } from './components/Envelope';
import { FloatingHearts } from './components/FloatingHearts';
import { BlockPuzzleGame } from './components/BlockPuzzleGame';
import { CrashScreen } from './components/CrashScreen';

type AppPhase = 'GAME' | 'CRASHING' | 'REVEALED';

const App: React.FC = () => {
  const [appPhase, setAppPhase] = useState<AppPhase>('GAME');

  // --- HANDLERS ---

  // 1. Trigger Crash Sequence (Called from Block Puzzle after winning)
  const handleGameCompletion = () => {
    setAppPhase('CRASHING');
  };

  // 2. Trigger Romantic Reveal (Called after Crash Timer finishes)
  const handleCrashComplete = () => {
    setAppPhase('REVEALED');
  };

  return (
    <>
      <AnimatePresence mode="wait">
        
        {/* PHASE 1: GAME (Block Puzzle) */}
        {appPhase === 'GAME' && (
          <motion.div
            key="game-phase"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-900"
          >
            <BlockPuzzleGame onLinesCleared={handleGameCompletion} />
          </motion.div>
        )}

        {/* PHASE 2: CRASH (Blue Screen) */}
        {appPhase === 'CRASHING' && (
          <motion.div
            key="crash-phase"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, backgroundColor: "#000" }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-[100]"
          >
            <CrashScreen onComplete={handleCrashComplete} />
          </motion.div>
        )}

      </AnimatePresence>

      {/* PHASE 3: REVEAL (Main Content) */}
      {appPhase === 'REVEALED' && <MainContent />}
    </>
  );
};

// --- REVEAL CONTENT (Envelope & Scroll) ---
const MainContent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const promptOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const promptY = useTransform(scrollYProgress, [0, 0.05], [0, 20]);

  return (
    <motion.div 
      ref={containerRef} 
      className="relative w-full h-[800vh]"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1, 
        background: [
          "linear-gradient(to bottom, #fce7f3, #f3e8ff, #fce7f3)",
          "linear-gradient(to bottom, #e0f2fe, #fce7f3, #fae8ff)",
          "linear-gradient(to bottom, #fce7f3, #f3e8ff, #fce7f3)"
        ]
      }}
      transition={{
        opacity: { duration: 3, ease: "easeOut" },
        background: { duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
      }}
    >
      <FloatingHearts />
      
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden perspective-1000">
        <motion.div 
          style={{ opacity: promptOpacity, y: promptY }}
          className="absolute bottom-20 z-50 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-['Mali'] text-pink-400 text-lg font-bold tracking-widest uppercase">
            For You
          </span>
          <span className="font-['Mali'] text-pink-300 text-sm animate-bounce">
            Scroll to open
          </span>
        </motion.div>
        <Envelope scrollYProgress={scrollYProgress} />
      </div>
    </motion.div>
  );
};

export default App;