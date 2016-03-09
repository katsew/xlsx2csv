'use strict';

const through2 = require('through2');
const XLSX = require('xlsx');
const _ = require('lodash');
const File = require('vinyl');
const path = require('path');

module.exports = function(opts) {
  return through2.obj(function(file, enc, callback) {

    let content = null
    if (file.isBuffer()) {
      content = file.contents;
    }
    if (file.isStream()) {
      console.log('stream is currently unsupported');
      return callback();
    }
    if (file.isNull()) {
      console.log('file is empty');
      return callback(null, file);
    }

    let workbook = XLSX.read(content);
    let sheets = workbook.SheetNames;
    let self = this;
    sheets.forEach(function(sheet) {

      let worksheet = workbook.Sheets[sheet];

      let csvText = XLSX.utils.sheet_to_csv(worksheet);
      let csvFile = new File({
        cwd: path.resolve(opts.src),
        base: path.resolve(opts.dest),
        path: path.resolve(opts.dest) + '/' + sheet + '.csv',
        contents: new Buffer(csvText)
      });
      self.push(csvFile);
    });
    return callback();
  });
};
