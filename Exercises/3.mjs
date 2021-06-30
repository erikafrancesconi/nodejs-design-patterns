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
  if (number < 50) {
    return callback("Wrong input, number should be >= 50");
  }

  const emitter = new EventEmitter();
  let ticks = 0,
    ms = 0;

  const ticktick = () => {
    ticks++;
    emitter.emit("tick");
    ms += 50;
    if (ms < number) {
      return setTimeout(ticktick, 50);
    }
    return callback(null, ticks);
  };

  setTimeout(ticktick, 50);

  return emitter;
};

ticker(1000, (err, ticks) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Ticked ${ticks} times`);
}).on("tick", () => console.log("Ticked"));
