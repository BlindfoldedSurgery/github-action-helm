"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTmpfile = exports.writeTmpfile = void 0;
const fs = require('fs');
const RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE_PATH = '/tmp';
function randomName(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        // 10 + 26 + 26 = 62 (RANDOM_CHARS.length)
        result += RANDOM_CHARS.charAt(Math.floor(Math.random() * 62));
    }
    return result;
}
function writeTmpfile(content, filenameLength = 64) {
    const name = randomName(filenameLength);
    const path = `${BASE_PATH}/${name}`;
    fs.writeFileSync(path, content);
    // recommended access mode since every user should have their own kubeconfig
    fs.chmodSync(path, 0o600);
    return path;
}
exports.writeTmpfile = writeTmpfile;
function deleteTmpfile(name) {
    return fs.unlinkSync(name);
}
exports.deleteTmpfile = deleteTmpfile;
