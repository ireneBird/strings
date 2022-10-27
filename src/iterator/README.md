# Итераторы

#### 1. Итератор для генерации случайных чисел по заданным параметрам

```js
const randomInt = random(0, 100);

console.log(randomInt.next());
console.log(randomInt.next());
console.log(randomInt.next());
console.log(randomInt.next());
```
#### 2. Функция take принимает любой Iterable объект и возвращает итератор по заданному количеству его элементов


```js
const randomInt = random(0, 100);

console.log([...take(randomInt, 15)]);
```

#### 3. Функция filter принимает любой Iterable объект и функцию-предикат и возвращает итератор по элементам, которые удовлетворяют предикату


```js
const randomInt = random(0, 100);

console.log([...take(filter(randomInt, (el) => el > 30), 15)]);
```

#### 4. Функция enumerate принимает любой Iterable объект и возввращает итератор по парам (номер итерации, элемент)

```js
const randomInt = random(0, 100);

console.log([...enumerate(randomInt, 3)]); // [[0, ...], [1, ...], [2, ...]]
```

#### 5. Класс позволяет создавать диапазоны чисел или символов, а также обходить элементы Range с любого конца


```js
const symbolRange = new Range('a', 'f');

console.log(Array.from(symbolRange)); // ['a', 'b', 'c', 'd', 'e', 'f']

const numberRange = new Range(-5, 1);

console.log(Array.from(numberRange.reverse())); // [1, 0, -1, -2, -3, -4, -5]
```

#### 6. Функция принимает множество Iterable объектов и возвращает итератор по их элементам


```js
console.log(...seq([1, 2], new Set([3, 4]), 'bla')); // 1, 2, 3, 4, 'b', 'l', 'a'
```

#### 7. Функция принимает множество Iterable объектов и возвращает итератор по кортежам их элементов


```js
console.log(...zip([1, 2], new Set([3, 4]), 'bl')); // [[1, 3, b], [2, 4, 'l']]
```

#### 8. Функциция принимает любой Iterable объект и Iterable с функциями и возвращает итератор где каждому элементу левого Iterable псоледовательно применяются все функции из правого


```js
console.log(...mapSeq([1, 2, 3], [(el) => el * 2, (el) => el - 1])); // [1, 3, 5]
```

