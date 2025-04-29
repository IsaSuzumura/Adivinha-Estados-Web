import React, { useState } from 'react';
import { Home } from './components/Home';
import { Game } from './components/Game';
import { Result } from './components/Result';

export function App() {
  const [mode, setMode] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const startGame = (selectedMode) => {
    setMode(selectedMode);
  };

  const finishGame = (finalScore, total) => {
    setScore(finalScore);
    setTotalQuestions(total);
    setMode('result');
  };

  const resetGame = () => {
    setMode(null);
    setScore(0);
    setTotalQuestions(0);
  };

  return (
    <div className="App">
      <h1>Jogo dos Estados do Brasil</h1>
      {mode === null && <Home onSelectMode={startGame} />}
      {(mode === 'sigla' || mode === 'regiao' || mode === 'capital') && (
        <Game mode={mode} onFinish={finishGame} />
      )}
      {mode === 'result' && (
        <Result score={score} totalQuestions={totalQuestions} onRestart={resetGame} />
      )}
    </div>
  );
}
