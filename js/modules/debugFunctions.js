/**
 * @module debugFunctions
 * 
 * Returns arguments data type
 * @param {*} data 
 * @returns {String} - arguments data type
 */
export function getDataType(data) {
  return {}.toString.call(data).split(' ')[1].slice(0, -1).toLowerCase();
}