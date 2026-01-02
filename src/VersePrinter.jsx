import { useState } from "react";
import "./VersePrinter.css";
import { StringDiff } from "react-string-diff";
import { containsKorean, jamoSubstringMatch } from './utils';

const STATE = {
  INCORRECT: 0,
  PARTIAL: 1,
  CORRECT: 2,
};

 

// function to render and handle logic of each of the cells
const VersePrinter = ({ element: { pack, title, chapterTitle, reference, verse } , t, index}) => {  // useful use of destructuring here


  return (
    <div className="VersePrinter">
      <div className="verse-number">
        <h3>Verse {index}</h3>
      </div>

      {/* This shows the difference between given and input answers*/}
      <div className="diff-box">

        <p></p>
        <div>
          <h3>Pack:</h3>
          <p>{pack}</p>
        </div>

        <p></p>
        <div>
          <h3>Reference:</h3>
          <p>{reference}</p>
        </div>

        <p></p>
        {chapterTitle && (
          <div>
            <h3>Chapter Title:</h3>
            <p>{chapterTitle}</p>
          </div>
        )}

        <p></p>
        <div>
          <h3>Title:</h3>
          <p>{title}</p>
        </div>

        <p></p>
        <div>
          <h3>Verse: </h3>
          <p>{verse}</p>
          </div>
        </div>
    </div>
  );

}

export default VersePrinter