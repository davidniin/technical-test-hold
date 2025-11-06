
export const selectElement = (selector, context = document) => {
  return context.querySelector(selector);
};

export const selectAllElements = (selector, context = document) => {
  return Array.from(context.querySelectorAll(selector));
};

export const onEvent = (element, eventName, callback, options) => {
  if (!element) return () => {};
  element.addEventListener(eventName, callback, options);
  return () => element.removeEventListener(eventName, callback, options);
};

export const showElement = (element) => {
  if (!element) return;
  element.hidden = false;
};

export const hideElement = (element) => {
  if (!element) return;
  element.hidden = true;
};