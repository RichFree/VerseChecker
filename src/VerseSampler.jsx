/* 
Implemented features:
- read keys from json
- create checklist from keys
*/
import VerseData from "./assets/verse.json"
import { useState } from "react";
import _ from 'underscore';
import './VerseSampler.css'

// const ArrayPrinter = ({ array }) => {
//   const list = array.map((element, i) => 
//     <div className="ArrayPrinter" key={i}>
//       <li key={element.reference}>{element.reference}</li>
//       <li key={element.title}>{element.title}</li>
//       <li key={element.verse}>{element.verse}</li>
//     </div>
//   )
//   return list
// }

const ArrayTester = ({ array }) => {
  const list = array.map((element, i) => (
    <VerseValidator element={element} />
  ))
  return list
}

const VerseValidator = ({ element: { id, title, reference, verse } }) => {
  const [inputVerse, setVerse] = useState('')
  const [resultBool, setBool] = useState(false)
  const verseChange = (e) => {
    const value = e.target.value
    let string1 = value;
    let string2 = verse;
    console.log(verse);
    console.log(value);
    string1 = String(string1).replace(/[^\w\s]/g, "").replace(/\s+/g, "").toLowerCase();
    string2 = String(string2).replace(/[^\w\s]/g, "").replace(/\s+/g, "").toLowerCase();

    const bool = string1 === string2;

    setVerse(value)
    setBool(bool)
  }

  return (
    <div className="VerseValidator">
      <label className='box-label' htmlFor='verseBox'>{reference}</label>
      <input 
        className="verse-box"
        type='text'
        id='verseBox'
        name='verseBox'
        onChange={verseChange}
      />
      <ul>{inputVerse}</ul>
      <ul>{String(resultBool)}</ul>
    </div>
  )

}

const ButtonMapper = ({packs, setPacks})  => {
  return (
  packs.map(({ pack, include }, i) => (
      <div key={i}>
        <label htmlFor={i}>
          <input
            type="checkbox"
            onChange={() => handleChange(setPacks, packs, include, i)}
            checked={include}
            id={i}
          />
          <span>{pack}</span>
        </label>
      </div>
  )
))}


const handleChange = (setPacks, packs, include, i) => {
  // extract desired item
  let tmp = packs[i];
  tmp.include = !include;
  // clone existing array
  let packsClone = [...packs];
  // assign modified item back
  packsClone[i] = tmp;
  setPacks([...packsClone]);
};

const GenerateTestList = ({ packs, testCount}) => {
  let testList = packs.filter((pack) => pack.include)
                        .map((element) => element.pack)
                        .reduce(
                          (accumulator, currentValue) => accumulator.concat(VerseData[currentValue]),
                          new Array()
                        );
  testList = _.sample(testList, testCount);
  return (
    <ArrayTester array={testList} />
  )
}

function App() {
  // create checklist array for pack selection
  const packList = Object.keys(VerseData);
  const packObjList = packList.map((element) => {
    const packObj = new Object();
    packObj.pack = element;
    packObj.include = false;
    return packObj
  }
  )
  const [packs, setPacks] = useState(packObjList)

  // set number for number of samples
  const [testCount, setTestCount] = useState(5)
  const testCountChange = (e) => {
    const value = e.target.value
    setTestCount(value)
  }

  
  return (
    <div className="App">
      <h1>Pick Number of Verses:</h1>
      <label className='test-count-box-label' htmlFor='testCountBox'>Number of Verses Tested:</label>
      <input 
        className="test-count-box"
        type='text'
        id='testCountBox'
        name='testCountBox'
        onChange={testCountChange}
      />

      <h1>Pick Your Packs:</h1>
      <ButtonMapper packs={packs} setPacks={setPacks} />

            <div className="PackDisplay">
        <h1>Packs Tested:</h1>
        {packs
          .filter((pack) => pack.include)
          .map((element) => (
            <li key={element.pack}>{element.pack}</li>
          ))}
      </div>
      <h1>Verses:</h1>
      <GenerateTestList packs={packs} testCount={testCount} />
      
    </div>
  );
}  

export default App
