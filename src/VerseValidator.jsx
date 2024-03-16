import { useState } from "react";
import "./VerseValidator.css"

// function to render and handle logic of each of the cells
const VerseValidator = ({ element: { pack, title, chapterTitle, reference, verse } }) => {  // useful use of destructuring here
  const [inputVerse, setVerse] = useState('')
  const [verseBool, setVerseBool] = useState(false)
  const [inputTitle, setTitle] = useState('')
  const [titleBool, setTitleBool] = useState(false)
  const [inputChapterTitle, setChapterTitle] = useState('')
  const [chapterTitleBool, setChapterTitleBool] = useState(false)
  const[hintBool, setHintBool] = useState(false)

  {/* function to check correctness of verse input */}
  const verseChange = (e) => {
    const value = e.target.value;
    let string1 = value;
    let string2 = verse;
    string1 = String(string1)
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();
    string2 = String(string2)
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();

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
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();
    string2 = String(string2)
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();

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
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();
    string2 = String(string2)
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();

    const bool = string1 === string2;

    setChapterTitle(value);
    setChapterTitleBool(bool);
  };


  return (
    <div className="VerseValidator">
      <h2>{pack} - {reference}</h2>

      {chapterTitle && (
        <div>
        <label className="main-title-box-label" htmlFor="chapterTitleBox">
          Input Chapter Title:
        </label>
        <textarea
          className={`chapter-title-box${chapterTitleBool ? ' correct' : ''}`}
          type="text"
          id="chapterTitleBox"
          name="chapterTitleBox"
          onChange={chapterTitleChange}
        />
        </div>
      )}

      {/* input box for title */}
      <label className="title-box-label" htmlFor="titleBox">
        Input Title:
      </label>
      <textarea
        className={`title-box${titleBool ? ' correct' : ''}`}
        type="text"
        id="titleBox"
        name="titleBox"
        onChange={titleChange}
      />

      {/* input box for verse */}
      <label className="verse-box-label" htmlFor="verseBox">
        Input Verse:
      </label>
      <textarea
        className={`verse-box${verseBool ? ' correct' : ''}`}
        type="text"
        id="verseBox"
        name="verseBox"
        onChange={verseChange}
      />
      
      {/* button to toggle show answer*/} 
      <button onClick={() => setHintBool(!hintBool)}>Show Answer:</button>

      {/* This shows the answers*/} 
      {hintBool && (
        <>
          <h3>{chapterTitle}</h3>
          <h4>{title}</h4>
          <p>{verse}</p>
        </>
      )}
    </div>
  );

}

export default VerseValidator