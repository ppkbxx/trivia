import React, {useState, useEffect} from 'react';

import Category from "../../atoms/Category/Category";
import Question from "../../atoms/Question/Question";

import './style.css';

const MODE = {
  categories: 'categories',
  questions: 'questions',
  results: 'results',
}

function Home() {
  const [mode, setMode] = useState(MODE.categories);

  const [categories, setCategories] = useState([]);
  const [amountQuestions, setAmountQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    getCategories();
  }, [])

  useEffect(() => {
    if (currentQuestionIndex >= questions.length && questions.length > 0) {
      setMode(MODE.results)
    }
  }, [currentQuestionIndex])

  const getCategories = () => {
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((result) => setCategories(result.trivia_categories))
      .catch((err) => console.log(err))
  }

  const getQuestions = (id) => {
    const params = {category: id, difficulty: difficulty, amount: amountQuestions.toString(), type: "multiple"}
    const queryParams = new URLSearchParams(params).toString()
    const url = "https://opentdb.com/api.php?" + queryParams;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setQuestions(result.results)
        setMode(MODE.questions)
      })
      .catch((err) => console.log(err))
  }

  const renderCategories = () => {
    return categories.map((item) => <Category key={item.id} name={item.name} onClick={() => getQuestions(item.id)} />)
  }

  const onChangeNumberQuestions = (event) => {
    setAmountQuestions(event.target.value);
  }

  const onChangeDifficulty = (event) => {
    setDifficulty(event.target.value);
  }

  const getCurrentQuestion = () => {
    return questions[currentQuestionIndex];
  }

  const currentQuestion = getCurrentQuestion();

  const shuffle = (arr) => {
    return arr.sort(() => Math.random() - 0.5)
  }

  const getAnswers = () => {
    let answers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers];
    return shuffle(answers)
  }

  const onAnswer = (answer) => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    if (answer === currentQuestion.correct_answer) {
      setCorrectAnswers(correctAnswers + 1);
    }
  }

  const renderCategoriesMode = () => (
    <React.Fragment>
      <div className="home__settings">
        <label>
          Number questions:
          <input type="number" min="1" max="50" value={amountQuestions} onChange={onChangeNumberQuestions} />
        </label>
        Choose difficulty:
        <select value={difficulty} onChange={onChangeDifficulty}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="home__categories">
        {renderCategories()}
      </div>
    </React.Fragment>
  )

  const renderQuestionsMode = () => (
    <React.Fragment>
      {currentQuestion && (
        <Question
          content={currentQuestion.question}
          answers={getAnswers()}
          onAnswer={onAnswer}
          currentIndex={currentQuestionIndex + 1}
          amountQuestions={questions.length}
        />
      )}
    </React.Fragment>
  )

  const renderResultMode = () => (
    <React.Fragment>
      <div className="home__final">
        <div className="home__result">
          Correct answers: {correctAnswers}/{questions.length}
        </div>
        <button className="home__restart" onClick={() => window.location.reload()}>
          Play again
        </button>
      </div>
    </React.Fragment>
  )

  const renderCurrentMode = () => {
    switch (mode) {
      case MODE.categories: {
        return renderCategoriesMode();
      }
      case MODE.questions: {
        return renderQuestionsMode();
      }
      case MODE.results: {
        return renderResultMode();
      }
      default: {
        return renderCategoriesMode();
      }
    }
  }
  return (
    <div className="home">
      {renderCurrentMode()}
    </div>
  );
}

export default Home;
