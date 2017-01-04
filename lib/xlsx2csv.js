'use strict';

const through2 = require('through2');
const XLSX = require('xlsx');
const _ = require('lodash');
const File = require('vinyl');
const path = require('path');
const csvParser = require('babyparse');
const debug = require('debug')('xlsx2csv:xlsx2csv');

const defaultProcessor = require('./processor');

module.exports = function(opts = [], outputPathProcessor = null) {
  return through2.obj(function(file, enc, callback) {

    let content = null
    if (file.isBuffer()) {
      content = file.contents;
    }
    if (file.isStream()) {
      debug('stream is currently unsupported');
      return callback();
    }
    if (file.isNull()) {
      debug('file is empty');
      return callback(null, file);
    }

    const workbook = XLSX.read(content);
    const sheets = workbook.SheetNames;
    const self = this;
    sheets.forEach(function(sheet) {

      const worksheet = workbook.Sheets[sheet];
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      const parsed = csvParser.parse(csv).data;
      const csvText = parsed.filter(function(row) {
        // remove blank rows
        return row.filter(function (data) {
          return data !== '';
        }).length !== 0;
      });
      const unparsed = csvParser.unparse(csvText);

      const csvFile = new File({
        path: outputPathProcessor != null ? outputPathProcessor(file, sheet, opts) : defaultProcessor(file, sheet, opts),
        contents: new Buffer(unparsed)
      });
      self.push(csvFile);
    });
    return callback();
  });
};
