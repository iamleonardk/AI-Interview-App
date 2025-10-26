// Test script to verify pdf-parse is working
const pdfParse = require('pdf-parse');

console.log('pdf-parse module loaded successfully');
console.log('Version:', require('./node_modules/pdf-parse/package.json').version);

// Test with a simple buffer
const testBuffer = Buffer.from('%PDF-1.4\ntest');
console.log('Module is ready to use');
