import React, { useState, useEffect, useRef } from 'react';
import BookCover from './components/BookCover';
import BookLayout from './components/BookLayout';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [ambientOn, setAmbientOn] = useState(true);
  const ambientRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (ambientRef.current) {
      ambientRef.current.volume = 0.05;
      if (ambientOn && isOpen) {
        ambientRef.current.play().catch(() => {});
      } else {
        ambientRef.current.pause();
      }
    }
  }, [ambientOn, isOpen]);

  return (
    <main className="w-full h-screen relative">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 z-50 bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>

      {isOpen && (
        <button
          onClick={() => setAmbientOn(!ambientOn)}
          className="absolute top-4 left-4 z-50 bg-green-700 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
        >
          {ambientOn ? '🔇 Mute' : '🌾 Calm Mode'}
        </button>
      )}

      <audio ref={ambientRef} loop src="/ambient.mp3" />

      <div
        className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
          darkMode
            ? 'bg-gray-900 text-white'
            : 'bg-gradient-to-br from-amber-100 to-yellow-50 text-yellow-900'
        }`}
      >
        {isOpen ? (
          <BookLayout onClose={() => setIsOpen(false)} />
        ) : (
          <BookCover onOpen={() => setIsOpen(true)} />
        )}
      </div>
    </main>
  );
}