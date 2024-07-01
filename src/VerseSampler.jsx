/* 
Implemented features:
- read keys from json
- create checklist from keys
*/
import fullVerseData from "./assets/verse.json" // the actual verse json data file
import { useState } from "react";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import _ from 'underscore';
import './VerseSampler.css'
import VerseValidator from "./VerseValidator";
import { useTranslation } from 'react-i18next';
import logo from './assets/droplet.svg';
import { Suspense } from "react";

const GenerateTestList = ({ VerseData, packs, testCount, toShuffle, toHideReference}) => {
  let testList = packs.reduce(
                          // grab all elements included checked in "packs"
                          (accumulator, currentValue) => accumulator.concat(VerseData[currentValue]),
                          new Array()
                        );
  testList = toShuffle ? _.sample(testList, testCount) : _.first(testList, testCount);
  return (
    <ArrayTester array={testList} toHideReference={toHideReference} />
  )
}

const ArrayTester = ({ array, toHideReference }) => {
  const list = array.map((element) => (
    // key needs to be unique; chose 3 elements that will separate all elements
    <VerseValidator key={element.pack + element.title + element.reference}
    element={element} toHideReference={toHideReference} />
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

// loadCustomData
const loadCustomData = (language) => {
  let data;
  console.log(language)
  switch (language) {
    case 'kn':
      data = fullVerseData.kn;
      break;
    case 'en':
    default:
      data = fullVerseData.en;
      break;
  }
  return data;
};




function Page() {
  // setup i18 for function
  const { t, i18n } = useTranslation();

  // load VerseData json data file
  const [VerseData, setVerseData] = useState(loadCustomData(i18n.language));
  
  // function hook to change language
  // updates both i18n language and also the VerseData state variable
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setVerseData(loadCustomData(i18n.language));
  };



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
    // additional state change to disable HideReference when shuffling
    if (!toShuffle) {
      setHideReference(false);
    }
  };

  // state for toHideReference
  const [toHideReference, setHideReference] = useState(false);
  // Function to handle checkbox change
  const handleHideReferenceCheckboxChange = () => {
    // Toggle the state when the checkbox is changed
    setHideReference(!toHideReference);
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
      <h1>{t('main.title')}</h1>
      <h2>{t('main.pick_lang')}</h2>
      <button type="button" onClick={() => changeLanguage('en')}>English</button>
      <button type="button" onClick={() => changeLanguage('kn')}>Korean</button>
      <h2>{t('main.pick_num_verses')}</h2>
      <label className="test-count-box-label" htmlFor="testCountBox">
        {t('main.num_verses_tested')}
      </label>
      <input
        className="test-count-box"
        type="text"
        id="testCountBox"
        name="testCountBox"
        placeholder={testCount}
        onChange={testCountChange}
      />

      <p>{t('main.note_num_verses')}</p>

      <h2>
        Set Shuffle:
        <input
          type="checkbox"
          checked={toShuffle}
          onChange={handleShuffleCheckboxChange}
        />
      </h2>
      <p>{t('main.note_set_shuffle')}</p>

      <div>
        {!toShuffle ? 
        <>
          <h2>
            {t('main.hide_reference')} 
            <input
              type="checkbox"
              checked={toHideReference}
              onChange={handleHideReferenceCheckboxChange}
            />
          </h2>
          <p>{t('main.note_hide_reference')}</p> 
        </>:
        <p></p>}
      </div>


      <h2>{t('main.pick_pack')}</h2>
      <CheckboxWidget
        checked={checked}
        expanded={expanded}
        setChecked={setChecked}
        setExpanded={setExpanded}
      />

      <div key={refreshKey}>
        {toShuffle ? 
        <>
          <h2>{t('main.shuffle_card')}</h2>
          <RefreshButton onClick={handleRefresh} />
        </>: 
        <p></p>}
      </div>

      <h1>{t('main.verses')}</h1>
      <GenerateTestList
        VerseData={VerseData}
        packs={checked}
        testCount={testCount}
        toShuffle={toShuffle}
        toHideReference={toHideReference}
      />

    <hr />

    <p><x-small> Built on: {VITE_BUILD_DATE} </x-small></p>
    </div>
  );
}  

// loading component for suspense fallback
const Loader = () => (
  <div className="App">
    <img src={logo} className="App-logo" alt="logo" />
    <div>loading...</div>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Page />
    </Suspense>
  );
}
