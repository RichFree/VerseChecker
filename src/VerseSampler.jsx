/* 
Implemented features:
- read keys from json
- create checklist from keys
*/
import fullVerseData from "./assets/verse.json" // the actual verse json data file
import { useState, useEffect, useMemo } from "react";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import _ from 'underscore';
import './VerseSampler.css'
import VerseValidator from "./VerseValidator";
import VersePrinter from "./VersePrinter";
import { useTranslation } from 'react-i18next';
import logo from './assets/droplet.svg';
import { Suspense } from "react";


const ArrayTester = ({ array, toHideReference, liveValidation, clearKey, translate}) => {
  const list = array.map((element, index) => (
    // key needs to be unique; chose 3 elements that will separate all elements
    <VerseValidator 
      key={element.pack + element.title + element.reference}
      element={element} 
      toHideReference={toHideReference} 
      liveValidation={liveValidation}
      clearKey={clearKey} // Pass clearKey down
      t={translate} // this passes the t i18 object to the function
      index={index + 1}
    />
  ))
  return list
}


const ArrayPrinter = ({ array, translate}) => {
  const list = array.map((element, index) => (
    // key needs to be unique; chose 3 elements that will separate all elements
    <VersePrinter 
      key={element.pack + element.title + element.reference}
      element={element} 
      t={translate} // this passes the t i18 object to the function
      index={index + 1}
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
  const RefreshButton = ({ onClick, disabled }) => {
    return <button onClick={onClick} disabled={disabled}>Shuffle</button>;
  };
  // refresh variables where incrementing state forces refresh
  const [shuffleKey, setShuffleKey] = useState(0);
  const handleShuffle = () => {
    // Increment the key to force a re-render
    setShuffleKey(shuffleKey => shuffleKey + 1);
  };

  // New state for clearing all inputs
  const [clearKey, setClearKey] = useState(0);
  const handleClearAll = () => {
    setClearKey(clearKey => clearKey + 1);
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
  const [testCount, setTestCount] = useState(30)
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
    // additional state change to disable HideReference when shuffling
    if (!toShuffle) {
      setHideReference(false);
    }
    // Toggle the state when the checkbox is changed
    // modify state at the end
    setShuffle(!toShuffle);
  };

  // state for toReview
  const [toReview, setReview] = useState(false);
  // Function to handle checkbox change
  const handleReviewCheckboxChange = () => {
  // additional state change to disable HideReference when reviewing
    if (!toReview) {
      setHideReference(false);
    }
    // Toggle the state when the checkbox is changed
    // modify state at the end
    setReview(!toReview);
  };


  // state for toHideReference
  const [toHideReference, setHideReference] = useState(false);
  // Function to handle checkbox change
  const handleHideReferenceCheckboxChange = () => {
    if (!toHideReference) {
      setHideReference(false);
    }
    // Toggle the state when the checkbox is changed
    setHideReference(!toHideReference);
  };

  // state for liveValidation
  const [liveValidation, setLiveValidation] = useState(true);
  // Function to handle checkbox change
  const handleLiveValidationCheckboxChange = () => {
    // Toggle the state when the checkbox is changed
    setLiveValidation(!liveValidation);
  };

  // generate testList using cached state that depends only on shuffle-dependent variables
  // this fixes the bug where changing other state causes a re-shuffle
  const testList = useMemo(() => {
    if (!VerseData || checked.length === 0) {
      return [];
    }
    let list = checked.reduce(
      (accumulator, currentValue) => accumulator.concat(VerseData[currentValue]),
      []
    );
    return toShuffle ? _.sample(list, testCount) : _.first(list, testCount);
  }, [VerseData, checked, testCount, toShuffle, shuffleKey]);


  
  return (
    <div className="App">
      <h1>{t('main.title')}</h1>
      <h2>{t('main.pick_lang')}</h2>

      <div className="lang-bar">
        <button type="button" onClick={() => changeLanguage('en')}>English</button>
        <button type="button" onClick={() => changeLanguage('kn')}>Korean</button>
      </div>

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
        {t('main.set_review')} 
        <input
          type="checkbox"
          checked={toReview}
          onChange={handleReviewCheckboxChange}
        />
      </h2>
      <p>{t('main.note_set_review')}</p>


      <h2>
        {t('main.set_shuffle')} 
        <input
          type="checkbox"
          checked={toShuffle}
          onChange={handleShuffleCheckboxChange}
        />
      </h2>
      <p>{t('main.note_set_shuffle')}</p>

      <div className={(toShuffle || toReview) ? 'setting-disabled' : ''}>
        <h2>
          {t('main.hide_reference')}
          <input
            type="checkbox"
            checked={toHideReference}
            onChange={handleHideReferenceCheckboxChange}
            disabled={toShuffle || toReview}
          />
        </h2>
        <p>{t('main.note_hide_reference')}</p>
      </div>

      <div className={toReview ? 'setting-disabled' : ''}>
        <h2>
          {t('main.live_validation')}
          <input
            type="checkbox"
            checked={liveValidation}
            onChange={handleLiveValidationCheckboxChange}
            disabled={toReview}
          />
        </h2>
        <p>{t('main.note_live_validation')}</p>
      </div>


      <h2>{t('main.pick_pack')}</h2>
      <CheckboxWidget
        nodes={t('nodes', { returnObjects: true })}
        checked={checked}
        expanded={expanded}
        setChecked={setChecked}
        setExpanded={setExpanded}
      />

      <h2>{t('main.tools')}</h2>
      <div className="tool-bar">
        <RefreshButton onClick={handleShuffle} disabled={!toShuffle} />
        <button onClick={handleClearAll}>Clear All</button>
      </div>

      <h1>{t('main.verses')}</h1>
      {toReview ?
        <ArrayPrinter
          array={testList}
          translate={t}
        /> :
        <ArrayTester
          array={testList}
          toHideReference={toHideReference}
          liveValidation={liveValidation}
          clearKey={clearKey} // Pass clearKey down
          translate={t}
        />
      }

    <hr />

    <p><x-small> Built on: {VITE_BUILD_DATE} </x-small></p>
    <p>
      <x-small>
        <a href="https://github.com/RichFree/VerseChecker/issues">File a bug report</a>
      </x-small>
    </p>
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
