import React, { useState, useEffect } from 'react';
import { ChatMessage, Player } from '../types/party';
import { sound, triggerHaptic } from '../utils/audio';
import { MessageCircle, Send, X, Heart, Sparkles } from 'lucide-react';

interface ChatReactionsProps {
  currentPlayer: Player;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSendReaction: (emoji: string) => void;
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

export const ChatReactionsDrawer: React.FC<ChatReactionsProps> = ({
  currentPlayer,
  messages,
  onSendMessage,
  onSendReaction,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  const QUICK_EMOJIS = ['🥳', '💃', '👏', '💖', '😂', '👑'];

  const triggerFloatingEmoji = (emoji: string) => {
    sound.playPop();
    triggerHaptic('light');
    onSendReaction(emoji);

    const newId = Date.now() + Math.random();
    const xPos = 20 + Math.random() * 60; // 20% to 80% screen width
    setFloatingEmojis((prev) => [...prev, { id: newId, emoji, x: xPos }]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== newId));
    }, 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sound.playClick();
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <>
      {/* Floating Emojis Animation Canvas */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            style={{
              left: `${item.x}%`,
              bottom: '90px',
              animation: 'floatUp 2s ease-out forwards',
            }}
            className="absolute text-4xl select-none"
          >
            {item.emoji}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translateY(-120px) scale(1.3) rotate(${Math.random() > 0.5 ? '15deg' : '-15deg'});
          }
          100% {
            opacity: 0;
            transform: translateY(-250px) scale(1.6);
          }
        }
      `}</style>

      {/* Bottom Floating Bar */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full border border-pink-200 dark:border-pink-900/60 shadow-xl">
        <div className="hidden sm:flex items-center gap-1 px-1">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => triggerFloatingEmoji(emoji)}
              className="w-9 h-9 rounded-full hover:bg-pink-100 dark:hover:bg-slate-800 flex items-center justify-center text-lg transform hover:scale-125 transition-transform active:scale-95 cursor-pointer"
              title={`Cheer with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setIsOpen(!isOpen);
          }}
          className="relative px-3.5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Party Chat</span>
          {messages.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1 animate-ping" />
          )}
        </button>
      </div>

      {/* Chat Drawer Modal / Popover */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-2xl overflow-hidden flex flex-col h-[420px] animate-fade-in">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">💬</span>
              <div>
                <h4 className="font-bold text-xs sm:text-sm">Party Room Chat</h4>
                <p className="text-[10px] text-pink-100">Cheer and banter with friends</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick reactions row inside chat */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-pink-50/50 dark:bg-slate-800/40 border-b border-pink-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 font-semibold">Cheer:</span>
            <div className="flex gap-1">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => triggerFloatingEmoji(emoji)}
                  className="text-base hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center text-xs">
                <Sparkles className="w-8 h-8 text-pink-400 mb-2 animate-bounce" />
                <p>Send a message or cheer to get the kitty conversation rolling!</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.senderId === currentPlayer.id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                      <span>{m.senderAvatar}</span>
                      <span className="font-semibold">{m.senderName}</span>
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-2xl text-xs max-w-[85%] ${
                        isMe
                          ? 'bg-pink-600 text-white rounded-tr-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message..."
              className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="p-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
