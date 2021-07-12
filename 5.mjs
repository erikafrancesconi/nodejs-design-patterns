// 5.1 Dissecting Promise.all()
// Implement your own version of Promise.all()
// leveraging promises, async/await, or a combination of the two.
// The function must be functionally equivalent to its original counterpart
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});
// const promise4 = new Promise((resolve, reject) => {
//   setTimeout(reject, 100, "Ma sticazzi?");
// });

const promiseEverything = async (promises) => {
  return new Promise(async (resolve, reject) => {
    const result = [];
    let resolved = 0;

    const resolvedFunction = (res, idx) => {
      result[idx] = res;
      if (++resolved === promises.length) {
        resolve(result);
      }
    };

    for (const p in promises) {
      if (typeof promises[p] !== "object") {
        resolvedFunction(promises[p], p);
      } else {
        promises[p]
          .then((res) => {
            resolvedFunction(res, p);
          })
          .catch((err) => reject(err));
      }
    }
  });
};

// Promise.all([promise1, promise2, promise3, promise4])
Promise.all([promise1, promise2, promise3])
  .then((values) => {
    console.log(values);
  })
  .catch((err) => console.log("Rejected:", err));

// promiseEverything([promise1, promise2, promise3, promise4])
promiseEverything([promise1, promise2, promise3])
  .then((values) => {
    console.log("Custom", values);
  })
  .catch((err) => console.log("Custom rejected:", err));

// 5.2 TaskQueue with promises:
// Migrate the TaskQueue class internals from
// promises to async/await where possible. Hint: you won't be able to use
// async/await everywhere

// La soluzione è nel file TaskQueueAsyncAwait.mjs

// 5.3 Producer-consumer with promises:
// Update the TaskQueuePC class
// internal methods so that they use just promises, removing any use of the
// async/await syntax. Hint: the infinite loop must become an asynchronous
// recursion. Beware of the recursive Promise resolution memory leak!

// La soluzione è nel file TaskQueuePCPromises.mjs

// 5.4 An asynchronous map():
// Implement a parallel asynchronous version
// of Array.map() that supports promises and a concurrency limit. The
// function should not directly leverage the TaskQueue or TaskQueuePC
// classes we presented in this chapter, but it can use the underlying patterns.
/**
 * @param iterable Array
 * @param callback receives as the input each item of the iterable (esactly like in the original Array.map()) and can return either a Promise or a simple value.
 * @param concurrency defines how many items in the iterable can be processed by callback in parallel at each given time
 */
const mapAsync = (iterable, callback, concurrency) => {};

const array1 = [1, 4, 9, 16];
const map1 = array1.map((x) => x * 2);
console.log("Original map", map1);
