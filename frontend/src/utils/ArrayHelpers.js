/**
 * Array utils
 * Update array (Immutable)
 *
 * @param {array} arr - array of generic values
 * @param {number} idx - index
 * @param {number} value - value/index
 *
 * @returns {array} new array updated
 */
export function removeArr(arr, idx) {
  return [
    ...arr.slice(0, idx),
    ...arr.slice(idx + 1)
  ];
}
