import React from 'react';
import { motion } from 'framer-motion';
import InputPage from './InputPage';
import MemoryPage from './MemoryPage';

export default function BookLayout({ onClose }) {
  return (
    <motion.div
      className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 p-6 relative bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-repeat bg-amber-50"
      initial={{ rotateY: -90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      style={{ transformStyle: 'preserve-3d', fontFamily: '"Cormorant Garamond", serif' }}
    >
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-red-600 transition text-sm md:text-base"
        >
          ⬅️ Close Book
        </button>
      </div>

      <motion.div
        className="page-left bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <InputPage />
      </motion.div>

      <motion.div
        className="page-right bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <MemoryPage />
      </motion.div>
    </motion.div>
  );
}
