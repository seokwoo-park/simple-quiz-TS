import React, {useState} from 'react';
import { fetchQuizQuestions } from './API'

// Components
import { QuestionCard } from './components/index';

// Types
import { QuestionState ,Difficulty } from './API'

// styles

import {GlobalStyle, Wrapper, Select} from './App.styles'

export type AnswerObject = {
  question: string
  answer: string
  correct: boolean
  correctAnswer : string
}


const TOTAL_QUESTIONS = 10

function App() {

  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [number, setNumber] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)
  const [difficulty, setDifficulty] = useState<Difficulty|string>(Difficulty.EASY)

  const startTrivia = async () => {
    setLoading(true)
    setGameOver(false)

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      difficulty
    )

    setQuestions(newQuestions)
    setScore(0)
    setUserAnswers([])
    setNumber(0)

    setLoading(false)
  }


  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver){
      const answer = e.currentTarget.value

      const correct = questions[number].correct_answer === answer

      if (correct) setScore(prev => prev + 1)

      const answerObject:AnswerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }
      setUserAnswers((prev )=> [...prev, answerObject])
    }
  }

  const nextQuestion = () => {

    const nextQuestion = number + 1

    if(nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }
  }

  const onHandleChange =  (e: React.ChangeEvent<HTMLSelectElement>) :void =>  {
    setDifficulty(e.currentTarget.value)
    console.log(e.currentTarget.value)
  }


  return (
    <>
      <GlobalStyle/>
      <Wrapper>
        <h1>SIMPLE QUIZ</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS 
        ? (
        <>
        <Select>
          <label>
          <p>Choose Difficulty</p>
            <select className="select-css" value={difficulty} onChange={onHandleChange}>
              <option value={Difficulty.EASY}>{Difficulty.EASY.toUpperCase()}</option>
              <option value={Difficulty.MEDIUM}>{Difficulty.MEDIUM.toUpperCase()}</option>
              <option value={Difficulty.HARD}>{Difficulty.HARD.toUpperCase()}</option>
            </select>
          </label>
        </Select>

          <button className="start" onClick={startTrivia}>
            Start
          </button>
        </>
        ) 
        : null}
        { !gameOver ? <div className="score">Score : {score}</div> : null }
        { loading && <p>Loading Questions ...</p>}
        {!loading && !gameOver && (
        <QuestionCard
          questionNr={number +1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
        )}
        {
        !gameOver && 
        !loading && 
        userAnswers.length === number + 1 &&
        number !== TOTAL_QUESTIONS - 1 ?(
        <button className="next" onClick={nextQuestion}>
          Next Question
        </button>
        ) : null }
      </Wrapper>
    </>
  );
}

export default App;
