/**
 * @module globalFunctions
 * 
 */

/** 
 * Returns a random number
 * @param {Number} maxNum - Maximum number
 * @param {Number} minNum  - Minimum number
 * @returns {Number} random integer between minNum and maxNum
 */
export function getRandomNum(maxNum = 100, minNum = 0) {
  minNum = Math.ceil(minNum);
  maxNum = Math.floor(maxNum);
  return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
}

/**
 * Returns a random value from the provided array
 * @param {Array} itemArray - array of items
 * @returns {*} - random array item from itemArray
 */
export function getRandomArrayItem(itemArray) {
	return itemArray[Math.floor(Math.random()*itemArray.length)];
}

/**
 * Returns a random value according to the weighted chance provided. Weight values must sum up to 1
 * @param {Object} obj - the object to choose a random value from
 * @returns {*} - random value from obj
 */
export function getWeightedRandomObjItem(obj) {
  let i, sum=0, r=Math.random();
  for (i in obj) {
    sum += obj[i];
    if (r <= sum) return i;
  }
}

/**
 * Capitalises the provided string
 * @param {String} text - string to capitalise
 * @returns {String} - capitalised string
 */
export function capitalise(text) {
	let capitalisedText = text.charAt(0).toUpperCase() + text.slice(1);
  return capitalisedText;
}

/**
 * Checks an array for duplicate values. Does not remove duplicates
 * @param {Array} array - the array to check for duplicates
 * @returns {boolean} - returns true if the passed array has duplicate values
 */
export function hasDuplicates(array) {
  let set = new Set()
  return array.some(element => {
    if (set.has(element)) return true
    set.add(element)
  })
}