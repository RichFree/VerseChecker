/* 
Implemented features:
- read keys from json
- create checklist from keys
*/
import fullVerseData from "./assets/verse.json" // the actual verse json data file
import { useState, useEffect } from "react";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import _ from 'underscore';
import './VerseSampler.css'
import VerseValidator from "./VerseValidator";
import { useTranslation } from 'react-i18next';
import logo from './assets/droplet.svg';
import { Suspense } from "react";

const GenerateTestList = ({ VerseData, packs, testCount, toShuffle, toHideReference, translate}) => {
  let testList = packs.reduce(
                          // grab all elements included checked in "packs"
                          (accumulator, currentValue) => accumulator.concat(VerseData[currentValue]),
                          new Array()
                        );
  testList = toShuffle ? _.sample(testList, testCount) : _.first(testList, testCount);
  return (
    <ArrayTester 
      array={testList} 
      toHideReference={toHideReference} 
      translate={translate}
    />
  )
}

const ArrayTester = ({ array, toHideReference, translate}) => {
  const list = array.map((element) => (
    // key needs to be unique; chose 3 elements that will separate all elements
    <VerseValidator 
      key={element.pack + element.title + element.reference}
      element={element} 
      toHideReference={toHideReference} 
      t={translate} // this passes the t i18 object to the function
    />
  ))
  return list
}

const CheckboxWidget = ({nodes, checked, expanded, setChecked, setExpanded}) => {
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
  // console.log(language)
  switch (language) {
    case 'kn':
      data = fullVerseData.kn;
      break;
    case 'en':
    default:
      data = fullVerseData.en;
      break;// 
  }
  return data;
};




function Page() {

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

  // setup i18 for function
  const { t, i18n } = useTranslation();

  // we should not load the file every time
  const [VerseData, setVerseData] = useState(null);
  // effect to only run on first render
  // empty dependency means only mount once
  useEffect(() => {
    setVerseData(loadCustomData(i18n.language));
  }, []);

  
  // function hook to change language
  // updates both i18n language and also the VerseData state variable
  const changeLanguage = (lng) => {
    // reset selection list
    setChecked([]);
    setExpanded([]);

    // i18n.changeLanguage is async, so we should wait until its done to avoid
    // race conditions
    // console.log("change language");
    i18n.changeLanguage(lng).then(() => {
      setVerseData(loadCustomData(i18n.language));
    });
  };


  // initialize state variable testCount
  // purpose: to set number of verses to test
  const [testCount, setTestCount] = useState(20)
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
        {t('main.set_shuffle')} 
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
        nodes={t('nodes', { returnObjects: true })}
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
        translate={t}
      />

    <hr />

    <p><x-small> Built on: {VITE_BUILD_DATE} </x-small></p>
    </div>
  );
}  

// loading component for suspense fallback
const Loader = () => (
  <div className="App">
    <img 
      src={logo} 
      className="App-logo" 
      alt="logo" 
      style={{ width: '20vw', height: 'auto' }} 
    />
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
