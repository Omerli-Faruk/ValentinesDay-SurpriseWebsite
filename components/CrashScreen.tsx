import React, { useEffect } from 'react';

interface CrashScreenProps {
  onComplete: () => void;
}

export const CrashScreen: React.FC<CrashScreenProps> = ({ onComplete }) => {
  
  useEffect(() => {
    // Hold the scary screen for exactly 3.5 seconds before revealing
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-black text-white font-mono p-4 sm:p-10 flex flex-col justify-start items-start select-none overflow-hidden cursor-none z-[9999]">
      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .cursor-blink {
            animation: blink 1s step-end infinite;
          }
        `}
      </style>

      <div className="space-y-2 text-sm sm:text-lg text-red-500 font-bold mb-8">
        <p>FATAL ERROR: SYSTEM INTEGRITY COMPROMISED</p>
        <p>ERROR_CODE: 0xDEADBEEF (MEMORY_OVERFLOW)</p>
      </div>

      <div className="space-y-1 text-xs sm:text-base text-gray-300 opacity-90">
        <p>Technical Information:</p>
        <p>*** STOP: 0x000000ED (0x80F128D0, 0xC000009C, 0x00000000, 0x00000000)</p>
        <p>*** ACPI.sys - Address F7713456 base at F7709000, DateStamp 43f80c6c</p>
        <br />
        <p>Beginning dump of physical memory...</p>
        <p>Dumping physical memory to disk: 100%</p>
        <p>Physical memory dump complete.</p>
        <p>Contacting system administrator...</p>
        <br />
        <p className="text-white">
           REBOOTING SYSTEM... <span className="cursor-blink">_</span>
        </p>
      </div>
      
      {/* Glitch Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover mix-blend-overlay"></div>
    </div>
  );
};