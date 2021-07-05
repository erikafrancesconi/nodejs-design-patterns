import { appendFile, readFile } from "fs";

// 4.1: File concatenation
// write the implementation of concatFiles(), a
// callback-style function that takes two or more paths to text files in the
// filesystem and a destination file.
// This function must copy the contents of every source file into the destination
// file, respecting the order of the files, as provided by the arguments list.
const concatFiles = (dest, cb, ...srcFiles) => {
  const iterate = (index) => {
    if (index === srcFiles.length) {
      return cb();
    }

    readFile(srcFiles[index], "utf8", (err, data) => {
      if (err) {
        return cb(err);
      }

      appendFile(dest, data, () => {
        iterate(index + 1);
      });
    });
  };
  iterate(0);
};

concatFiles(
  "files/dest.txt",
  (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("Finished");
  },
  "files/fileA.txt",
  "files/fileB.json"
);
