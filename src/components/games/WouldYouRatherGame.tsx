import React, { useState } from 'react';
import { WOULD_YOU_RATHER_ITEMS, WouldYouRatherItem } from '../../data/gamesData';
import { sound, triggerHaptic } from '../../utils/audio';
import { Scale, ArrowRight, Users, Sparkles } from 'lucide-react';

interface WouldYouRatherProps {
  onComplete: (score: number, winnerName?: string) => void;
  currentPlayerName: string;
}

export const WouldYouRatherGame: React.FC<WouldYouRatherProps> = ({ onComplete, currentPlayerName }) => {
  const [items] = useState<WouldYouRatherItem[]>(() => [...WOULD_YOU_RATHER_ITEMS].sort(() => Math.random() - 0.5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votedChoice, setVotedChoice] = useState<'A' | 'B' | null>(null);
  const [score, setScore] = useState(0);

  const currentItem = items[currentIndex % items.length];
  const totalVotes = currentItem.votesA + currentItem.votesB + (votedChoice ? 1 : 0);
  const adjustedVotesA = currentItem.votesA + (votedChoice === 'A' ? 1 : 0);
  const percentA = Math.round((adjustedVotesA / totalVotes) * 100);
  const percentB = 100 - percentA;

  const handleVote = (choice: 'A' | 'B') => {
    if (votedChoice) return;
    sound.playSuccess();
    triggerHaptic('medium');
    setVotedChoice(choice);
    setScore((s) => s + 25);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= Math.min(4, items.length)) {
      sound.playFanfare();
      onComplete(score, currentPlayerName);
    } else {
      setVotedChoice(null);
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-cyan-200/50 dark:border-cyan-900/30 shadow-xl text-center">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-cyan-500" />
          <span className="text-sm font-bold text-cyan-800 dark:text-cyan-300">
            Dilemma {currentIndex + 1} of {Math.min(4, items.length)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-bold px-3 py-1 rounded-full">
            {score} pts
          </span>
        </div>
      </div>

      <div className="my-6">
        <h2 className="text-2xl font-serif-display font-bold text-slate-800 dark:text-white mb-1">
          Would You Rather...
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Pick your true choice and see how your party friends vote!
        </p>
      </div>

      {/* Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {/* Option A */}
        <button
          onClick={() => handleVote('A')}
          disabled={votedChoice !== null}
          className={`p-6 rounded-2xl border text-left flex flex-col justify-between transition-all transform active:scale-98 cursor-pointer relative overflow-hidden ${
            votedChoice === 'A'
              ? 'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-400 text-white shadow-lg shadow-pink-500/25 ring-4 ring-pink-300/40'
              : votedChoice !== null
              ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-70'
              : 'bg-gradient-to-br from-pink-50 to-rose-50/50 dark:from-slate-800 dark:to-slate-800/60 border-pink-200 dark:border-slate-700 hover:border-pink-400 text-slate-800 dark:text-white shadow-sm'
          }`}
        >
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider opacity-80 block mb-2">
              Option A
            </span>
            <p className="text-base font-bold leading-snug">
              {currentItem.optionA}
            </p>
          </div>

          {votedChoice !== null && (
            <div className="mt-4 pt-3 border-t border-white/20">
              <div className="text-2xl font-black font-mono">
                {percentA}%
              </div>
              <div className="text-xs opacity-80 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {adjustedVotesA} party votes
              </div>
            </div>
          )}
        </button>

        {/* Option B */}
        <button
          onClick={() => handleVote('B')}
          disabled={votedChoice !== null}
          className={`p-6 rounded-2xl border text-left flex flex-col justify-between transition-all transform active:scale-98 cursor-pointer relative overflow-hidden ${
            votedChoice === 'B'
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/25 ring-4 ring-cyan-300/40'
              : votedChoice !== null
              ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-70'
              : 'bg-gradient-to-br from-cyan-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-800/60 border-cyan-200 dark:border-slate-700 hover:border-cyan-400 text-slate-800 dark:text-white shadow-sm'
          }`}
        >
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider opacity-80 block mb-2">
              Option B
            </span>
            <p className="text-base font-bold leading-snug">
              {currentItem.optionB}
            </p>
          </div>

          {votedChoice !== null && (
            <div className="mt-4 pt-3 border-t border-white/20">
              <div className="text-2xl font-black font-mono">
                {percentB}%
              </div>
              <div className="text-xs opacity-80 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {totalVotes - adjustedVotesA} party votes
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Continue */}
      {votedChoice !== null && (
        <div className="mt-6 p-4 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/40 rounded-2xl flex items-center justify-between">
          <p className="text-xs md:text-sm text-cyan-900 dark:text-cyan-200 font-medium">
            <Sparkles className="w-4 h-4 inline mr-1 text-amber-500" />
            +25 Party Points added for sharing your vote!
          </p>
          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm rounded-xl shadow cursor-pointer flex items-center gap-1.5"
          >
            {currentIndex + 1 >= Math.min(4, items.length) ? 'Complete Game' : 'Next Dilemma'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
