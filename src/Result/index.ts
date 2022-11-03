
type Data<T> = T | Result<T>

export default class Result<T>{
  readonly error?: Error;

  protected readonly data?: T;

  constructor(fn: () => Data<T>) {
    try {
      const data = fn();

      if (data instanceof Result) {
        this.error = data.error;

        if (!this.error) {
          this.data = data.unwrap();
        }
      } else {
        this.data = data;
        this.error = undefined; //??
      }

    } catch (err) {
      console.log(err)
      this.error = err instanceof Error ? err : new Error('New error ' + String(err));
      console.log(this.error)
    }
  }

  unwrap(): T {
    if (this.error) {
      throw new Error('Operation Has Error');
    }

    return this.data!;
  }


  map<V>(cb: (data: T) => Data<V>): Result<V> {
    return new Result(() => {
      if (this.error) {
        throw 'some map error';
      }

      return cb(this.data!);
    });
  }

  flatMap<V>(cb: (val: Result<T>) => Result<V>): Result<V> {
    if (this.error) {
      throw 'some flatMap  error';
    }

    return this.map(cb);
  }


  catch<V>(cb: (err: Error) => Data<V>): Result<T | V> {
    return new Result(() => {
      if (this.error) {
        return cb(this.error);
      }
      return this.data;
    });
  }

  static error<V>(data: V): Result<V> {
    return new Result(() => {
      throw data;
    })
  }

  static ok<T>(data: T): Result<T> {
    return new Result(() => {
      return data;
    })
  }
};

