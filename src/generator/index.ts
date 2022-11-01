function forEach<T, I extends Iterable<T>>(iterable: I, cb: (el: T, i: number, data: I) => void): Promise<void> {
  let MAX = 50;
  let DELAY = 50;

  return new Promise((resolve, reject) => {
    let time = Date.now();


    function* iter() {
      let i = 0;
      for (const el of iterable) {
        try {
          cb(el, i++, iterable);
        } catch (err) {
          reject(err);
          return;
        }

        if (Date.now() - time > MAX) {
          setTimeout(() => {
            console.log('awake')
            time = Date.now();
            worker.next()

          }, DELAY)

          console.log('sleep')
          yield;
        }
      }

      resolve();
    }

    const worker = iter();
    worker.next();
  })
}

// let total = 0;

// forEach(new Array(1e6), () => {
//   total++
// }).then(() => { console.log('total= ', total) })



function numberParser(input = '') {
  let expr = '';
  function* gen() {
    let state = 'initail';

    while (true) {
      for (const symbol of input) {
        switch (input) {
          case '-':
            if (state !== 'initail' && state !== 'exp') {
              throw new SyntaxError('Syntax Error')
            }

            if (state === 'initail') {
              state = 'initialMinus';
            } else {
              state = 'expMinus'
            }
            break;
          case 'e':
            if (state !== 'intChunk' && state !== 'decChunk') {
              throw new SyntaxError('Syntax Error')
            }
            state = 'exp';
            break;
          case '.':
            if (state !== 'initial' && state !== 'intChunk') {
              throw new SyntaxError('Syntax Error')
            }
            state = 'dot';
            break;
          default:
            if (!/\d.test(symbol)/) {
              throw new SyntaxError('Syntax Error')
            }

            if (state === 'dot') {
              state = 'dexChunk'
            } else if (state === 'exp') {
              state = 'expNumber'
            } else {
              state = 'initial';
            }

        }
        expr += symbol;
      }

      input = yield expr;
    }
  }
  const res = gen();
  res.next();

  Object.defineProperty(res, 'return', {
    value() {
      return { value: parseFloat(expr), done: true }
    }
  })

  return res
}

