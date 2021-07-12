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
