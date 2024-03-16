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

const GenerateTestList = ({ packs, testCount, toShuffle}) => {
  let testList = packs.reduce(
                          // grab all elements included checked in "packs"
                          (accumulator, currentValue) => accumulator.concat(VerseData[currentValue]),
                          new Array()
                        );
  testList = toShuffle ? _.sample(testList, testCount) : _.first(testList, testCount);
  return (
    <ArrayTester array={testList} />
  )
}

const ArrayTester = ({ array }) => {
  const list = array.map((element) => (
    // key needs to be unique; chose 3 elements that will separate all elements
    <VerseValidator key={element.pack + element.title + element.reference} element={element} />
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
      { value: "tms-60-pack-e", label: "Growth in Christlikeness" }
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
      { value: "dep-2-part-c", label: "Examples of Quiet Time" }
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
  {
    value: "dep-5",
    label: "DEP 5",
    children: [
      { value: "dep-5-part-a", label: "Foundation of Christian Fellowship" },
      { value: "dep-5-part-b", label: "Importance of fellowship" },
      { value: "dep-5-part-c", label: "Essentials of fellowship" },
      { value: "dep-5-part-d", label: "Attitude of fellowship" },
      { value: "dep-5-part-e", label: "Problem solving in fellowship" }
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
  const [testCount, setTestCount] = useState(15)
  const testCountChange = (e) => {
    const value = e.target.value
    setTestCount(value)
  }


  // variables for pack selection
  const [checked, setChecked] = useState([])
  const [expanded, setExpanded] = useState([])
  

  // state for toShuffle
  const [toShuffle, setShuffle] = useState(false);
  // Function to handle checkbox change
  const handleShuffleCheckboxChange = () => {
    // Toggle the state when the checkbox is changed
    setShuffle(!toShuffle);
  };


  // refresh button for refresh
  const RefreshButton = ({ onClick }) => {
    return <button onClick={onClick}>Shuffle</button>;
  };
  // refresh variables where incrementing state forces refresh
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => {
    // Increment the key to force a re-render
    setRefreshKey(refreshKey => refreshKey + 1);
  };
  
  return (
    <div className="App">
      <h1>Scripture Memory Tester</h1>
      <h2>Pick Number of Verses:</h2>
      <label className="test-count-box-label" htmlFor="testCountBox">
        Number of Verses Tested:
      </label>
      <input
        className="test-count-box"
        type="text"
        id="testCountBox"
        name="testCountBox"
        placeholder={testCount}
        onChange={testCountChange}
      />

      <p>(It will only give you as many verses as there are in selected packs)</p>

      <h2>
        Set Shuffle:
        <input
          type="checkbox"
          checked={toShuffle}
          onChange={handleShuffleCheckboxChange}
        />
      </h2>
      <p>(Otherwise cards will appear in sequential order)</p>

      <h2>Pick Your Packs:</h2>
      <CheckboxWidget
        checked={checked}
        expanded={expanded}
        setChecked={setChecked}
        setExpanded={setExpanded}
      />

      <div key={refreshKey}>
        {toShuffle ? 
        <>
          <h2>Shuffle Cards:</h2>
          <RefreshButton onClick={handleRefresh} />
        </>: 
        <p></p>}
      </div>

      <h1>Verses:</h1>
      <GenerateTestList
        packs={checked}
        testCount={testCount}
        toShuffle={toShuffle}
      />

    <hr />

    <p><x-small> Built on: {VITE_BUILD_DATE} </x-small></p>
    </div>
  );
}  

export default App
