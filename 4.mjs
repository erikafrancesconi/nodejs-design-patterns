import { appendFile, readFile, readdir, lstatSync } from "fs";
import { TaskQueue } from "./libs/TaskQueue.mjs";

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

  const checkFile = (file) => {
    if (lstatSync(file).isFile()) {
      fileList.push(file);
    } else {
      listNestedFiles(file, cb, file);
    }
  };

  readdir(dir, (err, files) => {
    if (err) {
      return cb(err);
    }

    files.forEach((file) => checkFile(`${dir}/${file}`));

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

// 4.3 Recursive find
// Write recursiveFind(), a callback-style function that
// takes a path to a directory in the local filesystem and a keyword
// The function must find all the text files within the given directory that
// contain the give keyword in the file contents. The list of matching files
// should be returned using the callback when the search is completed. If no
// matching file is found, the callback  must be invoked with an empty array.
// 4.3.1 Bonus points if you make the search recursive (it looks for the text files in any
// subdirectory as well).
// 4.3.2 Extra bonus points if you manage to perform the
// search within different files and subdirectories in parallel, but be careful to
// keep the number of parallel tasks under control!
const getFiles = (dir, cb) => {
  let fileList = [],
    subdirs = 0;

  readdir(dir, (err, files) => {
    if (err) {
      return cb(err);
    }

    files.forEach((file) => {
      if (lstatSync(`${dir}/${file}`).isFile()) {
        fileList.push(`${dir}/${file}`);
      } else {
        // 4.3.1
        subdirs++;
        getFiles(`${dir}/${file}`, (err, fileListSubDir) => {
          if (err) {
            return cb(err);
          }

          fileList = fileList.concat(fileListSubDir);
          subdirs--;

          if (subdirs === 0) {
            return cb(null, fileList);
          }
        });
      }
    });

    if (subdirs === 0) {
      return cb(null, fileList);
    }
  });
};

const searchFile = (file, keyword, cb) => {
  readFile(file, "utf-8", (err, data) => {
    if (err) {
      return cb(err);
    }

    if (data.indexOf(keyword) >= 0) {
      filesWithString.push(file);
    }
    return cb();
  });
};

const searchDir = (dir, keyword, cb) => {
  getFiles(dir, (err, files) => {
    if (err) {
      return cb(err);
    }

    files.forEach((file) => {
      queue.pushTask((done) => {
        searchFile(file, keyword, done);
      });
    });
  });
};

const filesWithString = [];
console.time("Recursive Find");

const queue = new TaskQueue(2);
queue.on("error", console.error);
queue.on("empty", () => {
  console.log("String found in files:", filesWithString);
  console.timeEnd("Recursive Find");
});

searchDir("/home/erika/testdir", "hello", (err) => console.error);
