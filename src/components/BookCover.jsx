import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookCover({ onOpen }) {
  const [isFlipping, setIsFlipping] = useState(false);
  const flipSound = useRef(null);

  const handleOpen = () => {
    flipSound.current?.play().catch(() => {});
    setIsFlipping(true);
    setTimeout(() => onOpen(), 1400);
  };

  useEffect(() => {
    const sparkleInterval = setInterval(() => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.animationDuration = `${3 + Math.random() * 2}s`;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 5000);
    }, 600);
    return () => clearInterval(sparkleInterval);
  }, []);

  return (
    <AnimatePresence>
      <>
        <audio ref={flipSound} src="/flip.mp3" />
        <motion.div
          key="book-cover"
          onClick={handleOpen}
          initial={{ rotateY: 0, scale: 1, opacity: 1 }}
          animate={isFlipping ? { rotateY: -120, scale: 1.05, opacity: 0 } : {}}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="w-96 h-[28rem] rounded-3xl shadow-2xl border-8 border-yellow-800 cursor-pointer flex items-center justify-center text-4xl font-bold text-white overflow-hidden"
          style={{
            backgroundImage: "url('/cover.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontFamily: 'Cormorant Garamond, serif',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
            transformStyle: 'preserve-3d',
            perspective: 1000,
            position: 'relative',
          }}
        >
          {!isFlipping && (
            <motion.div
              className="bg-black/60 px-6 py-3 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              📖 EchoBoard
            </motion.div>
          )}
        </motion.div>

        <style>{`
          .sparkle {
            position: fixed;
            top: -20px;
            width: 6px;
            height: 6px;
            background: white;
            border-radius: 50%;
            opacity: 0.8;
            animation: sparkle-fall linear forwards;
            pointer-events: none;
            z-index: 999;
            filter: blur(1px);
          }

          @keyframes sparkle-fall {
            to {
              transform: translateY(100vh);
              opacity: 0;
            }
          }
        `}</style>
      </>
    </AnimatePresence>
  );
}
