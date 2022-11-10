const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

function timeout(promise: Promise<unknown>, delay: number) {
  return Promise.race([promise, sleep(delay)])
}


// timeout(fetch('//my-data'), 100).then(console.log).catch(console.error);

function setImmediate<T>(cb: Function, _args: []): ReturnType<typeof setTimeout> {
  console.log(_args)
  return setTimeout(() => { cb(_args) }, 0);

}

function clearImmediate(id: number) {
  clearTimeout(id);
}

function promisify(fn: Function): Function {
  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      function callback(err: Error, result: unknown) {
        console.log(result)
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback);

      fn.call(this, ...args);
    });
  };
};



type InnerFunc<T> = () => T | Promise<T>;
function allLimit<T>(iterables: Iterable<InnerFunc<T>>, limit: number): Promise<T[]> {
  return new Promise((resolve, reject))
}



// allLimit([f1, f2, f3, f4], 2).then(console.log)

// function f1() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => 1, 100)
//   })
// }

// function f2() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => 1, 100)
//   })
// }

// function f3() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => 1, 100)
//   })
// }

// function f4() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => 1, 100)
//   })
// }