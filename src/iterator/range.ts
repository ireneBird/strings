
// extends number ? number : string
export class Range<T extends string | number>{
  protected min: T;
  protected max: T;
  protected type: 'string' | 'number';

  constructor(min: T, max: T) {
    if (min === undefined || max === undefined) {
      throw new Error('params are not sending');
    }

    this.min = min < max ? min : max;
    this.max = min > max ? min : max;
    this.type = typeof min == 'number' ? 'number' : 'string';
  }

  [Symbol.iterator](): IterableIterator<T extends number ? number : string> {
    return this.values();
  }

  values(): IterableIterator<T extends number ? number : string> {
    const type = this.type;

    const minCode = type == 'number' ? this.min : this.min.toString().codePointAt(0);
    const maxCode = type == 'number' ? this.max : this.max.toString().codePointAt(0);

    let cur = minCode && minCode - 1;
    return {
      [Symbol.iterator](): IterableIterator<T extends number ? number : string> {
        return this
      },

      next(): IteratorResult<T extends number ? number : string> {

        if (cur != undefined && maxCode && cur < maxCode) {
          cur++;
          let ans = type == 'number' ? cur : String.fromCodePoint(cur);
          return { done: false, value: ans }
        }
        return { done: true, value: null }

      }
    }
  }

  reverse() {
    const type = this.type;

    const minCode = type == 'number' ? this.min : this.min.toString().codePointAt(0);
    const maxCode = type == 'number' ? this.max : this.max.toString().codePointAt(0);

    let cur = maxCode && maxCode + 1;
    return {
      [Symbol.iterator](): IterableIterator<T extends number ? number : string> {
        return this
      },

      next(): IteratorResult<T extends number ? number : string> {

        if (cur != undefined && minCode && cur > minCode) {
          cur--;
          let ans = type == 'number' ? cur : String.fromCodePoint(cur);
          return { done: false, value: ans }
        }
        return { done: true, value: null }
      }
    }
  }
}