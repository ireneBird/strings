function on(sourse: DOMPoint, event: string) {
  return {
    [Symbol.asyncIterator]() {
      return this;
    },

    next() {
      return new Promise.resolve()
    }
  }
}