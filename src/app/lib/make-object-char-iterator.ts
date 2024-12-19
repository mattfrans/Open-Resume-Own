import { deepClone } from "lib/deep-clone";

type Object = { [key: string]: any };

/**
 * makeObjectCharIterator is a generator function that iterates a start object to
 * match an end object state by iterating through each string character.
 *
 * Note: Start object and end object must have the same structure and same keys.
 *       And they must have string or array or object as values.
 *
 * @example
 * const start = {a : ""}
 * const end = {a : "abc"};
 * const iterator = makeObjectCharIterator(start, end);
 * iterator.next().value // {a : "a"}
 * iterator.next().value // {a : "ab"}
 * iterator.next().value // {a : "abc"}
 */
export function* makeObjectCharIterator<T extends Object>(
  start: T,
  end: T,
  level = 0
) {
  const object: Object = level === 0 ? deepClone(start) : start;
  
  for (const [key, endValue] of Object.entries(end)) {
    if (Array.isArray(endValue)) {
      // Initialize array if it doesn't exist
      if (!object[key]) {
        object[key] = [];
      }
      
      // Handle array of objects
      for (let i = 0; i < endValue.length; i++) {
        if (i >= object[key].length) {
          object[key].push(typeof endValue[i] === 'object' ? {} : '');
        }
        
        if (typeof endValue[i] === 'object' && !Array.isArray(endValue[i])) {
          const recursiveIterator = makeObjectCharIterator(
            object[key][i],
            endValue[i],
            level + 1
          );
          while (true) {
            const next = recursiveIterator.next();
            if (next.done) break;
            yield deepClone(object) as T;
          }
        } else {
          object[key][i] = endValue[i];
          yield deepClone(object) as T;
        }
      }
    } else if (typeof endValue === "object" && endValue !== null) {
      // Initialize object if it doesn't exist
      if (!object[key]) {
        object[key] = {};
      }
      
      const recursiveIterator = makeObjectCharIterator(
        object[key],
        endValue,
        level + 1
      );
      while (true) {
        const next = recursiveIterator.next();
        if (next.done) break;
        yield deepClone(object) as T;
      }
    } else if (typeof endValue === "string") {
      if (!object[key]) {
        object[key] = "";
      }
      for (let i = 1; i <= endValue.length; i++) {
        object[key] = endValue.slice(0, i);
        yield deepClone(object) as T;
      }
    }
  }
}

export const countObjectChar = (object: Object) => {
  let count = 0;
  for (const value of Object.values(object)) {
    if (typeof value === "string") {
      count += value.length;
    } else if (typeof value === "object") {
      count += countObjectChar(value);
    }
  }
  return count;
};
