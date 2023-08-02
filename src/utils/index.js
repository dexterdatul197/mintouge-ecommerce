/**
 * Store Object data into local storage
 *
 * @param {*} key An ID as a key
 * @param {*} data A data to be stored
 */
export const SetStorageObject = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Get an Object data from local storage
 *
 * @param {*} key An ID as a key
 * @returns A data read from local storage
 */
export const GetStorageObject = (key) => {
  const data = localStorage.getItem(key);

  return JSON.parse(data);
};

/**
 * Store Primitive data into local storage
 *
 * @param {*} key An ID as a key
 * @param {*} data A data to be stored
 */
export const SetStorageItem = (key, data) => {
  localStorage.setItem(key, data);
};

/**
 * Get a Primitive data from local storage
 *
 * @param {*} key An ID as a key
 * @returns A data read from local storage
 */
export const GetStorageItem = (key) => {
  return localStorage.getItem(key);
};
