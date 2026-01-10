import { useState, useEffect, useRef } from "react";
import "./VerseValidator.css";
import { StringDiff } from "react-string-diff";
import { containsKorean, jamoSubstringMatch } from './utils';

const STATE = {
  INCORRECT: 0,
  PARTIAL: 1,
  CORRECT: 2,
};


// function to render and handle logic of each of the cells
const VerseValidator = (
  { element: 
    { pack, title, chapterTitle, reference, verse },
    toHideReference,
    liveValidation,
    clearKey,
    t,
    index,
    onShowAnswer
  }) => {  // useful use of destructuring here
  const [inputReference, setReference] = useState('')
  const [referenceBool, setReferenceBool] = useState(STATE.INCORRECT)
  const [inputChapterTitle, setChapterTitle] = useState('')
  const [chapterTitleBool, setChapterTitleBool] = useState(STATE.INCORRECT)
  const [inputTitle, setTitle] = useState('')
  const [titleBool, setTitleBool] = useState(STATE.INCORRECT)
  const [inputVerse, setVerse] = useState('')
  const [verseBool, setVerseBool] = useState(STATE.INCORRECT)
  const [hintBool, setHintBool] = useState(false)
  const [diffBool, setDiffBool] = useState(false)
  const [isComposing, setIsComposing] = useState(false);
  const isInitialMount = useRef(true);

  // State for hint word counts
  const [referenceHintCount, setReferenceHintCount] = useState(0);
  const [titleHintCount, setTitleHintCount] = useState(0);
  const [chapterTitleHintCount, setChapterTitleHintCount] = useState(0);
  const [verseHintCount, setVerseHintCount] = useState(0);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      handleReset();
    }
  }, [clearKey]);

  useEffect(() => {
    // Re-run validation for all fields when liveValidation changes
    // Using current input values to re-evaluate their state
    validateReference(inputReference);
    validateChapterTitle(inputChapterTitle);
    validateTitle(inputTitle);
    validateVerse(inputVerse);
  }, [liveValidation]); // Dependency array: re-run effect when liveValidation changes

  // handle reset
  const handleReset = () => {
    setReference('');
    setReferenceBool(STATE.INCORRECT);
    setChapterTitle('');
    setChapterTitleBool(STATE.INCORRECT);
    setTitle('');
    setTitleBool(STATE.INCORRECT);
    setVerse('');
    setVerseBool(STATE.INCORRECT);
    setDiffBool(false); // optionally hide answer again
    setHintBool(false);
    // Reset hint counts
    setReferenceHintCount(0);
    setTitleHintCount(0);
    setChapterTitleHintCount(0);
    setVerseHintCount(0);
  };



  // Handle the start of composition
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  function resultChecker(string1, string2, liveValidation) {
    var result = STATE.INCORRECT; // init
    // contains korean
    if (containsKorean(string1)) {
      if (string1 === string2) {
        result = STATE.CORRECT;
      } else if (liveValidation && jamoSubstringMatch(string2, string1) & string1 !== "") {
        result = STATE.PARTIAL;
      } else {
        result = STATE.INCORRECT;
      }
    } else { // does not contain korean
      if (string1 === string2) {
        result = STATE.CORRECT;
      } else if (liveValidation && string2.startsWith(string1) & string1 !== "") {
        result = STATE.PARTIAL;
      } else {
        result = STATE.INCORRECT;
      }
    }
    return result;

  }

  // function to check correctness of reference input
  const validateReference = (value) => {
    const string1 = String(value)
      .replace(/\s+/g, "")
      .toLowerCase()
      .normalize("NFC");
    const string2 = String(reference)
      .replace(/\s+/g, "")
      .toLowerCase()
      .normalize("NFC");
    
    const result = resultChecker(string1, string2, liveValidation);

    setReferenceBool(result);
  };

  const referenceClassName = `reference-box${
    referenceBool === STATE.CORRECT ? " correct" : 
    referenceBool === STATE.PARTIAL ? " partial" : 
    " incorrect"
  }`;


  {/* function to check correctness of title input */}
  const validateTitle = (value) => {
    let string1 = value;
    let string2 = title;
    string1 = String(string1)
      .replace(/[\p{P}\p{S}]/gu, "") // Removes punctuation and symbols
      .replace(/\s+/g, "")            // Removes all whitespace
      .toLowerCase()
      .normalize("NFC");              // Normalizes to NFC form

    string2 = String(string2)
      .replace(/[\p{P}\p{S}]/gu, "")
      .replace(/\s+/g, "")
      .toLowerCase()
      .normalize("NFC");

    const result = resultChecker(string1, string2, liveValidation);
    setTitleBool(result);
  };



  const titleClassName = `chapter-title-box${
    titleBool=== STATE.CORRECT ? " correct" : 
    titleBool === STATE.PARTIAL ? " partial" : 
    " incorrect"
  }`;



  {/* function to check correctness of chapter title input */}
  const validateChapterTitle = (value) => {

    let string1 = value;
    let string2 = chapterTitle;
    string1 = String(string1)
      .replace(/[\p{P}\p{S}]/gu, "")
      .replace(/\s+/g, "")
      .toLowerCase()
      .normalize("NFC");

    string2 = String(string2)
      .replace(/[\p{P}\p{S}]/gu, "")
      .replace(/\s+/g, "")
      .toLowerCase()
      .normalize("NFC");

    const result = resultChecker(string1, string2, liveValidation);

    setChapterTitleBool(result);
  };

  const chapterTitleClassName = `title-box${
    chapterTitleBool=== STATE.CORRECT ? " correct" : 
    chapterTitleBool === STATE.PARTIAL ? " partial" : 
    " incorrect"
  }`;


  // check verse input
  const validateVerse = (value) => {
    let string1 = value;
    let string2 = verse;
    string1 = String(string1)
      .replace(/[\p{P}\p{S}]/gu, "")
      .replace(/\s+/g, "")
      .toLowerCase()
      .normalize("NFC");
    string2 = String(string2)
      .replace(/[\p{P}\p{S}]/gu, "")
      .replace(/\s+/g, "")
      .toLowerCase()
      .normalize("NFC");

    const result = resultChecker(string1, string2, liveValidation);

    setVerseBool(result);
  };

  const verseClassName = `verse-box${
    verseBool === STATE.CORRECT ? " correct" : 
    verseBool === STATE.PARTIAL ? " partial" : 
    " incorrect"
  }`;


  const DiffViewerStrict = ({oldValue, newValue}) => {
    const string1 = String(oldValue)
      .toLowerCase()
      .normalize("NFC");

    const string2 = String(newValue)
      .toLowerCase()
      .normalize("NFC");


    let diffStyle = {
      added: {
        backgroundColor: 'var(--background-color-added)'
      },
      removed: {
        backgroundColor: 'var(--background-color-removed)'
      },
      default: {}
    };


    return (<StringDiff 
      oldValue={string1} 
      newValue={string2} 
      diffMethod="diffWords" 
      styles={diffStyle}
      />)
  }


  return (
    <div className="VerseValidator">
      <div className="verse-number">
        <h3>Verse {index}</h3>
      </div>

      {/* toggle hiding reference */}
      {toHideReference ? (
        <div>
          <label className="reference-label">
            {t('verse_validator.input_reference')} 
          </label>
          <textarea
            className={referenceClassName}
            type="text"
            id="referenceBox"
            name="referenceBox"
            value={inputReference}
            onInput={(event) => {
              const value = event.target.value;
              setReference(value);
              if (!isComposing) {
                validateReference(value);
              }
            }}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={(event) => {
              const value = event.target.value;
              setIsComposing(false);
              setReference(value);
              validateReference(value);
            }}
          />
          {hintBool && (
            <div className="hint-area">
              <p className="hint-text">
                Hint: {reference.split(' ').slice(0, referenceHintCount).join(' ')}
              </p>
              <button
                onClick={() => setReferenceHintCount(prev => prev + 1)}
                disabled={referenceHintCount >= reference.split(' ').length}
              >
                Next Word
              </button>
            </div>
          )}
        </div>
      ) : (
        <h2>
          {reference}
        </h2>
      )}

      {/* toggle chapterTitle */}
      {chapterTitle && (
        <div>
          <label className="main-title-box-label">
            {t('verse_validator.input_chapter_title')} 
          </label>
          <textarea
            className={chapterTitleClassName}
            type="text"
            id="chapterTitleBox"
            name="chapterTitleBox"
            value={inputChapterTitle}
            onInput={(event) => {
              const value = event.target.value;
              setChapterTitle(value);
              if (!isComposing) {
                validateChapterTitle(value);
              }
            }}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={(event) => {
              const value = event.target.value;
              setIsComposing(false);
              setChapterTitle(value);
              validateChapterTitle(value);
            }}
          />
          {hintBool && (
            <div className="hint-area">
              <p className="hint-text">
                Hint: {chapterTitle.split(' ').slice(0, chapterTitleHintCount).join(' ')}
              </p>
              <button
                onClick={() => setChapterTitleHintCount(prev => prev + 1)}
                disabled={chapterTitleHintCount >= chapterTitle.split(' ').length}
              >
                Next Word
              </button>
            </div>
          )}
        </div>
      )}

      {/* input box for title */}
      <div>
        <label className="title-box-label">
          {t('verse_validator.input_title')} 
        </label>
        <textarea
          className={titleClassName}
          type="text"
          id="titleBox"
          name="titleBox"
          value={inputTitle}
          onInput={(event) => {
            const value = event.target.value;
            setTitle(value);
            if (!isComposing) {
              validateTitle(value);
            }
          }}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={(event) => {
            const value = event.target.value;
            setIsComposing(false);
            setTitle(value);
            validateTitle(value);
          }}
        />
        {hintBool && (
          <div className="hint-area">
            <p className="hint-text">
              Hint: {title.split(' ').slice(0, titleHintCount).join(' ')}
            </p>
            <button
              onClick={() => setTitleHintCount(prev => prev + 1)}
              disabled={titleHintCount >= title.split(' ').length}
            >
              Next Word
            </button>
          </div>
        )}
      </div>

      {/* input box for verse */}
      <div>
        <label className="verse-box-label">
          {t('verse_validator.input_verse')} 
        </label>
        <textarea
          className={verseClassName}
          type="text"
          id="verseBox"
          name="verseBox"
          value={inputVerse}
          onInput={(event) => {
            const value = event.target.value;
            setVerse(value);
            if (!isComposing) {
              validateVerse(value);
            }
          }}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={(event) => {
            const value = event.target.value;
            setIsComposing(false);
            setVerse(value);
            validateVerse(value);
          }}
        />
        {hintBool && (
          <div className="hint-area">
            <p className="hint-text">
              Hint: {verse.split(' ').slice(0, verseHintCount).join(' ')}
            </p>
            <button
              onClick={() => setVerseHintCount(prev => prev + 1)}
              disabled={verseHintCount >= verse.split(' ').length}
            >
              Next Word
            </button>
          </div>
        )}
      </div>

      {/* buttons to toggle per-block functionality*/}
      <div className="verse-validator-button-box">
        {/* hint button*/}
        <button onClick={() => setHintBool(!hintBool)}>
            {hintBool ? 'Hide Hints' : 'Show Hints'}
        </button>
        {/* show answer button*/}
        <button onClick={() => {
            // Toggle the diff display
            setDiffBool(prev => !prev);
            // If it's being turned ON, and onShowAnswer is provided, call it.
            // We only want to count when the user explicitly reveals the answer.
            if (!diffBool && onShowAnswer) {
                onShowAnswer({ pack, title, reference });
            }
        }}>Show Answer</button>
        {/* reset button*/}
        <button onClick={handleReset}>Reset</button>
      </div>

      {/* This shows the difference between given and input answers*/}
      {diffBool && (
        <div className="diff-box">
          <h3>Differences</h3>


          <p></p>
          <div>
            Pack: <br></br>{pack}
          </div>

          <p></p>
          <div>
            Reference: 
            <DiffViewerStrict 
              oldValue={reference} 
              newValue={inputReference} 
            />
          </div>


          <p></p>
          {chapterTitle && (
            <div>
              Chapter title:
              <DiffViewerStrict
                oldValue={chapterTitle}
                newValue={inputChapterTitle}
              />
            </div>
          )}

          <p></p>
          <div>
            Title: 
            <DiffViewerStrict 
              oldValue={title} 
              newValue={inputTitle} 
            />
          </div>

          <p></p>
          <div>
            Verse: 
            <DiffViewerStrict 
              oldValue={verse} 
              newValue={inputVerse} 
            />
            </div>
          </div>
      )}
    </div>
  );

}

export default VerseValidator