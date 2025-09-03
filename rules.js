const fs = require('node:fs');

module.exports = class CSVRules {
  constructor() {}

  hasOddNumberQuotes(line, tempLine) {
    const currLine = line.match(/\"/g)?.length || 0;
    const tLine = tempLine.match(/\"/g)?.length || 0;
    const totalQuotes = currLine + tLine;

    return totalQuotes % 2 === 1 ? true : false;
  }

  async validateFilePath(path) {
    if (!/(\.csv|\.CSV)$/.test(path)) {
      throw new Error('File must have .csv or .CSV extension');
    }

    try {
      await fs.promises.access(path, fs.constants.F_OK | fs.constants.R_OK);
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error('File does not exist');
      } else if (err.code === 'EACCES') {
        throw new Error('No read permission for this file');
      } else {
        throw new Error('Unable to access file: ' + err.message);
      }
    }

    const stats = await fs.promises.stat(path);

    if (!stats.isFile()) {
      throw new Error('Path is a directory, not a file');
    }

    return true;
  }

  isAllValuesEmpty(line, separator) {
    const regex = new RegExp(`^([${separator}]{1,})$`, 'g');

    return regex.test(line);
  }

  isBlankLine(line) {
    return !line;
  }
};
