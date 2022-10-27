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

export function seq<T>(...args: any): IterableIterator<T> {

  let index = 0;
  let innerIndex = 0;

  return {
    [Symbol.iterator](): IterableIterator<T> {
      return this;
    },

    next(): IteratorResult<T> {
      if ((index === args.length - 1) && innerIndex === [...args[index]].length) {
        return { done: true, value: null }
      }

      if (innerIndex >= [...args[index]].length) {
        index++;
        innerIndex = 0;
      }

      return {
        done: false, value: [...args[index]][innerIndex++],
      }
    }
  }
}
// 1, 2, 3, 4, 'b', 'l', 'a'
// console.log(...seq([1, 2], new Set([3, 4]), 'bla'));

export function zip<T>(...args: any): IterableIterator<T[] | null> {
  let iterators = args.map((arg: IterableIterator<T>) => arg[Symbol.iterator]());
  let state = 0;

  return {
    [Symbol.iterator](): IterableIterator<T[] | null> {
      return this;
    },

    next(): IteratorResult<T[] | null> {
      let ansArr: T[] = [];
      if (state === iterators.length - 1) {
        return { done: true, value: null }
      }

      iterators.map((iterator: IterableIterator<T>) => {

        const res = iterator?.next();

        if (res.done) {
          return res
        }

        if (res.value !== null) {
          ansArr.push(res.value)
        }

      })

      if (ansArr.length === 0) {
        return { done: true, value: null }
      }

      return { done: false, value: ansArr }
    }
  }
}


// console.log(...zip([1, 2], new Set([3, 4]), 'bl'));


export function mapSeq<T>(data: Iterable<T>, callbacks: Function[]): IterableIterator<T> {
  let current = data[Symbol.iterator]();
  return {
    [Symbol.iterator](): IterableIterator<T> {
      return this;
    },

    next(): IteratorResult<T> {

      const res = current.next();
      if (res.done) {
        return { done: true, value: null }
      }

      let ans = res.value
      callbacks.forEach((cb: Function) => ans = cb(ans));
      console.log(ans)

      return { done: false, value: ans }
    }
  }
}
// console.log(...mapSeq([1, 2, 3], [(el) => el * 2, (el) => el - 1])); // [1, 3, 5]