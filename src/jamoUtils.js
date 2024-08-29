const BASE_CODE = 44032;
const CHO = 588;
const JUNG = 28;

const cho = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const jung = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const jong = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

// Decompose the medial vowel into individual components, if necessary
const jungSplit = {
  "ㅘ": ["ㅗ", "ㅏ"],
  "ㅙ": ["ㅗ", "ㅐ"],
  "ㅚ": ["ㅗ", "ㅣ"],
  "ㅝ": ["ㅜ", "ㅓ"],
  "ㅞ": ["ㅜ", "ㅔ"],
  "ㅟ": ["ㅜ", "ㅣ"],
  "ㅢ": ["ㅡ", "ㅣ"],
};

// decompose ending consonents
const jongSplit = {
  "ㄲ": ["ㄱ", "ㄱ"],
  "ㄳ": ["ㄱ", "ㅅ"],
  "ㄵ": ["ㄴ", "ㅈ"],
  "ㄶ": ["ㄴ", "ㅎ"],
  "ㄺ": ["ㄹ", "ㄱ"],
  "ㄻ": ["ㄹ", "ㅁ"],
  "ㄼ": ["ㄹ", "ㅂ"],
  "ㄽ": ["ㄹ", "ㅅ"],
  "ㄾ": ["ㄹ", "ㅌ"],
  "ㄿ": ["ㄹ", "ㅍ"],
  "ㅀ": ["ㄹ", "ㅎ"],
  "ㅄ": ["ㅂ", "ㅅ"],
  "ㅆ": ["ㅅ", "ㅅ"],
}

export function decomposeHangul(character) {
  const code = character.charCodeAt(0) - BASE_CODE;
  
  if (code < 0 || code > 11171) {
    // Return character as is if it's not a Hangul syllable
    return character;
  }

  const choIndex = Math.floor(code / CHO);
  const jungIndex = Math.floor((code - (choIndex * CHO)) / JUNG);
  const jongIndex = code % JUNG;

  // Decompose cho, jung, and jong
  const choJamo = cho[choIndex];
  const jungJamo = jung[jungIndex];
  const jongJamo = jong[jongIndex];

  // Handle double jamo in jung
  const jungComponents = jungSplit[jungJamo] || [jungJamo];


  // handle double jamo in jong
  const jongComponents = jongSplit[jongJamo] || [jongJamo];

  return [choJamo, ...jungComponents, ...jongComponents].join('');
}

export function decomposeStringToJamo(inputString) {
  return inputString.split('').map(decomposeHangul).join('');
}

export function jamoSubstringMatch(mainString, substring) {
  const decomposedMain = decomposeStringToJamo(mainString)
      .replace(/\s+/g, "");
  const decomposedSub = decomposeStringToJamo(substring)
      .replace(/\s+/g, "");
  
  return decomposedMain.startsWith(decomposedSub);
}

// Unicode Ranges for Korean Characters:
//     Hangul Syllables: \uAC00-\uD7A3
//     Hangul Jamo: \u1100-\u11FF (for initial consonants, vowels, and final consonants)
//     Hangul Compatibility Jamo: \u3130-\u318F
export function containsKorean(text) {
  const koreanRegex = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;
  return koreanRegex.test(text);
}