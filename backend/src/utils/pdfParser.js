const pdf = require('pdf-parse');
const fs = require('fs').promises;

// Parse PDF and extract text
const parsePDF = async (filePath) => {
  try {
    console.log('Reading PDF file:', filePath);

    // Check if file exists
    const stats = await fs.stat(filePath);
    console.log('File size:', stats.size, 'bytes');

    if (stats.size === 0) {
      throw new Error('PDF file is empty');
    }

    const dataBuffer = await fs.readFile(filePath);
    console.log('Buffer loaded, size:', dataBuffer.length);

    // Check if it's actually a PDF
    const header = dataBuffer.toString('utf8', 0, 5);
    console.log('File header:', header);

    if (!header.startsWith('%PDF')) {
      throw new Error('File is not a valid PDF (invalid header)');
    }

    console.log('Parsing PDF with pdf-parse...');
    const data = await pdf(dataBuffer);
    console.log('PDF parsed successfully. Text length:', data.text.length);
    console.log('Number of pages:', data.numpages);

    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to parse PDF file: ${error.message}`);
  }
};

// Chunk text into smaller pieces (roughly 500 words)
const chunkText = (text, maxWords = 500) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks = [];
  let currentChunk = '';
  let wordCount = 0;

  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/).length;

    if (wordCount + sentenceWords > maxWords && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
      wordCount = sentenceWords;
    } else {
      currentChunk += ' ' + sentence;
      wordCount += sentenceWords;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(chunk => chunk.length > 0);
};

module.exports = {
  parsePDF,
  chunkText
};
