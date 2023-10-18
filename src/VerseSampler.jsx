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
    value: "loa",
    label: "Lessons on Assurance",
  },
  {
    value: "tms60",
    label: "TMS60",
    children: [
      { value: "tms-60-pack-a", label: "Living the New Life" },
      { value: "tms-60-pack-b", label: "Proclaiming Christ" },
      { value: "tms-60-pack-c", label: "Reliance on God's Resources" },
      { value: "tms-60-pack-d", label: "Being Christ's Disciple" },
      { value: "tms-60-pack-e", label: "Growth in Christlikeness" },
    ],
  },
  {
    value: "dep-1",
    label: "DEP 1",
  },
  {
    value: "dep-2",
    label: "DEP 2",
    children: [
      { value: "dep-2-part-a", label: "Why do we have Quiet Time?" },
      { value: "dep-2-part-b", label: "What is Quiet Time?" },
      { value: "dep-2-part-c", label: "Examples of Quiet Time" },
    ],
  },
  {
    value: "dep-3",
    label: "DEP 3",
    children: [
      { value: "dep-3-part-a", label: "Authority of the Word" },
      { value: "dep-3-part-b", label: "Value of the Word" },
      { value: "dep-3-part-c", label: "Attitude to the Word" },
      { value: "dep-3-part-d", label: "How to take in the Word (Word Hand Illustration)" }
    ],
  },
  {
    value: "dep-4",
    label: "DEP 4",
    children: [
      { value: "dep-4-part-a", label: "Command of Prayer" },
      { value: "dep-4-part-b", label: "Promises and Blessings of Prayer" },
      { value: "dep-4-part-c", label: "Conditions for Answered Prayer" },
      { value: "dep-4-part-d", label: "Examples of Prayer" },
      { value: "dep-4-part-e", label: "Prayer Hand Illustration" }
    ],
  },
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
    // create object for each element in VerseData key list
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

      <h1>Verses:</h1>
      <GenerateTestList packs={checked} testCount={testCount} />
    </div>
  );
}  

export default App
