import axios from 'axios';
export const pending = new Map();

/**
 * @param config
 */
export const addPending = (config) => {
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
export const removePending = (config) => {
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

export const clearPending = () => {
  pending.forEach((url) => {
    const cancel = (url) => pending.get(url);
    cancel(url);
  });
  pending.clear();
};
