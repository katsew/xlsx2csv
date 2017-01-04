'use strict';

const debug = require('debug')('xlsx2csv:processor');

module.exports = function(File, sheetName, opts) {

    const filePath = File.path;
    const relativePath = File.relative;
    const splitted = filePath.split("/");
    const file = splitted[splitted.length - 1];
    const fileSplitted = file.split(".");
    const fileName = fileSplitted[0];
    const dirName = relativePath.split("/")[0];
    debug('filePath', filePath);
    debug('relativePath', relativePath);
    debug('file', file);
    debug('fileName', fileName);
    debug('dirName', dirName);
    debug('sheetName', sheetName);
    debug('output', `${dirName}/${fileName}/${sheetName}.csv`);
    return `${dirName}/${fileName}/${sheetName}.csv`;

}
