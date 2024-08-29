import { useState } from "react";
import "./VerseValidator.css";
import { StringDiff } from "react-string-diff";
import { containsKorean, jamoSubstringMatch } from './jamoUtils';

const STATE = {
  INCORRECT: 0,
  PARTIAL: 1,
  CORRECT: 2,
};

// function to render and handle logic of each of the cells
const VerseValidator = ({ element: { pack, title, chapterTitle, reference, verse } , toHideReference, t}) => {  // useful use of destructuring here

  const [inputReference, setReference] = useState('')
  const [referenceBool, setReferenceBool] = useState(STATE.INCORRECT)
  const [inputChapterTitle, setChapterTitle] = useState('')
  const [chapterTitleBool, setChapterTitleBool] = useState(STATE.INCORRECT)
  const [inputTitle, setTitle] = useState('')
  const [titleBool, setTitleBool] = useState(STATE.INCORRECT)
  const [inputVerse, setVerse] = useState('')
  const [verseBool, setVerseBool] = useState(STATE.INCORRECT)
  const[hintBool, setHintBool] = useState(false)
  const[diffBool, setDiffBool] = useState(false)
  const [isComposing, setIsComposing] = useState(false);



  // Handle the start of composition
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  function resultChecker(string1, string2) {
    var result = STATE.INCORRECT; // init
    // contains korean
    if (containsKorean(string1)) {
      if (string1 === string2) {
        result = STATE.CORRECT;
      } else if (jamoSubstringMatch(string2, string1) & string1 !== "") {
        result = STATE.PARTIAL;
      } else {
        result = STATE.INCORRECT;
      }
    } else { // does not contain korean
      if (string1 === string2) {
        result = STATE.CORRECT;
      } else if (string2.startsWith(string1) & string1 !== "") {
        result = STATE.PARTIAL;
      } else {
        result = STATE.INCORRECT;
      }
    }
    return result;

  }

  // function to check correctness of reference input
  const referenceChange = (e) => {
    const value = e.target.value;
    const string1 = String(value)
      .replace(/\s+/g, "")
      .toLowerCase()
      .normalize("NFC");
    const string2 = String(reference)
      .replace(/\s+/g, "")
      .toLowerCase()
      .normalize("NFC");
    
    const result = resultChecker(string1, string2);

    setReference(value);
    setReferenceBool(result);
  };

  const referenceClassName = `reference-box${
    referenceBool === STATE.CORRECT ? " correct" : 
    referenceBool === STATE.PARTIAL ? " partial" : 
    " incorrect"
  }`;




  {/* function to check correctness of title input */}
  const titleChange = (e) => {
    const value = e.target.value;
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


    const result = resultChecker(string1, string2);


    setTitle(value);
    setTitleBool(result);
  };
  const titleClassName = `chapter-title-box${
    titleBool=== STATE.CORRECT ? " correct" : 
    titleBool === STATE.PARTIAL ? " partial" : 
    " incorrect"
  }`;



  {/* function to check correctness of chapter title input */}
  const chapterTitleChange = (e) => {


    const value = e.target.value;
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

    const result = resultChecker(string1, string2);

    setChapterTitle(value);
    setChapterTitleBool(result);
  };
  const chapterTitleClassName = `title-box${
    chapterTitleBool=== STATE.CORRECT ? " correct" : 
    chapterTitleBool === STATE.PARTIAL ? " partial" : 
    " incorrect"
  }`;


  // check verse input
  const verseChange = (e) => {
    const value = e.target.value;
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

    const result = resultChecker(string1, string2);

    setVerse(value);
    setVerseBool(result);
  };

  const verseClassName = `verse-box${
    verseBool === STATE.CORRECT ? " correct" : 
    verseBool === STATE.PARTIAL ? " partial" : 
    " incorrect"
  }`;


  // const DiffViewer = ({oldValue, newValue}) => {
  //   const string1 = String(oldValue)
  //     .replace(/[\p{P}\p{S}]/gu, "")
  //     .toLowerCase()
  //     .normalize("NFC");


  //   const string2 = String(newValue)
  //     .replace(/[\p{P}\p{S}]/gu, "")
  //     .toLowerCase()
  //     .normalize("NFC");

  //   return (<StringDiff oldValue={string1} newValue={string2} diffMethod="diffWords" />)
  // }

  const DiffViewerStrict = ({oldValue, newValue}) => {
    const string1 = String(oldValue)
      .toLowerCase()
      .normalize("NFC");

    const string2 = String(newValue)
      .toLowerCase()
      .normalize("NFC");

    return (<StringDiff oldValue={string1} newValue={string2} diffMethod="diffWords" />)
  }


  return (
    <div className="VerseValidator">
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
            onChange={(event) => {
              
              if (!isComposing) {
                referenceChange(event);
              }
            }}
          />
        </div>
      ) : (
        <h2>
          {pack} - {reference}
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
            onChange={(event) => {
              if (!isComposing) {
                chapterTitleChange(event);
              }
            }}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={(event) => {
              setIsComposing(false);
              chapterTitleChange(event);
            }}

          />
        </div>
      )}

      {/* input box for title */}
      <label className="title-box-label">
        {t('verse_validator.input_title')} 
      </label>
      <textarea
        className={titleClassName}
        type="text"
        id="titleBox"
        name="titleBox"
        onChange={(event) => {
          if (!isComposing) {
            titleChange(event);
          }
        }}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={(event) => {
          setIsComposing(false);
          titleChange(event);
        }}

      />

      {/* input box for verse */}
      <label className="verse-box-label">
        {t('verse_validator.input_verse')} 
      </label>
      <textarea
        className={verseClassName}
        type="text"
        id="verseBox"
        name="verseBox"
        onChange={(event) => {
          if (!isComposing) {
            verseChange(event);
          }
        }}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={(event) => {
          setIsComposing(false);
          verseChange(event);
        }}


      />

      {/* button to toggle show answer*/}
      <div className="answer-button-box">
        {/* <button onClick={() => setHintBool(!hintBool)}>Show Answer:</button> */}
        <button onClick={() => setDiffBool(!diffBool)}>Show Answer:</button>
      </div>

      {/* This shows the difference between given and input answers*/}
      {diffBool && (
        <div className="diff-box">
          <h3>Differences</h3>

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
              ChapterTitle:
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