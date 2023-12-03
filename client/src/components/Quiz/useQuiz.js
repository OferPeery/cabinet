import { useState } from "react";
import shuffleArray from "shuffle-array";
import { questionsCollection } from "../../utils/quizQuestions";

export const useQuiz = () => {
  const [questions, setQuestions] = useState(() =>
    shuffleArray(questionsCollection)
  );

  const shuffle = () => {
    setQuestions(shuffleArray(questions));
  };

  return [questions, { shuffle }];
};
