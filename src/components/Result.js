import React from 'react';

export function Result({ score, totalQuestions, onRestart }) {
  return (
    <div className="result">
      <h2>Resultado Final</h2>
      <p>Você acertou {score} de {totalQuestions} perguntas!</p>
      <button onClick={onRestart}>Voltar para Início</button>
    </div>
  );
}
