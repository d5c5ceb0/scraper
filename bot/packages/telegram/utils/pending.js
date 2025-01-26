const axios = require('axios');
const pending = new Map();

/**
 * @param config
 */
const addPending = (config) => {
  const url = [
    config.method,
    config.url,
    JSON.stringify(config.params),
    JSON.stringify(config.data),
  ].join('&');

  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pending.has(url)) {
        pending.set(url, cancel);
      }
    });
};

/**
 * @param config
 */
const removePending = (config) => {
  const url = [
    config.method,
    config.url,
    JSON.stringify(config.params),
    JSON.stringify(config.data),
  ].join('&');
  if (pending.has(url)) {
    const cancel = (url) => pending.get(url);
    cancel(url);
    pending.delete(url);
  }
};

const clearPending = () => {
  pending.forEach((url) => {
    const cancel = (url) => pending.get(url);
    cancel(url);
  });
  pending.clear();
};

module.exports = {
  pending,
  addPending,
  removePending,
  clearPending
}