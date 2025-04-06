// src/components/InputPage.jsx
import React, { useState, useRef, useEffect } from 'react';

const emojiList = ['😀','😁','😂','😇','😍','😎','😢','😡','😴','🤯','😱','🥳'];

export default function InputPage() {
  const [text, setText] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    const entry = {
      id: Date.now(),
      text,
      mood,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      image,
      date: new Date().toISOString(),
    };
    const stored = JSON.parse(localStorage.getItem('memories') || '[]');
    localStorage.setItem('memories', JSON.stringify([entry, ...stored]));
    setText('');
    setMood('');
    setTags('');
    setImage(null);
    setShowEmojis(false);
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support voice recognition");
      return;
    }

    if (!recording) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => prev + ' ' + transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setRecording(true);
    } else {
      recognitionRef.current?.stop();
      setRecording(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Write a Memory</h2>

      <div className="flex gap-2 mb-2">
        <button
          className={`px-3 py-1 rounded text-white ${recording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          onClick={toggleVoiceInput}
        >
          {recording ? '🛑 Stop' : '🎤 Speak'}
        </button>
        <button
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          onClick={handleSubmit}
        >
          💾 Save
        </button>
      </div>

      <textarea
        className="w-full border p-2 rounded mb-3"
        rows="4"
        placeholder="Type or dictate your thoughts..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="relative mb-3">
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="Mood (e.g. 😊)"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <button
          className="absolute top-2 right-2 text-xl"
          onClick={() => setShowEmojis(!showEmojis)}
        >
          😀
        </button>
        {showEmojis && (
          <div className="absolute z-10 bg-white border rounded p-2 shadow mt-2 grid grid-cols-6 gap-1">
            {emojiList.map((emoji) => (
              <button
                key={emoji}
                className="text-xl hover:scale-125 transition-transform"
                onClick={() => {
                  setMood(emoji);
                  setShowEmojis(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <input
        type="text"
        className="w-full border p-2 rounded mb-3"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        className="mb-3"
        onChange={handleImageUpload}
      />

      {image && (
        <img
          src={image}
          alt="preview"
          className="w-full h-32 object-cover rounded mb-3"
        />
      )}
    </div>
  );
}
