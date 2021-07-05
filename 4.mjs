import { appendFile, readFile, readdir, lstatSync } from "fs";
import { dirname } from "path";

// 4.1: File concatenation
// write the implementation of concatFiles(), a
// callback-style function that takes two or more paths to text files in the
// filesystem and a destination file.
// This function must copy the contents of every source file into the destination
// file, respecting the order of the files, as provided by the arguments list.
const concatFiles = (dest, cb, ...srcFiles) => {
  if (srcFiles.length === 0) {
    return process.nextTick(cb);
  }

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
    // console.log("Finished");
  },
  "files/fileA.txt",
  "files/fileB.json"
);

// 4.2 List files recursively
// Write listNestedFiles(), a callback-style function
// that takes, as the input, the path to a directory in the local filesystem and that
// asynchronously iterates over all the subdirectories to eventually return a list
// of all the files discovered.
// Bonus points if you manage to avoid callback hell. Feel free to create
// additional helper functions if needed.
const listFiles = (dir, cb) => {
  const fileList = [];

  readdir(dir, (err, files) => {
    if (err) {
      return cb(err);
    }

    files.forEach((file) => {
      if (lstatSync(`${dir}/${file}`).isFile()) {
        fileList.push(`${dir}/${file}`);
      } else {
        listNestedFiles(`${dir}/${file}`, cb, `${dir}/${file}`);
      }
    });

    return cb(null, fileList);
  });
};

const listNestedFiles = (dir, cb) => {
  const done = (err, files) => {
    if (err) {
      return cb(err);
    }
    return cb(err, files, dir);
  };

  listFiles(dir, done);
};

const listAll = () => {
  let allFiles = [];

  listNestedFiles("/home/erika/testdir", (err, files) => {
    if (err) {
      return console.error(err);
    }

    if (files.length > 0) {
      allFiles = allFiles.concat(files);
      console.log(allFiles);
    }
  });
};

listAll();
