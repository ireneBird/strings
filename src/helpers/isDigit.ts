type RangeNum = [number, number];

enum UnicodeNumeralRange {
  ASCII,
  DEVANAGARI,
  BENGALI,
  GURMUKHI,
  THAI,
  ROMAN,
  BRAHMI,
};

const ranges: RangeNum[] = [
  [0x30, 0x39],
  [0x966, 0x96F],
  [0x9E6, 0x9EF],
  [0xA66, 0xA6F],
  [0xE50, 0xE59],
  [0x2160, 0x216F],
  [0x11066, 0x1106F],
];


export function isDigit(value: string): boolean {
  const arr = value.split('');
  if (arr[0] === '-') arr.shift();

  const letter = arr[0].codePointAt(0);
  if (!letter) return false;

  const alphabetIndex = getAlphabet(letter);
  if (alphabetIndex === null) return false;

  const [min, max] = ranges[alphabetIndex];

  for (let letter of arr) {
    const code = letter.codePointAt(0);
    if (code == null || code < min || code > max) {
      return false;
    }
  }
  return true
}

function getAlphabet(codePoint: number, arr: RangeNum[] = ranges): UnicodeNumeralRange | null {

  const middle = Math.floor(arr.length / 2);
  const [min, max] = arr[middle];

  if (min <= codePoint && codePoint <= max) {
    return middle;
  }

  if (arr.length <= 1) return null;

  const itIsLeft = arr[middle][0] > codePoint;

  const res = getAlphabet(codePoint, itIsLeft ? arr.slice(0, middle) : arr.slice(middle));
  return res !== null ? res + (itIsLeft ? 0 : middle) : res;
}
