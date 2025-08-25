const fs = require('node:fs');

module.exports = class CSVRules {
  constructor() {}

  hasOddNumberQuotes(line, tempLine) {
    const currLine = line.match(/\"/g)?.length || 0;
    const tLine = tempLine.match(/\"/g)?.length || 0;
    const totalQuotes = currLine + tLine;

    return totalQuotes % 2 === 1 ? true : false;
  }

  isFileExtensionAccepted(path) {
    const hasRequiredExtension = /(.csv|.CSV)$/.test(path);

    if (!hasRequiredExtension) {
      console.log("This file doesn't have the required extension");

      throw new Error("This file doesn't have the required extension");
    }
  }

  isValidPath(path) {
    const existsPath = fs.access(path, fs.constants.F_OK);

    if (!existsPath) {
      console.log("This path doesn't exists.");

      throw new Error("This path doesn't exists.");
    }
  }

  isAllValuesEmpty(line, separator) {
    const regex = new RegExp(`^([${separator}]{1,})$`, 'g');

    return regex.test(line);
  }

  isBlankLine(line) {
    return !line;
  }
};
