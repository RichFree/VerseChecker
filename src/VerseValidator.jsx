import { useState } from "react";
import "./VerseValidator.css"

const VerseValidator = ({ element: { pack, title, chapterTitle, reference, verse } }) => {
  const [inputVerse, setVerse] = useState('')
  const [verseBool, setVerseBool] = useState(false)
  const [inputTitle, setTitle] = useState('')
  const [titleBool, setTitleBool] = useState(false)
  const [inputChapterTitle, setChapterTitle] = useState('')
  const [chapterTitleBool, setChapterTitleBool] = useState(false)
  const[hintBool, setHintBool] = useState(false)

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




  let result = "";

  if (chapterTitle) {
    if (chapterTitleBool && titleBool && verseBool) {
      result = "Correct"
    } else {
      result = ""
    }
  } else {
    if (titleBool && verseBool) {
      result = "Correct"
    } else {
      result = ""
    }
  }
  return (
    <div className="VerseValidator">
      <h2>{pack} - {reference}</h2>

      {chapterTitle && (
        <>
          <label className="main-title-box-label" htmlFor="chapterTitleBox">
            Input Chapter Title:
          </label>
          <textarea
            className="chapter-title-box"
            type="text"
            id="chapterTitleBox"
            name="chapterTitleBox"
            onChange={chapterTitleChange}
          />
        </>
      )}

      <label className="title-box-label" htmlFor="titleBox">
        Input Title:
      </label>
      <textarea
        className="title-box"
        type="text"
        id="titleBox"
        name="titleBox"
        onChange={titleChange}
      />

      <label className="verse-box-label" htmlFor="verseBox">
        Input Verse:
      </label>
      <textarea
        className="verse-box"
        type="text"
        id="verseBox"
        name="verseBox"
        onChange={verseChange}
      />

      <ul>{result}</ul>

      <button onClick={() => setHintBool(!hintBool)}>Show Answer:</button>

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