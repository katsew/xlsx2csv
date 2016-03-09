#!/usr/bin/env node

'use strict';

const program = require('commander');
const path = require('path');
const vfs = require('vinyl-fs');
const xlsx2csv = require('./lib/xlsx2csv.js');

program
  .version('0.0.1')
  .option('-s, --source [src]', 'add source')
  .option('-o, --output [dest]', 'output destination')
  .parse(process.argv);

if (program.source && program.output) {

  var src = path.resolve(program.source);
  var dest = path.resolve(program.output);
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
}
