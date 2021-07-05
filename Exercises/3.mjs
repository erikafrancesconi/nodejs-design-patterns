// 3.1 A simple event
// Modify the asynchronous FindRegex class so that it emits
// an event when the find process starts, passing the input files list as
// an argument. Hint: beware of Zalgo!
import { EventEmitter } from "events";
import { readFile } from "fs";

class FindRegex extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
    this.files = [];
  }

  addFile(file) {
    this.files.push(file);
    return this;
  }

  find() {
    this.emit("findstarted", this.files);

    for (const file of this.files) {
      readFile(file, "utf-8", (err, content) => {
        if (err) {
          return this.emit("error", err);
        }

        this.emit("fileread", file);

        const match = content.match(this.regex);
        if (match) {
          match.forEach((elem) => this.emit("found", file, elem));
        }
      });
    }
    return this;
  }
}

const findRegexInstance = new FindRegex(/hello \w+/);
findRegexInstance
  .addFile("fileA.txt")
  .addFile("fileB.json")
  .on("findstarted", (files) => console.log(`Find started in ${files}`))
  .find()
  .on("found", (file, match) =>
    console.log(`Matched "${match}" in file ${file}`)
  )
  .on("error", (err) => console.error(`Error emitted ${err.message}`));

// 3.2 Ticker
// Write a function that accepts a number and a callback as the
// argument. The function will return an EventEmitter that emits an event
// called tick every 50 milliseconds until the number of milliseconds is passed
// from the invocation of the function. The function will also call the callback
// when the number of milliseconds has passed, providing, as the result, the total
// count of tick events emitted. Hint: you can use setTimeout() to schedule
// another setTimeout() recursively.
const ticker = (number, callback) => {
  const emitter = new EventEmitter();

  if (number < 50) {
    callback("Wrong input, number should be >= 50");
    return emitter;
  }

  if (Date.now() % 5 === 0) {
    // 3.4
    process.nextTick(() => emitter.emit("error", "Timestamp divisible by 5"));
    callback("Timestamp divisible by 5");
    return emitter;
  }

  process.nextTick(() => emitter.emit("tick")); // 3.3

  let ticks = 0,
    ms = 0;

  const ticktick = () => {
    if (Date.now() % 5 === 0) {
      // 3.4
      process.nextTick(() => emitter.emit("error", "Timestamp divisible by 5"));
      callback("Timestamp divisible by 5");
      return emitter;
    }

    ticks++;
    emitter.emit("tick");
    ms += 50;
    if (ms < number) {
      return setTimeout(ticktick, 50);
    }
    callback(null, ticks);
    return emitter;
  };

  setTimeout(ticktick, 50);

  return emitter;
};

ticker(10000, (err, ticks) => {
  if (err) {
    console.error(`Caught error ${err}`);
    return;
  }
  console.log(`Ticked ${ticks} times`);
})
  .on("tick", () => console.log("Ticked"))
  .on("error", (err) => console.error(err));

// 3.3 A simple modification
// Modify the function created in exercise 3.2 so that
// it emits a tick event immediately after the function is invoked

// 3.4 Playing with errors
// Modify the function created in exercise 3.3 so that
// it produces an error if the timestamp at the moment of a tick (including the
// initial one that we added as part of exercise 3.3) is divisible by 5. Propagate
// the error using both the callback and the event emitter. Hint: use Date.now()
// to get the timestamp and the ramainder (%) operator to check whetger the
// timestamp is divisible by 5.
