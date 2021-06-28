import './style.css';

function Category(props) {
  return (
      <button className="category" onClick={props.onClick}>
          <span>{props.name}</span>
      </button>
  );
}

export default Category;
