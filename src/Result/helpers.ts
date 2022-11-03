export const isObject = (obj: any) => typeof obj === 'object' && obj !== null && !Array.isArray(obj);

export const isFunction = (func: any) => typeof func === 'function';

export const isGenerator = (obj: any) => isObject(obj) && isFunction(obj.next) && isFunction(obj.throw);