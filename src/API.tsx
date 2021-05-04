import { shuffleArray } from './utils'

export type Question = {
    category: string
    correct_answer: string
    difficulty: string
    incorrect_answers: string[]
    question: string
    type: string
}

export type QuestionState = Question & { answers: string[]}

export enum Difficulty {
    "easy",
    "medium",
    "hard"
}

export const fetchQuizQuestions = async (amount: number, difficulty: Difficulty) => {
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&category=9&difficulty=${difficulty}&type=multiple`
    console.log(endpoint)
    const data = await (await fetch(endpoint)).json()
    return data.results.map((question: Question) => (
        {
            ...question,
            answers: shuffleArray([
                ...question.incorrect_answers, 
                question.correct_answer])
        }
    ))
}