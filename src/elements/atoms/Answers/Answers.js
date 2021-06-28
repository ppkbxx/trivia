import './style.css'

function Answers(props) {
  return (
    <div className="answer" onClick={props.onClick}>
      <span className="answer__content">{props.name}</span>
    </div>
  );
}

export default Answers;