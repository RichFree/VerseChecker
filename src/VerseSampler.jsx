/* 
Implemented features:
- read keys from json
- create checklist from keys
*/
import VerseData from "./assets/verse.json"
import { useState } from "react";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import _ from 'underscore';
import './VerseSampler.css'
import VerseValidator from "./VerseValidator";

const GenerateTestList = ({ packs, testCount}) => {
  let testList = packs.reduce(
                          // grab all elements included checked in "packs"
                          (accumulator, currentValue) => accumulator.concat(VerseData[currentValue]),
                          new Array()
                        );
  testList = _.sample(testList, testCount);
  return (
    <ArrayTester array={testList} />
  )
}

const ArrayTester = ({ array }) => {
  const list = array.map((element) => (
    <VerseValidator key={element.reference} element={element} />
  ))
  return list
}


const nodes = [
  {
    value: 'loa',
    label: 'Lessons on Assurance'
  },
  {
    value: 'tms60',
    label: 'TMS60',
    children: [
        { value: 'tms-60-pack-a', label: 'Pack A' },
        { value: 'tms-60-pack-b', label: 'Pack B' },
        { value: 'tms-60-pack-c', label: 'Pack C' },
        { value: 'tms-60-pack-d', label: 'Pack D' },
        { value: 'tms-60-pack-e', label: 'Pack E' }
    ]
  },
  {
    value: 'dep',
    label: 'DEP',
    children: [
      { value: 'dep-1', label: 'DEP 1' },
      { value: 'dep-2', label: 'DEP 2' },
      { value: 'dep-3', label: 'DEP 3' },
      { value: 'dep-4', label: 'DEP 4' }
    ]
  }
];

const CheckboxWidget = ({checked, expanded, setChecked, setExpanded}) => {
  return (
    <div className="CheckboxTree">
      <CheckboxTree
        nodes={nodes}
        checked={checked}
        expanded={expanded}
        onCheck={setChecked}
        onExpand={setExpanded}
      />
    </div>
  );
}




function App() {
  // create checklist array for pack selection
  const packList = Object.keys(VerseData);
  // return a list of packObj's
  // 1. packObj.pack for the pack name 
  // 2. packObj.include for whether to include the pack
  const packObjList = packList.map((element) => {
    const packObj = new Object();
    packObj.pack = element;
    packObj.include = false;
    return packObj
  }
  )
  const [packs, setPacks] = useState(packObjList)

  // initialize state variable testCount
  // purpose: to set number of verses to test
  const [testCount, setTestCount] = useState(5)
  const testCountChange = (e) => {
    const value = e.target.value
    setTestCount(value)
  }


  // variables for pack selection
  const [checked, setChecked] = useState([])
  const [expanded, setExpanded] = useState([])


  
  return (
    <div className="App">
      <h1>Pick Number of Verses:</h1>
      <label className="test-count-box-label" htmlFor="testCountBox">
        Number of Verses Tested:
      </label>
      <input
        className="test-count-box"
        type="text"
        id="testCountBox"
        name="testCountBox"
        onChange={testCountChange}
      />

      <h1>Pick Your Packs:</h1>
      <CheckboxWidget
        checked={checked}
        expanded={expanded}
        setChecked={setChecked}
        setExpanded={setExpanded}
      />

      {/*<div className="PackDisplay">
        <h1>Packs Tested:</h1>
        {checked
          .map((element) => (
            <li key={element}>{element}</li>
          ))}
        </div>*/}
      <h1>Verses:</h1>
      <GenerateTestList packs={checked} testCount={testCount} />
    </div>
  );
}  

export default App
