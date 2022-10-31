// Необходимо написать регулярное выражение, которое при вызове test на строке будет давать false, если в строке есть символы отличные от латинских, цифр, подчеркивания и знака $

export const regExpStr = /^[\w\p{Number}$_]+$/u;

// Необходимо создать массив на основе строки, где раздилителем будут символы . , ; или пробелы (подряд идущие пробелы считаюся за один)

export const reqExpSplit = /[.,;\s]+/;

// Необходимо написать функцию, которая принимает строковый шаблон и объект параметров, и возвращает результат применения данных к этому шаблону
interface Params {
  [key: string]: any;
}

export function format(str: string, params: Params) {
  const reProp = /\$\{(\w+)\}/g;

  return str.replace(reProp, (...args) => {
    const subStr = params[args[1]];
    return subStr ? subStr.toString() : '';
  })
}


// Необходимо написать регулярное выражение, которое бы удаляла из строки любые дублирования подстрок из 1 - го, 2 - х или 3 - х символов, которые идут подряд
export const reMulti = /(.*)\1+/g;


// Нахождение арифметических операций в строке и замена на результат
export function calc(str: string) {
  const re = /[\d \*\(\)+-]{2,}/mg;
  return str.replaceAll(re, (...args) => {
    return ' ' + eval(args[0]);
  })
};