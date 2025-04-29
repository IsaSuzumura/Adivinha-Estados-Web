import React, { useEffect, useState, useCallback } from 'react';
import capitais from '../data/capitais';

export function Game({ mode, onFinish }) {
  const [states, setStates] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [inputAnswer, setInputAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  const generateQuestionText = useCallback((state) => {
    if (mode === 'sigla') return `Qual é a sigla do estado ${state.nome}?`;
    if (mode === 'regiao') return `Qual é a região do estado ${state.nome}?`;
    if (mode === 'capital') return `Qual é a capital do estado ${state.nome}?`;
    return '';
  }, [mode]);

  const generateOptions = useCallback((correctState, allStates) => {
    if (mode === 'sigla') {
      const wrongOptions = allStates.filter(s => s.id !== correctState.id)
        .sort(() => 0.5 - Math.random()).slice(0, 3);

      const options = [
        { answerText: correctState.sigla, isCorrect: true },
        ...wrongOptions.map(state => ({ answerText: state.sigla, isCorrect: false }))
      ];
      return options.sort(() => 0.5 - Math.random());
    }

    if (mode === 'regiao') {
      const regions = [...new Set(allStates.map(state => state.regiao.nome))];
      const wrongRegions = regions.filter(r => r !== correctState.regiao.nome)
        .sort(() => 0.5 - Math.random()).slice(0, 3);

      const options = [
        { answerText: correctState.regiao.nome, isCorrect: true },
        ...wrongRegions.map(region => ({ answerText: region, isCorrect: false }))
      ];
      return options.sort(() => 0.5 - Math.random());
    }

    if (mode === 'capital') {
      const correctCapital = capitais.find(c => c.uf === correctState.sigla)?.capital;
      return [{ answerText: correctCapital, isCorrect: true }];
    }

    return [];
  }, [mode]);

  const generateQuestions = useCallback((data) => {
    const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 10);
    const newQuestions = shuffled.map(state => ({
      state,
      questionText: generateQuestionText(state),
      answerOptions: generateOptions(state, data),
    }));
    setQuestions(newQuestions);
  }, [generateQuestionText, generateOptions]);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => response.json())
      .then(data => {
        setStates(data);
        generateQuestions(data);
      });
  }, [mode, generateQuestions]);

  useEffect(() => {
    if (questions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 1) {
            handleAnswer(false);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentQuestion, questions]);

  const handleAnswer = useCallback((isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('Correto!');
    } else {
      setFeedback('Errado!');
    }

    setTimeout(() => {
      setFeedback(null);

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(15);
        setInputAnswer('');
      } else {
        onFinish(score + (isCorrect ? 1 : 0), questions.length);
      }
    }, 1000);
  }, [currentQuestion, onFinish, questions.length, score]);

  const handleSubmit = () => {
    if (feedback) return;
    const correctAnswer = questions[currentQuestion].answerOptions[0].answerText;
    const normalizedInput = inputAnswer.trim().toLowerCase();
    const normalizedCorrect = correctAnswer.trim().toLowerCase();
    handleAnswer(normalizedInput === normalizedCorrect);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (questions.length === 0) return <div>Carregando perguntas...</div>;

  return (
    <div className="game">
      <div className="timer">Tempo restante: {timeLeft}s</div>
      <div className="question-section">
        <div className="question-count">
          Pergunta {currentQuestion + 1} de {questions.length}
        </div>
        <div className="question-text">{questions[currentQuestion].questionText}</div>
      </div>

      <div className="answer-section">
        {mode === 'capital' ? (
          <div>
            <input
              type="text"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite a capital"
              disabled={!!feedback}
            />
            <button onClick={handleSubmit} disabled={!!feedback}>Responder</button>
          </div>
        ) : (
          questions[currentQuestion].answerOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.isCorrect)}
              disabled={!!feedback}
            >
              {option.answerText}
            </button>
          ))
        )}
      </div>

      {feedback && (
        <div className={`feedback ${feedback === 'Correto!' ? 'correct' : 'incorrect'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
}
