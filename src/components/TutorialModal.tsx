import React, { useState } from 'react';
import { sound, triggerHaptic } from '../utils/audio';
import { X, Sparkles, Trophy, Users, Dices, ArrowRight } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      icon: '🎉',
      title: 'Welcome to Kitty Party Fun Games!',
      desc: 'The all-in-one entertainment hub designed for family & friend gatherings! Play 10 interactive party mini-games, compete on live leaderboards, and take on hilarious lighthearted dares.',
    },
    {
      icon: '📱',
      title: 'Host or Join in Seconds',
      desc: 'Create a room to become the Party Host, or join with a simple room code (e.g. KITTY-7788). You can play on a single shared tablet/phone passed around, or sync across multiple tabs and devices!',
    },
    {
      icon: '🎡',
      title: '10 Unique Mini-Games & Dares',
      desc: 'From 15-second Rapid Fire and Emoji Movie Quizzes to Lucky Tambola, Spin the Wheel, and Memory Challenges—there is something exciting for everyone in the room!',
    },
    {
      icon: '👑',
      title: 'Live Leaderboards & Crowning',
      desc: 'Earn star points with every correct guess and completed dare. Watch the animated 3D podium update in real time, and crown the ultimate Kitty Party Queen with a grand celebration!',
    },
  ];

  const current = steps[step];

  const handleNext = () => {
    sound.playClick();
    triggerHaptic('light');
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-pink-200 dark:border-pink-900/60 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-400 to-amber-300 flex items-center justify-center text-4xl shadow-lg shadow-pink-500/20 mb-4 animate-float-slow">
          {current.icon}
        </div>

        <div className="flex justify-center gap-1.5 mb-4">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === step ? 'w-6 bg-pink-500' : 'w-2 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-slate-900 dark:text-white mb-2">
          {current.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          {current.desc}
        </p>

        <button
          onClick={handleNext}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          {step === steps.length - 1 ? "Let's Get the Party Started! 🥳" : 'Next Step'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
