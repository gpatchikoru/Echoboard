import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function MemoryPage() {
  const [memories, setMemories] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('memories') || '[]');
    setMemories(stored);
  }, []);

  const handleDelete = (id) => {
    const updated = memories.filter((m) => m.id !== id);
    setMemories(updated);
    localStorage.setItem('memories', JSON.stringify(updated));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(memories);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);
    setMemories(reordered);
    localStorage.setItem('memories', JSON.stringify(reordered));
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Your Memories</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="memories">
          {(provided) => (
            <div
              className="space-y-4 min-h-[200px]"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {memories.map((memory, index) => {
                const isExpanded = expandedCard === memory.id;

                return (
                  <Draggable
                    key={memory.id}
                    draggableId={memory.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className={`border rounded p-3 bg-yellow-50 dark:bg-gray-700 shadow cursor-pointer transition-all duration-200 ${
                          isExpanded ? 'max-h-full' : 'max-h-32 overflow-hidden'
                        }`}
                        onClick={() =>
                          setExpandedCard(isExpanded ? null : memory.id)
                        }
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="flex justify-between items-center">
                          <span>{memory.mood}</span>
                          <div className="flex items-center gap-2">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                speakText(memory.text);
                              }}
                            >
                              🔊
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 font-bold"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(memory.id);
                              }}
                            >
                              &minus;
                            </button>
                          </div>
                        </div>
                        <p className="mt-2">{memory.text}</p>
                        {isExpanded && memory.tags?.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            Tags: {memory.tags.map((tag) => `#${tag}`).join(' ')}
                          </div>
                        )}
                        {isExpanded && memory.image && (
                          <img
                            src={memory.image}
                            alt="uploaded"
                            className="w-full h-32 object-cover rounded mt-2"
                          />
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(memory.date).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
