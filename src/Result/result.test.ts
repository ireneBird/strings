import exec from './exec';


describe('exec core', () => {
  test('Waits for values', () => {
    return exec(function* () {
      yield Promise.resolve('a')
        .then((res: any) => expect(res).toBe('a'))
    });
  });

  test('Catches the errors', () => {
    return exec(function* () {
      const err = new Error('New Error');

      try {
        yield Promise.resolve('a')
          .then((res: any) => expect(res).toBe('a'));

        yield Promise.resolve('b')
          .then((res: any) => expect(res).toBe('b'));

        const c = yield Promise.reject(err);
      } catch (error) {
        expect(error).toBe(err);
      }

      yield Promise.resolve(123)
        .then(res => expect(res).toBe(123))

    });
  });

  test('Ends the function if the error is not captured', () => {
    const err = new Error('WOOOOW');

    return exec(function* () {
      yield Promise.resolve('a')
        .then((res: any) => expect(res).toBe('a'));

      yield Promise.resolve('b')
        .then((res: any) => expect(res).toBe('b'));
    }).catch((error) => {
      expect(error).toBe(err);
    });
  });

  test('Returns a promise with the returned value', () => {
    return exec(function* () {
      const value = yield Promise.resolve(5);

      return value;
    }).then((value) => {
      expect(value).toBe(5);
    });
  });
});