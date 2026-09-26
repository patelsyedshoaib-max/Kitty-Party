import React, { useState } from 'react';
import { GameId, Player } from '../types/party';
import { GAMES_CATALOG } from '../data/gamesData';
import { sound, triggerHaptic } from '../utils/audio';
import { RapidFireGame } from './games/RapidFireGame';
import { GuessWordGame } from './games/GuessWordGame';
import { EmojiQuizGame } from './games/EmojiQuizGame';
import { MemoryMatchGame } from './games/MemoryMatchGame';
import { SpinWheelGame } from './games/SpinWheelGame';
import { WouldYouRatherGame } from './games/WouldYouRatherGame';
import { GuessWhoGame } from './games/GuessWhoGame';
import { PictureQuizGame } from './games/PictureQuizGame';
import { WordScrambleGame } from './games/WordScrambleGame';
import { LuckyNumberGame } from './games/LuckyNumberGame';
import { ArrowLeft, Trophy, Users, Sparkles, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActiveGameContainerProps {
  gameId: GameId;
  players: Player[];
  currentPlayer: Player;
  roundDuration: number;
  onExitGame: () => void;
  onGameFinish: (earnedPoints: number, winnerName: string) => void;
  onGoToLeaderboard: () => void;
}

export const ActiveGameContainer: React.FC<ActiveGameContainerProps> = ({
  gameId,
  players,
  currentPlayer,
  roundDuration,
  onExitGame,
  onGameFinish,
  onGoToLeaderboard,
}) => {
  const [turnPlayerId, setTurnPlayerId] = useState<string>(currentPlayer.id);
  const [finishedResult, setFinishedResult] = useState<{ points: number; winner: string } | null>(null);

  const gameMeta = GAMES_CATALOG.find((g) => g.id === gameId) || GAMES_CATALOG[0];
  const activeTurnPlayer = players.find((p) => p.id === turnPlayerId) || currentPlayer;

  const handleCompleteRound = (score: number, winnerName?: string) => {
    const finalWinner = winnerName || activeTurnPlayer.name;
    setFinishedResult({ points: score, winner: finalWinner });

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });

    onGameFinish(score, finalWinner);
  };

  const handleNextGame = () => {
    sound.playClick();
    onExitGame();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-pink-100 dark:border-slate-800">
        <button
          onClick={() => {
            sound.playClick();
            onExitGame();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Lobby
        </button>

        {/* Turn Switcher / Player Turn Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Playing Now:</span>
          <select
            value={turnPlayerId}
            onChange={(e) => {
              sound.playClick();
              setTurnPlayerId(e.target.value);
            }}
            className="text-xs font-bold bg-pink-50 dark:bg-slate-800 border border-pink-200 dark:border-slate-700 text-slate-800 dark:text-white px-3 py-1.5 rounded-xl cursor-pointer"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.avatar} {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Game Title Bar */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-1 filter drop-shadow animate-float-slow inline-block">
          {gameMeta.icon}
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif-display font-extrabold text-slate-900 dark:text-white">
          {gameMeta.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1">
          {gameMeta.tagline}
        </p>
      </div>

      {/* Render Specific Game */}
      {!finishedResult ? (
        <div>
          {gameId === 'rapid_fire' && (
            <RapidFireGame
              currentPlayerName={activeTurnPlayer.name}
              roundDuration={roundDuration}
              onComplete={handleCompleteRound}
            />
          )}
          {gameId === 'guess_word' && (
            <GuessWordGame
              currentPlayerName={activeTurnPlayer.name}
              onComplete={handleCompleteRound}
            />
          )}
          {gameId === 'emoji_quiz' && (
            <EmojiQuizGame
              currentPlayerName={activeTurnPlayer.name}
              onComplete={handleCompleteRound}
            />
          )}
          {gameId === 'memory_match' && (
            <MemoryMatchGame
              currentPlayerName={activeTurnPlayer.name}
              onComplete={handleCompleteRound}
            />
          )}
          {gameId === 'spin_wheel' && (
            <SpinWheelGame
              currentPlayerName={activeTurnPlayer.name}
              onComplete={handleCompleteRound}
            />
          )}
          {gameId === 'would_you_rather' && (
            <WouldYouRatherGame
              currentPlayerName={activeTurnPlayer.name}
              onComplete={handleCompleteRound}
            />
          )}
          {gameId === 'guess_who' && (
            <GuessWhoGame
              currentPlayerName={activeTurnPlayer.name}
              onComplete={handleCompleteRound}
            />
          )}
          {gameId === 'picture_quiz' && (
            <PictureQuizGame
              currentPlayerName={activeTurnPlayer.name}
              onComplete={handleCompleteRound}
            />
          )}
          {gameId === 'word_scramble' && (
            <WordScrambleGame
              currentPlayerName={activeTurnPlayer.name}
              onComplete={handleCompleteRound}
            />
          )}
          {gameId === 'lucky_number' && (
            <LuckyNumberGame
              currentPlayerName={activeTurnPlayer.name}
              onComplete={handleCompleteRound}
            />
          )}
        </div>
      ) : (
        /* Round Result Banner */
        <div className="max-w-lg mx-auto p-8 bg-white/90 dark:bg-slate-900/90 rounded-3xl border border-pink-200 dark:border-pink-900 shadow-2xl text-center animate-fade-in">
          <div className="text-5xl mb-3 animate-bounce">🏆</div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-950/60 px-3 py-1 rounded-full">
            Round Completed!
          </span>
          <h3 className="text-2xl font-serif-display font-bold text-slate-900 dark:text-white mt-2 mb-1">
            Splendid Job, {finishedResult.winner}!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            You scored <span className="font-extrabold text-amber-500 font-mono text-lg">+{finishedResult.points} points</span> in this round!
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onGoToLeaderboard}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              Check Live Rankings
            </button>
            <button
              onClick={handleNextGame}
              className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PartyPopper className="w-4 h-4" />
              Next Party Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
