export function random(min: number, max: number): IterableIterator<number> {
  return {
    [Symbol.iterator](): IterableIterator<number> {
      return this;
    },
    next(): IteratorResult<number> {
      return {
        done: false,
        value: Math.floor(Math.random() * ((max - min) + min))
      }
    }
  }
};


export function take<T>(iterObj: Iterable<T>, quantity: number): IterableIterator<T> {
  let cur = 0;
  const iterator = iterObj[Symbol.iterator]();
  return {
    [Symbol.iterator](): IterableIterator<T> {
      return this;
    },

    next(): IteratorResult<T> {
      if (quantity === cur++) {
        return { done: true, value: iterator.next() }
      }
      return iterator.next()
    }
  }
}



export function filter<T>(iterObj: Iterable<T>, cb: Function): IterableIterator<T> {
  const iterator = iterObj[Symbol.iterator]();

  return {
    [Symbol.iterator](): IterableIterator<T> {
      return this;
    },
    next(): IteratorResult<T> {

      let el = iterator.next();

      while (!el.done && !cb(el.value)) {
        el = iterator.next()
      }
      return el;
    }
  }
}


// console.log([...take(filter(randomInt, (el) => el > 30), 15)]);

export function enumerate<T>(iterObj: Iterable<T>): IterableIterator<[number, T]> {
  const iterator = iterObj[Symbol.iterator]();
  let i = 0;
  return {
    [Symbol.iterator](): IterableIterator<[number, T]> {
      return this;
    },

    next(): IteratorResult<[number, T]> {
      const el = iterator.next()
      while (!el.done) {
        return { done: false, value: [i++, el.value] }
      }

      return { done: true, value: null }
    }
  }
}

// const randomInt = random(0, 120);
// console.log([...take(enumerate(randomInt), 3)]);

