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

