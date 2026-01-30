import React from 'react';
import { Polaroid } from './Polaroid';

interface Memory {
  note: string;
  imageSrc: string;
  caption: string;
  rotation: string;
  tapeColor: string;
  alignment: 'left' | 'right' | 'center';
}

const memories: Memory[] = [
  {
    note: "It all started with a simple hello, but I never knew it would lead to my favorite love story.",
    imageSrc: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&auto=format&fit=crop",
    caption: "The beginning",
    rotation: "rotate-2",
    tapeColor: "bg-pink-200",
    alignment: 'left'
  },
  {
    note: "Every moment with you feels like a scene from a movie I never want to end.",
    imageSrc: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=400&auto=format&fit=crop",
    caption: "Movie moments",
    rotation: "-rotate-1",
    tapeColor: "bg-yellow-200",
    alignment: 'right'
  },
  {
    note: "Your smile is literally the best part of my day. It lights up everything around you.",
    imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    caption: "That smile",
    rotation: "rotate-3",
    tapeColor: "bg-blue-200",
    alignment: 'left'
  },
  {
    note: "I love our little adventures, even if it's just getting coffee or a late-night drive.",
    imageSrc: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400&auto=format&fit=crop",
    caption: "Adventures",
    rotation: "-rotate-2",
    tapeColor: "bg-green-200",
    alignment: 'right'
  },
  {
    note: "You understand me in a way no one else ever has. You're my safe place.",
    imageSrc: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=400&auto=format&fit=crop",
    caption: "My safe place",
    rotation: "rotate-1",
    tapeColor: "bg-purple-200",
    alignment: 'left'
  },
  {
    note: "I promise to always be by your side, cheering you on and holding your hand through it all.",
    imageSrc: "https://images.unsplash.com/photo-1621112904887-419379ce6824?q=80&w=400&auto=format&fit=crop",
    caption: "Always together",
    rotation: "-rotate-3",
    tapeColor: "bg-orange-200",
    alignment: 'right'
  },
  {
    note: "Thank you for being you. You are more than I ever dreamed of.",
    imageSrc: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=400&auto=format&fit=crop",
    caption: "Dream come true",
    rotation: "rotate-2",
    tapeColor: "bg-red-200",
    alignment: 'left'
  },
  {
    note: "I love you more than words can say. Happy Valentine's Day, my love.",
    imageSrc: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=400&auto=format&fit=crop",
    caption: "Forever yours",
    rotation: "-rotate-1",
    tapeColor: "bg-pink-300",
    alignment: 'center'
  }
];

export const Letter: React.FC = () => {
  return (
    <div className="w-full bg-[#fffdf5] shadow-lg p-6 sm:p-8 text-gray-700 mx-auto flex flex-col items-center gap-8 relative overflow-hidden"
         style={{
           backgroundImage: "radial-gradient(#f0e6d2 1px, transparent 0)",
           backgroundSize: "20px 20px" // Dotted paper effect
         }}>

      {/* Decorative Border */}
      <div className="absolute top-0 left-0 w-full h-2 bg-pink-300 opacity-50 z-10" />

      {/* Header */}
      <div className="w-full flex justify-between items-center border-b-2 border-dashed border-pink-200 pb-4 mb-2 z-10">
        <span className="font-['Mali'] font-bold text-pink-400 text-sm tracking-widest">
          LOVE LETTER
        </span>
        <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-200"></div>
            <div className="w-3 h-3 rounded-full bg-green-200"></div>
            <div className="w-3 h-3 rounded-full bg-blue-200"></div>
        </div>
      </div>

      {/* Greeting */}
      <h1 className="font-['Gloria_Hallelujah'] text-3xl sm:text-4xl text-pink-500 mt-4 text-center rotate-[-2deg] z-10 drop-shadow-sm">
        To My Favorite Person
      </h1>

      {/* Memories Loop */}
      {memories.map((memory, index) => (
        <div key={index} className="w-full z-10">
          
          <div className={`flex flex-col sm:flex-row items-center gap-6 ${
              memory.alignment === 'right' ? 'sm:flex-row-reverse' : 
              memory.alignment === 'center' ? 'flex-col' : ''
          }`}>
            
            {/* Photo */}
            <div className={`transform ${memory.rotation} transition-transform hover:scale-105 duration-300 flex-shrink-0`}>
              <Polaroid
                src={memory.imageSrc}
                caption={memory.caption}
                tapeColor={memory.tapeColor}
              />
            </div>

            {/* Note Text */}
            <p className={`font-['Mali'] text-lg sm:text-xl leading-relaxed text-gray-600 max-w-md px-4 ${
                memory.alignment === 'center' ? 'text-center' : 'text-left'
            }`}>
              {memory.note}
            </p>

          </div>

          {/* Decorative Divider (except for last item) */}
          {index < memories.length - 1 && (
            <div className="w-full flex justify-center text-pink-200 text-2xl my-8 opacity-60">
              {index % 2 === 0 ? '♥' : '✦'}
            </div>
          )}
        </div>
      ))}

      {/* Floating Stickers */}
      <div className="absolute right-5 top-20 text-4xl opacity-60 rotate-12 pointer-events-none">✨</div>
      <div className="absolute left-4 top-32 text-3xl opacity-50 -rotate-12 pointer-events-none">🌹</div>
      <div className="absolute right-8 top-1/4 text-4xl opacity-40 rotate-6 pointer-events-none">🦋</div>
      <div className="absolute left-2 top-[15%] text-2xl opacity-60 -rotate-45 pointer-events-none">🎀</div>
      
      <div className="absolute right-2 top-1/3 text-3xl opacity-50 rotate-12 pointer-events-none">🌸</div>
      <div className="absolute left-6 top-[40%] text-4xl opacity-40 -rotate-6 pointer-events-none">🧸</div>
      <div className="absolute right-10 top-1/2 text-3xl opacity-60 rotate-45 pointer-events-none">💌</div>
      
      <div className="absolute left-3 top-[55%] text-2xl opacity-50 -rotate-12 pointer-events-none">🍫</div>
      <div className="absolute right-5 top-[65%] text-4xl opacity-40 rotate-12 pointer-events-none">🥂</div>
      <div className="absolute left-8 top-[70%] text-3xl opacity-60 -rotate-6 pointer-events-none">🎵</div>
      
      <div className="absolute right-3 top-[80%] text-4xl opacity-50 rotate-12 pointer-events-none">💝</div>
      <div className="absolute left-5 top-[85%] text-3xl opacity-40 -rotate-12 pointer-events-none">💘</div>
      <div className="absolute right-12 bottom-20 text-2xl opacity-60 rotate-6 pointer-events-none">💫</div>
      <div className="absolute left-4 bottom-10 text-4xl opacity-50 -rotate-6 pointer-events-none">💖</div>

      {/* Sign off */}
      <div className="mt-12 text-center relative z-10">
        <p className="font-['Gloria_Hallelujah'] text-2xl text-gray-500">Love always,</p>
        <div className="mt-4 font-['Gloria_Hallelujah'] text-4xl text-pink-600 -rotate-3 inline-block border-b-4 border-pink-200/50 transform scale-110">
          Me
        </div>
        <div className="absolute -right-8 -bottom-4 text-3xl animate-bounce">💋</div>
      </div>

      {/* Bottom padding */}
      <div className="h-16"></div>
    </div>
  );
};