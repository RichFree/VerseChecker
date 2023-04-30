import VerseData from "./assets/verse.json"
import { useState } from "react";


const ButtonMapper = ({todos, setTodos})  => {
  return (
  todos.map(({ task, done }, i) => (
      <div key={i}>
        <label htmlFor={i}>
          <input
            type="checkbox"
            onChange={() => handleChange(setTodos, todos, done, i)}
            checked={done}
            id={i}
          />
          <span>{task}</span>
        </label>
      </div>
  )
))}

const handleChange = (setTodos, todos, done, i) => {
  // extract desired item
  let tmp = todos[i];
  tmp.done = !done;
  // clone existing array
  let todosClone = [...todos];
  // assign modified item back
  todosClone[i] = tmp;
  setTodos([...todosClone]);
};



function App() {
  const [todos, setTodos] = useState([
    { task: "Pick up groceries", done: false },
    { task: "Buy Milk", done: true },
    { task: "Complete Project X", done: false },
  ]);


  return (
    <div className="App">
      <ButtonMapper todos={todos} setTodos={setTodos} />
      <h3>Total Completed: {todos.filter((todo) => todo.done).length}</h3>
    </div>
  )
}  

export default App
