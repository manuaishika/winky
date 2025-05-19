import { useState, useEffect } from 'react';

interface Option {
  id: string;
  text: string;
}

interface QuestionProps {
  question: string;
  options: Option[];
  correctAnswer: string;
  onAnswer: (isCorrect: boolean) => void;
  timeLimit?: number;
}

export default function Question({
  question,
  options,
  correctAnswer,
  onAnswer,
  timeLimit = 30,
}: QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (isAnswered || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsAnswered(true);
          onAnswer(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, timeLeft, onAnswer]);

  const handleAnswer = (optionId: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(optionId);
    setIsAnswered(true);
    onAnswer(optionId === correctAnswer);
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{question}</h3>
          <span className="text-sm font-medium text-gray-500">
            Time: {timeLeft}s
          </span>
        </div>
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id)}
              disabled={isAnswered}
              className={`w-full text-left px-4 py-3 rounded-md border ${
                isAnswered
                  ? option.id === correctAnswer
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : option.id === selectedAnswer
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                  : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 