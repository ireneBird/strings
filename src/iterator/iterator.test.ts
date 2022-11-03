import { enumerate, filter, mapSeq, random, seq, take, zip } from '.'
import Range from './range';
import assert from "assert";

describe('Testing iterators', () => {
  it('should return random number', () => {
    const iterRandom = random(1, 100);

    const rnd1 = iterRandom.next();
    assert.strictEqual(rnd1.value >= 1 && rnd1.value <= 100, true);

    const rnd2 = iterRandom.next();
    assert.strictEqual(rnd2.value >= 1 && rnd2.value <= 100, true);

  })

  it("Should return an iterator over the given number of its elements ", function () {
    expect([...take([1, 2, 4, 5, 6, 7, 8], 5)]).toStrictEqual([1, 2, 4, 5, 6]);
    expect([...take([1, 2], 5)]).toStrictEqual([1, 2]);
  });

  it("Should returns an iterator over the elements that satisfy the predicate", function () {
    const arr = [1, 5, 47, 74, 24, 68, 4, 35, 45];
    expect([...take(filter(arr, (i: number) => i > 10), 5)]).toStrictEqual([47, 74, 24, 68, 35]);
  });

  it("Should returns an iterator over pairs of (iteration number, element)", function () {
    const arr = [1, 5, 47, 74, 24, 68, 4, 35, 45];
    expect([...take(enumerate(arr), 5)]).toStrictEqual([[0, 1], [1, 5], [2, 47], [3, 74], [4, 24]]);
  });

  it('Function seq shouls output iterable values', () => {
    expect([...seq([1, 2], new Set([3, 4]), 'bla')]).toStrictEqual([1, 2, 3, 4, 'b', 'l', 'a'])
  })

  it("Returns an iterator over tuples of their elements", function () {
    expect([...zip([1, 2], new Set([5, 6]), 'ab')]).toStrictEqual([[1, 5, 'a'], [2, 6, 'b']]);
  });

  it("Should change all iterators by callbaks", () => {
    const callbacks = [
      (el: number) => el * 2,
      (el: number) => el - 1
    ];
    expect([...mapSeq([1, 2, 3], callbacks)]).toStrictEqual([1, 3, 5]);
  });


})