import { isGenerator } from './helpers';

type GeneratorFn<T> = () => Generator<T>;

export default function exec<T>(generatorFn: GeneratorFn<T>): Promise<any> {
  const generator: Generator<T> = generatorFn();

  //Checking on for generator is provide
  if (!isGenerator(generator)) {
    return Promise.reject(new Error('It\'s not a generator'))
  }

  return (function resolve(result: IteratorResult<any, any>): any {
    if (result.done) {
      return Promise.resolve(result.value)
    }

    return Promise.resolve(result.value)
      .then(data => resolve(generator.next(result.value))) //for each yeild
      .catch(err => resolve(generator.throw(err))) //for errors
  })(generator.next());
}