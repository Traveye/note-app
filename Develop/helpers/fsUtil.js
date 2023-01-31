const fs = require('fs');
const util = require('util');

const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nNote added to ${destination}`)
  );


const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      err ? console(err) : (() => {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      })

    });
  };

  module.exports = { readFromFile, writeToFile, readAndAppend };
