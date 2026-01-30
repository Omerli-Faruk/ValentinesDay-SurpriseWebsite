import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { Letter } from './Letter';

interface EnvelopeProps {
    scrollYProgress: MotionValue<number>;
}

// Custom SVG Peony Component
const PeonySeal = () => (
    <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-md filter saturate-110">
        <defs>
            <radialGradient id="petalGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#fff0f5" />
                <stop offset="100%" stopColor="#fbcfe8" />
            </radialGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15"/>
            </filter>
        </defs>

        {/* Leaves (Bottom Layer) */}
        <g transform="translate(50, 50) scale(1.4)">
            <path d="M-20,10 Q-30,20 -25,30 Q-10,25 0,15 Z" fill="#86efac" stroke="#4ade80" strokeWidth="0.5" />
            <path d="M20,10 Q30,20 25,30 Q10,25 0,15 Z" fill="#86efac" stroke="#4ade80" strokeWidth="0.5" />
            <path d="M0,20 Q-5,35 0,40 Q5,35 0,20 Z" fill="#4ade80" />
        </g>

        {/* Outer Petals (Wide & Ruffled) - Rotated slightly for organic feel */}
        <g transform="translate(50,50)" filter="url(#shadow)">
            {/* Bottom Petals */}
            <path d="M-15,10 C-30,20 -30,35 0,40 C30,35 30,20 15,10 C5,15 -5,15 -15,10" fill="#f9a8d4" opacity="0.9" />
            <path d="M-25,-10 C-35,0 -35,20 -20,25 C-10,20 -10,10 -25,-10" fill="#fbcfe8" />
            <path d="M25,-10 C35,0 35,20 20,25 C10,20 10,10 25,-10" fill="#fbcfe8" />
            <path d="M-10,-25 C-20,-35 0,-40 10,-25 C5,-15 -5,-15 -10,-25" fill="#fbcfe8" />

            {/* Middle Layer Petals (Creamier) */}
            <circle cx="0" cy="0" r="22" fill="url(#petalGradient)" opacity="0.9" />
            <path d="M-15,-5 Q-20,-15 0,-20 Q20,-15 15,-5 Q10,5 -15,-5" fill="#fce7f3" />
            <path d="M-10,10 Q-20,20 0,25 Q20,20 10,10 Q0,5 -10,10" fill="#fce7f3" />
            <path d="M-18,0 Q-25,0 -20,15 Q-5,10 -18,0" fill="#fce7f3" />
            <path d="M18,0 Q25,0 20,15 Q5,10 18,0" fill="#fce7f3" />

            {/* Inner Bloom (Tight curls) */}
            <path d="M-8,-8 C-12,-12 -5,-15 0,-10 C5,-15 12,-12 8,-8 C5,-2 -5,-2 -8,-8" fill="#fdf2f8" stroke="#fbcfe8" strokeWidth="0.5"/>
            <path d="M-5,5 C-10,10 0,12 5,5 C2,0 -2,0 -5,5" fill="#fdf2f8" stroke="#fbcfe8" strokeWidth="0.5" />

            {/* Center Stamens (Detail) */}
            <circle cx="-2" cy="-1" r="1.5" fill="#fcd34d" />
            <circle cx="2" cy="-1" r="1.5" fill="#fcd34d" />
            <circle cx="0" cy="2" r="1.5" fill="#fcd34d" />
        </g>
    </svg>
);

export const Envelope: React.FC<EnvelopeProps> = ({ scrollYProgress }) => {
    // --- Animation Orchestration ---

    // 1. The Pop (Flap starts slightly open at 5deg to show "overstuffed" bulge, then flips)
    const flapRotation = useTransform(scrollYProgress, [0, 0.1, 0.15], [5, 180, 180]);
    const flapZIndex = useTransform(scrollYProgress, (v) => (v > 0.05 ? 0 : 40));

    // 2. The Burst (Envelope squashes slightly then stretches as it releases)
    const envelopeScale = useTransform(scrollYProgress, [0, 0.05, 0.15], [1, 0.98, 1]);

    // 3. The Slide (Letter moves UP out of the envelope)
    const letterY = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]);

    // 4. Envelope moves down slightly to stay centered visually as letter expands
    const envelopeY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    // --- Texture & Styles ---
    // SVG Noise Filter for realistic paper texture
    const paperTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

    // Cotton paper color base
    const paperColor = "#fce7f3"; // Soft Blush

    return (
        <motion.div
            style={{ y: envelopeY, scale: envelopeScale }}
            className="relative w-[340px] sm:w-[500px] h-[240px] sm:h-[320px] z-10 perspective-1000 group"
        >
            {/* 1. Envelope Back (Interior) */}
            <div
                className="absolute inset-0 bg-[#eebecb] rounded-b-xl shadow-2xl border-2 border-pink-300"
                style={{ backgroundImage: paperTexture }}
            />

            {/* 2. The Letter (Masked & Animated) */}
            {/*
         - anchored to bottom, height 200% to extend upwards.
         - 'overflow-hidden' on this wrapper ensures the letter doesn't poke out the bottom.
      */}
            <div className="absolute -top-[600px] bottom-0 left-0 right-0 z-10 overflow-hidden rounded-b-xl pointer-events-none">
                <motion.div
                    style={{ y: letterY }}
                    // Top position: Calculated to sit deep in the pocket but high enough to peek out.
                    // 80px offset places the top of the letter visible under the 5-degree open flap.
                    className="absolute left-3 right-3 sm:left-5 sm:right-5 top-[calc(600px+80px)] flex justify-center origin-top pointer-events-auto"
                >
                    <Letter />
                </motion.div>
            </div>

            {/* 3. Front Pocket (The folded body) */}
            <div className="absolute inset-0 z-20 pointer-events-none filter drop-shadow-md">
                {/* Left Flap */}
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        clipPath: "polygon(0 0, 0% 100%, 55% 54%)",
                        backgroundColor: paperColor,
                        backgroundImage: paperTexture,
                        backgroundBlendMode: "multiply",
                        boxShadow: "inset -2px 0 5px rgba(0,0,0,0.05)"
                    }}
                />
                {/* Right Flap */}
                <div
                    className="absolute top-0 right-0 w-full h-full"
                    style={{
                        clipPath: "polygon(100% 0, 100% 100%, 45% 54%)",
                        backgroundColor: paperColor,
                        backgroundImage: paperTexture,
                        backgroundBlendMode: "multiply",
                        boxShadow: "inset 2px 0 5px rgba(0,0,0,0.05)"
                    }}
                />
                {/* Bottom Flap */}
                <div
                    className="absolute bottom-0 left-0 w-full h-full"
                    style={{
                        clipPath: "polygon(0 100%, 100% 100%, 50% 52%)",
                        backgroundColor: "#fdf2f8", // Slightly lighter for dimension
                        backgroundImage: paperTexture,
                        borderRadius: "0 0 12px 12px",
                        boxShadow: "0px -5px 15px rgba(0,0,0,0.05)" // Inner shadow simulation
                    }}
                />
                {/* Borders for definition */}
                <div className="absolute inset-0 border-b-2 border-l-2 border-r-2 border-pink-200/50 rounded-b-xl pointer-events-none mix-blend-multiply opacity-50"></div>
            </div>

            {/* 4. Top Flap (The Opening Part) & Seal */}
            <motion.div
                style={{
                    rotateX: flapRotation,
                    zIndex: flapZIndex,
                    transformOrigin: "top",
                }}
                className="absolute top-0 left-0 right-0 h-[60%] z-30 drop-shadow-xl"
            >
                {/* Flap Triangle */}
                <div
                    className="w-full h-full"
                    style={{
                        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                        backgroundColor: "#fff0f5", // Lavender blush
                        backgroundImage: paperTexture,
                        borderTop: "1px solid rgba(255,255,255,0.8)",
                    }}
                />

                {/* The Realistic Peony Seal */}
                {/* Positioned at the tip of the triangle. */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 z-50">
                    <div className="relative group cursor-pointer transform transition-transform duration-500 hover:scale-105">
                        {/* Soft shadow for depth lift */}
                        <div className="absolute inset-0 bg-black/10 blur-md rounded-full translate-y-2 scale-90" />
                        <PeonySeal />
                    </div>
                </div>
            </motion.div>

            {/* Contact Shadow under the whole envelope */}
            <div className="absolute -bottom-8 left-4 right-4 h-6 bg-black/10 blur-xl rounded-[100%]" />

        </motion.div>
    );
};