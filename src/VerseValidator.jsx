import { useState } from "react";
import "./VerseValidator.css";
import { StringDiff } from "react-string-diff";


// function to render and handle logic of each of the cells
const VerseValidator = ({ element: { pack, title, chapterTitle, reference, verse } , toHideReference, t}) => {  // useful use of destructuring here

  const [inputReference, setReference] = useState('')
  const [referenceBool, setReferenceBool] = useState(false)
  const [inputChapterTitle, setChapterTitle] = useState('')
  const [chapterTitleBool, setChapterTitleBool] = useState(false)
  const [inputTitle, setTitle] = useState('')
  const [titleBool, setTitleBool] = useState(false)
  const [inputVerse, setVerse] = useState('')
  const [verseBool, setVerseBool] = useState(false)
  const[hintBool, setHintBool] = useState(false)
  const[diffBool, setDiffBool] = useState(false)


  // function to check correctness of verse input
  // so far only perform checking on full spelling of reference names
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
    const bool = (string1 === string2);

    setReference(value);
    setReferenceBool(bool);
  };

  {/* function to check correctness of verse input */}
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

    const bool = string1 === string2;

    setVerse(value);
    setVerseBool(bool);
  };

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

    const bool = string1 === string2;

    setTitle(value);
    setTitleBool(bool);
  };


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

    const bool = string1 === string2;

    setChapterTitle(value);
    setChapterTitleBool(bool);
  };

  const DiffViewer = ({oldValue, newValue}) => {
    const string1 = String(oldValue)
      .replace(/[\p{P}\p{S}]/gu, "")
      .toLowerCase()
      .normalize("NFC");


    const string2 = String(newValue)
      .replace(/[\p{P}\p{S}]/gu, "")
      .toLowerCase()
      .normalize("NFC");

    return (<StringDiff oldValue={string1} newValue={string2} diffMethod="diffWords" />)
  }

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
            className={`reference-box${referenceBool ? " correct" : ""}`}
            type="text"
            id="referenceBox"
            name="referenceBox"
            onChange={referenceChange}
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
            className={`chapter-title-box${chapterTitleBool ? " correct" : ""}`}
            type="text"
            id="chapterTitleBox"
            name="chapterTitleBox"
            onChange={chapterTitleChange}
          />
        </div>
      )}

      {/* input box for title */}
      <label className="title-box-label">
        {t('verse_validator.input_title')} 
      </label>
      <textarea
        className={`title-box${titleBool ? " correct" : ""}`}
        type="text"
        id="titleBox"
        name="titleBox"
        onChange={titleChange}
      />

      {/* input box for verse */}
      <label className="verse-box-label">
        {t('verse_validator.input_verse')} 
      </label>
      <textarea
        className={`verse-box${verseBool ? " correct" : ""}`}
        type="text"
        id="verseBox"
        name="verseBox"
        onChange={verseChange}
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
              <DiffViewer
                oldValue={chapterTitle}
                newValue={inputChapterTitle}
              />
            </div>
          )}

          <p></p>
          <div>
            Title: 
            <DiffViewer 
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