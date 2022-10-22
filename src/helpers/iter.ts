function iter(str: string): IterableIterator<string> {
  let cur = 0;
  let chars = Array.from(str);


  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      const data = chars[cur];
      const done = chars.length === cur++;

      return { done, value: data }

    }
  }
}
