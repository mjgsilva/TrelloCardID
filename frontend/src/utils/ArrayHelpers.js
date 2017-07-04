import moment from 'moment';

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
  return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
}

/**
 * Array utils
 * Update objects date (Immutable)
 *
 * @param {array} arr - array of generic values
 * @returns {array} new array updated
 */
export function changeDates(arr) {
  return arr.map(entry => {
    const descDay = moment(entry.day).format('D, MMM');
    return { ...entry, day: descDay };
  });
}
