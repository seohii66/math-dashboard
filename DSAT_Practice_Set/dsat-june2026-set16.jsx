import React, { useState } from 'react';

const SquaredUnitConversionPractice = () => {
  const questions = [
    {
      "id": 1,
      "difficulty": "Easy",
      "question": "The area of a rectangular floor is 8 square yards. If 1 yard is equivalent to 3 feet, what is the area of the floor in square feet?",
      "options": {"A": "24", "B": "64", "C": "72", "D": "512"},
      "correct_answer": "C",
      "explanation": "1 yard = 3 feet. Squaring both sides gives 1 square yard = 9 square feet. 8 square yards * 9 = 72 square feet."
    },
    {
      "id": 2,
      "difficulty": "Easy",
      "question": "A certain material has a surface area of 3.5 square meters. If 1 meter is equal to 100 centimeters, what is the surface area in square centimeters?",
      "options": {"A": "350", "B": "3,500", "C": "35,000", "D": "350,000"},
      "correct_answer": "D",
      "explanation": "1 meter = 100 centimeters. Squaring both sides gives 1 square meter = 10,000 square centimeters. 3.5 * 10,000 = 350,000 square centimeters."
    },
    {
      "id": 3,
      "difficulty": "Medium",
      "question": "An architect is looking at a blueprint where the area of a room is given as 432 square inches. If 1 foot equals 12 inches, what is the area of the room in square feet?",
      "options": {"A": "3", "B": "12", "C": "36", "D": "144"},
      "correct_answer": "A",
      "explanation": "1 foot = 12 inches, so 1 square foot = 144 square inches. To convert from square inches to square feet, divide by 144. 432 / 144 = 3 square feet."
    },
    {
      "id": 4,
      "difficulty": "Medium",
      "question": "A type of solar panel produces 2.5 watts of power per square foot. Given that 1 foot is equal to 12 inches, how many watts of power does it produce per square inch?",
      "options": {"A": "0.017", "B": "0.208", "C": "30", "D": "360"},
      "correct_answer": "A",
      "explanation": "1 square foot = 144 square inches. The panel produces 2.5 watts / 1 sq ft. Substitute 144 sq in for 1 sq ft: 2.5 watts / 144 sq in ≈ 0.01736 watts per square inch."
    },
    {
      "id": 5,
      "difficulty": "Medium",
      "question": "The population density of a certain bacteria culture is 4,000 cells per square centimeter. If 1 centimeter is equal to 10 millimeters, what is the population density in cells per square millimeter?",
      "options": {"A": "40", "B": "400", "C": "40,000", "D": "400,000"},
      "correct_answer": "A",
      "explanation": "1 centimeter = 10 millimeters, so 1 square centimeter = 100 square millimeters. Density = 4000 cells / 1 sq cm = 4000 cells / 100 sq mm = 40 cells per square millimeter."
    },
    {
      "id": 6,
      "difficulty": "Hard",
      "question": "On a scale map, 1 inch represents an actual distance of 5 miles. If a national park occupies an area of 6.4 square inches on the map, what is the actual area of the park in square miles?",
      "options": {"A": "32", "B": "64", "C": "160", "D": "320"},
      "correct_answer": "C",
      "explanation": "The linear scale is 1 inch = 5 miles. The area scale is (1 inch)^2 = (5 miles)^2, so 1 square inch = 25 square miles. 6.4 square inches * 25 = 160 square miles."
    },
    {
      "id": 7,
      "difficulty": "Hard",
      "question": "A certain specialized paint costs $15 per square meter to apply. If 1 meter is equal to 100 centimeters, what is the cost to apply this paint per square centimeter?",
      "options": {"A": "$0.0015", "B": "$0.015", "C": "$0.15", "D": "$1.50"},
      "correct_answer": "A",
      "explanation": "1 square meter = 10,000 square centimeters. The cost is $15 / 1 sq m = $15 / 10,000 sq cm = $0.0015 per square centimeter."
    },
    {
      "id": 8,
      "difficulty": "Hard",
      "question": "A computer monitor has a display area of 150 square inches. If 1 inch is exactly 2.54 centimeters, which of the following is closest to the display area in square centimeters?",
      "options": {"A": "381", "B": "968", "C": "1,500", "D": "3,810"},
      "correct_answer": "B",
      "explanation": "1 inch = 2.54 cm, so 1 square inch = (2.54)^2 sq cm = 6.4516 sq cm. 150 sq inches * 6.4516 = 967.74 square centimeters, which is closest to 968."
    },
    {
      "id": 9,
      "difficulty": "Hard",
      "question": "The pressure exerted by an object is 120 Newtons per square meter. If 1 meter equals 1,000 millimeters, what is the pressure exerted in Newtons per square millimeter?",
      "options": {"A": "0.00012", "B": "0.0012", "C": "0.12", "D": "120,000"},
      "correct_answer": "A",
      "explanation": "1 meter = 1000 mm, so 1 square meter = 1,000,000 square mm. Pressure = 120 N / 1 sq m = 120 N / 1,000,000 sq mm = 0.00012 N/sq mm."
    },
    {
      "id": 10,
      "difficulty": "Hard",
      "question": "A city has a population density of 12,500 people per square mile. If 1 mile is equal to 5,280 feet, which of the following expressions represents the population density in people per square foot?",
      "options": {"A": "12,500 / 5,280", "B": "12,500 / (5,280)^2", "C": "12,500 * 5,280", "D": "12,500 * (5,280)^2"},
      "correct_answer": "B",
      "explanation": "1 mile = 5280 feet, so 1 square mile = (5280)^2 square feet. Density = 12,500 people / 1 sq mile = 12,500 people / (5280)^2 sq ft."
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;
    
    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer('');
    setShowExplanation(false);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
  };

  if (quizComplete) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        <h2>Practice Complete!</h2>
        <p>Your Score: {score} / {questions.length}</p>
        <button onClick={resetQuiz} style={{ padding: '10px 20px', cursor: 'pointer' }}>Restart Practice</button>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span>Question {q.id} of {questions.length}</span>
        <span style={{ color: q.difficulty === 'Easy' ? 'green' : q.difficulty === 'Medium' ? 'orange' : 'red', fontWeight: 'bold' }}>
          {q.difficulty}
        </span>
      </div>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>{q.question}</p>
      
      <div style={{ margin: '20px 0' }}>
        {Object.entries(q.options).map(([key, value]) => (
          <label key={key} style={{ display: 'block', margin: '10px 0', cursor: 'pointer' }}>
            <input
              type="radio"
              name="answer"
              value={key}
              checked={selectedAnswer === key}
              disabled={showExplanation}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <strong>{key})</strong> {value}
          </label>
        ))}
      </div>

      {!showExplanation ? (
        <button 
          onClick={handleAnswerSubmit} 
          disabled={!selectedAnswer}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: selectedAnswer ? 'pointer' : 'not-allowed' }}
        >
          Submit Answer
        </button>
      ) : (
        <div style={{ marginTop: '20px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
          <p style={{ fontWeight: 'bold', color: selectedAnswer === q.correct_answer ? 'green' : 'red' }}>
            {selectedAnswer === q.correct_answer ? 'Correct!' : `Incorrect. The correct answer is ${q.correct_answer}.`}
          </p>
          <p><strong>Explanation:</strong> {q.explanation}</p>
          <button 
            onClick={handleNextQuestion}
            style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {currentQuestion + 1 === questions.length ? 'See Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SquaredUnitConversionPractice;
