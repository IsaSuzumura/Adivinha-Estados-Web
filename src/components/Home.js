import React from 'react';

export function Home({ onSelectMode }) {
  return (
    <div className="home">
      <h2>Escolha o modo de jogo:</h2>
      <div className="mode-buttons">
        <button onClick={() => onSelectMode('sigla')}>Modo Sigla</button>
        <button onClick={() => onSelectMode('regiao')}>Modo Região</button>
        <button onClick={() => onSelectMode('capital')}>Modo Capital</button>
      </div>
    </div>
  );
}
