export default function <A extends any[], R>(fn: (...args: A) => R, time: number) {
  let timerId: NodeJS.Timeout | undefined;

  return function (...args: A) {
    if (timerId) clearTimeout(timerId);

    return new Promise((resolve) => {
      timerId = setTimeout(() => resolve(fn(...args)), time);
    });
  };
}
