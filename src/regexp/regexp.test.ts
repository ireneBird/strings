import { calc, format, reMulti, reqExpSplit } from './index';

describe('Testing Regexp', () => {

  it('should split str for .,; and multy whitespaces', () => {
    expect('foo    bla.bar,gd;4'.split(reqExpSplit)).toStrictEqual(['foo', 'bla', 'bar', 'gd', '4']);
    expect('foo    bla.    bar,gd;4'.split(reqExpSplit)).toStrictEqual(['foo', 'bla', 'bar', 'gd', '4']);
  })

  it('format func', () => {
    expect(format('Hello, ${user}! Your age is ${age}.', { user: 'Bob', age: 10 })).toStrictEqual('Hello, Bob! Your age is 10.')
  })

  it('delete repeated charsing in string', () => {
    expect('aaaabbbbczzzz'.replace(reMulti, '$1')).toStrictEqual('aabbczz');
    expect('abababbbabcabc'.replace(reMulti, '$1')).toStrictEqual('abbabc');
    expect('foofoobabaaaazze'.replace(reMulti, '$1')).toStrictEqual('foobaaze')
  })

  it('func must to calculate all math operations in string', () => {
    expect(calc(`
Какой-то текст (10 + 15 - 24) ** 2
Еще какой то текст 2 * 10
`)).toStrictEqual(`
Какой-то текст 1
Еще какой то текст 20
`);
  });
})
