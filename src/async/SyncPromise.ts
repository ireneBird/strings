
class UncaughtSyncPromiseError extends Error {
  constructor(err: any) {
    super(err);
    this.stack = `(in syncPromise) ${err.stack}`;
  }
}

const PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected';

function isPromise(p: any) {
  return p && typeof p.then === 'function';
}

// @ts-expect-error
function addReject(prom: Promise<any>, reject) {
  prom.then(null, reject)
}


export class SyncPromise {

  private value: number = 0;
  private state: string = PENDING;
  private thenCbs: Function[] = []
  private catchCbs: Function[] = []
  private onSuccessBind = this.onSuccess.bind(this);
  private onFailBind = this.onFail.bind(this);

  constructor(executionFunction: Function) {
    try {
      executionFunction(this.onSuccessBind, this.onFailBind);
    } catch (err) {
      this.onFail(err)
    }
  }

  private transist(val: any, state: string) {
    this.value = val;
    this.state = state

    if (state === REJECTED && !this.catchCbs.length) {
      throw val
    }

    if (state === FULFILLED) {
      this.thenCbs.forEach((cb: Function) => cb(this.value));
      this.thenCbs = []
    }

    if (state === REJECTED) {
      this.catchCbs.forEach((cb: Function) => cb(this.value));
      this.catchCbs = []
    }
  }


  private onSuccess(value: any): void {
    if (this.state !== PENDING) return;

    if (value instanceof SyncPromise) {
      value.then(this.onSuccessBind, this.onFailBind);
      return;
    }

    // if (this.thenCbs.length === 0) {
    //   // throw new UncaughtSyncPromiseError(this.value)
    // } else 
    if (isPromise(value)) {
      addReject(value.then(this.onFailBind), this.onSuccessBind);
    } else {
      this.transist(value, FULFILLED);
    }
  }

  private onFail(reason: any) {
    if (this.state !== PENDING) return;

    if (reason instanceof SyncPromise) {
      reason.then(this.onSuccessBind, this.onFailBind)
      return
    }

    // if (this.catchCbs.length === 0) {
    //   throw new UncaughtSyncPromiseError(this.value)
    // } else 
    if (isPromise(reason)) {
      addReject(reason.then(this.onFail), this.onFail);
    } else {
      this.transist(reason, REJECTED);
    }
  }


  then(thenCb?: Function, catchCb?: Function) {
    let self = this;
    // if (this.hasResolvedSync) {
    //   throw new Error('Cannot call "then" on synchronously resolved promise')
    // }

    // @ts-expect-error
    return new SyncPromise((resolve, reject) => {
      let rej = (catchCb && typeof catchCb == 'function') ? catchCb : reject;

      let settle = () => {
        try {
          resolve(thenCb ? thenCb(self.value) : self.value);
        } catch (e) {
          rej(e)
        }
      }

      if (this.state === FULFILLED) {
        settle();
      } else if (this.state === REJECTED) {
        rej(this.value);
      } else {
        this.thenCbs.push(settle);
        this.catchCbs.push(rej);
      }
    })

  }

  catch(cb: Function) {
    return this.then(undefined, cb)
  }


  finally(cb) {
    return this.then(
      result => {
        cb();
        return result;
      },
      result => {
        cb();
        throw result;
      }
    )
  }

  static resolve<T>(value: T) {
    return new SyncPromise((resolve: (arg0: T) => any) => resolve(value))
  }


  static reject(reason?: any) {
    return new SyncPromise((resolve: any, reject: (arg0: any) => any) => reject(reason))
  }

  static all(promises: Iterable<SyncPromise>) {
    const results: any[] = [];
    // @ts-expect-error
    return new SyncPromise((resolve, reject) => {

      for (let myPromise of promises) {
        myPromise
          .then((val: any) => {
            results.push(val);
          })
          .catch(reject)
      }
      resolve(results);
    })

  }


  static allSettled(promises: Iterable<SyncPromise>) {
    const results: any[] = [];
    // @ts-expect-error
    return new SyncPromise((resolve) => {
      for (let myPromise of promises) {
        myPromise
          .then((value: any) => results.push({ status: FULFILLED, value }))
          .catch((reason: any) => results.push({ status: REJECTED, reason }))

      }
      resolve(results)
    })

  }

  static race(promises: Iterable<SyncPromise>) {
    const promisesArray = [...promises];
    // @ts-expect-error
    return new SyncPromise((resolve, reject) => {
      promisesArray.forEach(promise => {
        promise.then(resolve).catch(reject)
      })
    })
  }

  static any(promises: Iterable<SyncPromise>) {
    const promisesArray = [...promises];
    let errors: Error[] = [];
    let rejectedPromises = 0;
    // @ts-expect-error
    return new SyncPromise((resolve, reject) => {
      for (let i = 0; i < promisesArray.length; i++) {
        const promise = promisesArray[i]
        promise.then(resolve).catch((value: any) => {
          rejectedPromises++
          errors[i] = value
          if (rejectedPromises === promisesArray.length) {
            reject(new AggregateError(errors, "All promises were rejected"))
          }
        })
      }
    })
  }

}


// function syncPromise({ value = 'DEFAULT_VALUE', fail = false } = {}) {
//   return new SyncPromise((resolve: (arg0: any) => any, reject: (arg0: string) => any) => {
//     fail ? reject(value) : resolve(value)
//   })
// }


// SyncPromise.any([syncPromise({ fail: true }), syncPromise({ fail: true })]).then(console.log).catch(console.log);
// console.log(3)

// SyncPromise.resolve(2).then(console.log)