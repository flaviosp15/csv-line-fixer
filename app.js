const fs = require('node:fs');
const readline = require('node:readline/promises');
const CSVRules = require('./rules');

class App extends CSVRules {
  constructor() {
    super();
    this.path = null;
    this.reader = null;
    this.writer = null;
    this.terminal = null;
    this.changeSeparator = false;
    this.chooseSeparator = null;
    this.regex = {
      startsWithUnclosedQuote: /^"[^\r\n]+/,
      endsWithUnopenedQuote: /[^\r\n]+"$/,
      hasWordOrQuote: /["\w]+/,
      hasWord: /[\w]+/,
      multiSpaces: /\s{2,}/g,
      quoteSpaces: /"\s|\s"/g,
    };
    this.tempLine = '';
  }

  setInput(path) {
    this.reader = fs.createReadStream(path);
    console.log('Input: ', path);
  }
  setOutput(path) {
    const fixedFilePath = this.addPrefixInFileName(path, 'FIXED');

    console.log('Output: ', fixedFilePath);

    this.writer = fs.createWriteStream(fixedFilePath);
  }
  addPrefixInFileName(path, string) {
    return path.replace(/^(.*[\/|\\])([^\/]+)$/g, `$1${string}-$2`);
  }
  normalizeTextLine(prevPart, currPart) {
    const {
      startsWithUnclosedQuote: sUQ,
      endsWithUnopenedQuote: eUQ,
      hasWordOrQuote: hWQ,
      hasWord: hW,
      multiSpaces: mS,
      quoteSpaces: qS,
    } = this.regex;
    const noMultiSpaces = currPart.replace(mS, ' ');
    const stringWithSpace = `${prevPart} ${noMultiSpaces}`.replace(qS, '"');
    const stringWithoutSpace = `${prevPart}${currPart}`;
    const needSpace = (sUQ.test(prevPart) && eUQ.test(currPart)) || (hWQ.test(prevPart) && hW.test(currPart));

    return needSpace ? stringWithSpace : stringWithoutSpace;
  }

  process(path) {
    return new Promise((resolve, reject) => {
      const fileInterface = readline.createInterface({
        input: this.reader,
        output: this.writer,
        crlfDelay: Infinity,
      });

      console.log('Reading file at ', path);

      fileInterface.on('line', (line) => {
        const trimmedLine = line.trim();

        if (this.isBlankLine(trimmedLine) || this.isAllValuesEmpty(trimmedLine, this.separator)) {
          return;
        }

        if (this.hasOddNumberQuotes(trimmedLine, this.tempLine)) {
          this.tempLine = this.normalizeTextLine(this.tempLine, trimmedLine);

          return;
        }

        this.tempLine = this.normalizeTextLine(this.tempLine, trimmedLine);

        this.writer.write(`${this.tempLine}\n`);

        this.tempLine = '';

        return;
      });

      fileInterface.on('close', () => {
        console.log('Finished! The file has been read.');
        resolve();
      });
    });
  }

  async isValidFile(path) {
    try {
      this.isFileExtensionAccepted(path);

      this.isValidPath(path);

      return false;
    } catch (err) {
      return true;
    }
  }

  async makeQuestions() {
    this.terminal = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (await this.isValidFile(this.path)) {
      this.path = await this.terminal.question('Enter the path of your input file: ');
    }
    // this.changeSeparator = await this.terminal.question('Do you want change the separator? (y or n): ');
    // this.chooseSeparator = await this.terminal.question('Inform a separator you wish to change to: ');
  }

  async init() {
    await this.makeQuestions();

    try {
      let startTime;

      this.setInput(this.path);
      this.setOutput(this.path);

      startTime = performance.now();

      await this.process(this.path);

      console.log('Processing time in milliseconds:', Math.round(performance.now() - startTime));

      console.log('End of list formatting process!');
    } catch (err) {
      const regexErrorStack = err.stack.match(/\((.+):(\d+):(\d+)\)/);
      const path = regexErrorStack[1];
      const line = regexErrorStack[2];

      console.error(`Error 💥`);
      console.error('Message:', err.message);
      console.error(`Path: ${path}`);
      console.error(`Line: ${line}`);
    } finally {
      this.terminal.close();
    }
  }
}

new App().init();
