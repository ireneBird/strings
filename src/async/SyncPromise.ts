class UncaughtSyncPromiseError extends Error {
  constructor(err: any) {
    super(err);
    this.stack = `(in syncPromise) ${err.stack}`;
  }
}

const PENDING = 2,
  FULFILLED = 0, // We later abuse these as array indices
  REJECTED = 1;

function isPromise(p: any) {
  return p && typeof p.then === 'function';
}

function addReject(prom, reject) {
  prom.then(null, reject) // Use this style for sake of non-Promise thenables (e.g., jQuery Deferred)
}


export class SyncPromise {

  private value: number = 0;
  private state: number = PENDING;
  private thenCbs: [] = []
  private catchCbs: [] = []
  private onSuccessBind = this.onSuccess.bind(this);
  private onFailBind = this.onFail.bind(this);

  constructor(executionFunction: Function) {
    try {
      executionFunction(this.onSuccessBind, this.onFailBind);

    } catch (err) {
      this.onFail(err)
    }
  }

  private transist(val: any, state) {
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


  private onSuccess(val: any): void {
    if (this.state !== PENDING) return;

    // if (this.thenCbs.length === 0) {
    //   // throw new UncaughtSyncPromiseError(this.value)
    // } else 
    if (isPromise(val)) {
      addReject(val.then(this.onFailBind), this.onSuccessBind);
    } else {
      this.transist(val, FULFILLED);
    }
  }

  private onFail(reason: any) {
    // if (this.catchCbs.length === 0) {
    //   throw new UncaughtSyncPromiseError(this.value)
    // } else 
    if (isPromise(reason)) {
      addReject(reason.then(this.onFail), this.onFail);
    } else {
      this.transist(reason, REJECTED);
    }
  }


  then(thenCb, catchCb?) {
    let self = this;
    // if (this.hasResolvedSync) {
    //   throw new Error('Cannot call "then" on synchronously resolved promise')
    // }

    return new SyncPromise((resolve, reject) => {
      let rej = typeof catchCb == 'function' ? catchCb : reject;

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

  static resolve(value: any) {
    return new SyncPromise((resolve) => resolve(value))
  }


  static reject(value: any) {
    return new SyncPromise((resolve, reject) => reject(value))
  }
}





