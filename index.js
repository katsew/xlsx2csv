'use strict';

const vfs = require('vinyl-fs');
const xlsx2csv = require('./lib/xlsx2csv.js');

module.exports = function (src, dest) {
  try {
    vfs.src(src)
      .pipe(xlsx2csv({
        src: src,
        dest: dest
      }))
      .pipe(vfs.dest(dest));
  } catch (e) {
    console.log(e);
  }
};