// src/ResizeObserverPolyfill.js

const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const polyfillResizeObserver = () => {
  const observer = window.ResizeObserver;
  window.ResizeObserver = class ResizeObserver extends observer {
    constructor(callback) {
      super(debounce(callback, 20));
    }
  };
};
