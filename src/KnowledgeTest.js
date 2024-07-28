import React, { useState, useEffect } from 'react';

const KnowledgeTest = ({ commands }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);

  const generateQuestion = () => {
    const randomCommand = commands[Math.floor(Math.random() * commands.length)];
    setCurrentQuestion(randomCommand);
    setUserAnswer('');
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userAnswer.toLowerCase() === currentQuestion.name.toLowerCase()) {
      setScore(score + 1);
    }
    setQuestionsAsked(questionsAsked + 1);
    generateQuestion();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">اختبار المعرفة</h2>
      <p className="mb-4">النتيجة: {score} / {questionsAsked}</p>
      {currentQuestion && (
        <form onSubmit={handleSubmit}>
          <p className="mb-2">ما هو الأمر الذي يقوم بالوظيفة التالية:</p>
          <p className="font-bold mb-4">{currentQuestion.description}</p>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            placeholder="اكتب الأمر هنا"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            إرسال
          </button>
        </form>
      )}
    </div>
  );
};

export default KnowledgeTest;