import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'



function App() {
  const [inputVerse, setVerse] = useState('')
  const [resultBool, setBool] = useState(false)
  const verseChange = (e) => {
    const value = e.target.value
    let string1 = value;
    let string2 = refVerse;
    console.log(refVerse);
    console.log(value);
    string1 = String(string1).replace(/[^\w\s]/g, "").replace(/\s+/g, " ").toLowerCase();
    string2 = String(string2).replace(/[^\w\s]/g, "").replace(/\s+/g, " ").toLowerCase();

    const bool = string1 === string2;

    setVerse(value)
    setBool(bool)
  }

  const refVerse = "Therefore, if anyone is in Christ, he is a new creation; the old has gone, the new has come!";


  return (
      <div className="App">
        <label className='box-label' htmlFor='verseBox'>2 Cor 5:17</label>
        <input 
          className="verse-box"
          type='text'
          id='verseBox'
          name='verseBox'
          onChange={verseChange}
        />
      <h2>{inputVerse}</h2>
      <h2>{String(resultBool)}</h2>
      </div>
    )
}

export default App
