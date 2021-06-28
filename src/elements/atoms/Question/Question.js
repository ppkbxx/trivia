import Answers from "../Answers/Answers";

import './style.css';

function Question(props) {
  const onAnswer = (answer) => {
    props.onAnswer(answer)
  }

  const renderAnswers = (answers = []) => {
    return answers.map((item, index) => <Answers key={index} name={item} onClick={() => onAnswer(item)}/>)
  }

  return (
    <div className="question">
      <div className="question__number">
        Question Number: {props.currentIndex}/{props.amountQuestions}
      </div>
      <div className="question__wrapper">
        <span className="question__text">{props.content}</span>
      </div>
      <div className="question__answers">
        {renderAnswers(props.answers)}
      </div>
    </div>
  );
}

export default Question;