const Document = require('../models/Document');
const { parsePDF, chunkText } = require('../utils/pdfParser');
const { generateEmbedding } = require('../utils/openai');
const { uploadPDF, deletePDF } = require('../utils/cloudinary');
const fs = require('fs').promises;
const path = require('path');

// @desc    Upload and process document (PDF)
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const { type } = req.body;

    if (!type || !['resume', 'jd'].includes(type)) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ message: 'Invalid document type. Must be "resume" or "jd"' });
    }

    // Check if user already has this document type
    const existingDoc = await Document.findOne({ userId: req.user._id, type });
    if (existingDoc) {
      // Delete from Cloudinary if exists
      if (existingDoc.cloudinaryPublicId) {
        try {
          await deletePDF(existingDoc.cloudinaryPublicId);
        } catch (error) {
          console.error('Failed to delete old file from Cloudinary:', error);
        }
      }
      await Document.findByIdAndDelete(existingDoc._id);
    }

    // Parse PDF
    console.log('Parsing PDF:', req.file.path);
    let rawText;
    try {
      rawText = await parsePDF(req.file.path);
    } catch (error) {
      console.error('PDF parsing failed:', error);
      await fs.unlink(req.file.path);
      return res.status(400).json({ message: 'Failed to parse PDF file. Please ensure it is a valid PDF.' });
    }

    if (!rawText || rawText.trim().length === 0) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ message: 'Could not extract text from PDF. The file may be empty or image-based.' });
    }

    // Chunk the text
    console.log('Chunking text, total length:', rawText.length);
    const textChunks = chunkText(rawText);
    console.log('Created chunks:', textChunks.length);

    // Generate embeddings for each chunk
    const chunks = [];
    for (let i = 0; i < textChunks.length; i++) {
      console.log(`Generating embedding for chunk ${i + 1}/${textChunks.length}`);
      try {
        const embedding = await generateEmbedding(textChunks[i]);
        chunks.push({
          text: textChunks[i],
          embedding: embedding,
          index: i
        });
      } catch (error) {
        console.error(`Failed to generate embedding for chunk ${i}:`, error);
        await fs.unlink(req.file.path);

        // Check if it's an OpenAI API error
        if (error.status === 401) {
          return res.status(500).json({ message: 'OpenAI API authentication failed. Please check API key configuration.' });
        } else if (error.status === 429) {
          return res.status(429).json({ message: 'OpenAI API rate limit exceeded. Please try again later.' });
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
          return res.status(500).json({ message: 'Unable to connect to OpenAI API. Please check your internet connection.' });
        }

        return res.status(500).json({
          message: 'Failed to generate embeddings. Please try again later.',
          error: error.message
        });
      }
    }

    // Upload PDF to Cloudinary
    console.log('Uploading PDF to Cloudinary');
    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadPDF(req.file.path, `documents/${req.user._id}`);
      console.log('Cloudinary upload successful:', cloudinaryResult.publicId);
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      await fs.unlink(req.file.path);
      return res.status(500).json({
        message: 'Failed to upload PDF to cloud storage. Please check Cloudinary configuration.',
        error: error.message
      });
    }

    // Save document to database
    console.log('Saving document to database');
    const document = await Document.create({
      userId: req.user._id,
      type,
      filename: req.file.originalname,
      fileUrl: cloudinaryResult.url,
      cloudinaryPublicId: cloudinaryResult.publicId,
      chunks,
      rawText
    });

    // Clean up temporary uploaded file
    await fs.unlink(req.file.path);
    console.log('Document uploaded successfully:', document._id);

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        id: document._id,
        type: document.type,
        filename: document.filename,
        chunksCount: chunks.length,
        createdAt: document.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error stack:', error.stack);
    if (req.file) {
      await fs.unlink(req.file.path).catch(err => console.error('Cleanup error:', err));
    }

    // More specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid document data', error: error.message });
    }

    res.status(500).json({
      message: 'Error processing document',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all user documents
// @route   GET /api/documents/list
// @access  Private
const listDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .select('-chunks -rawText')
      .sort({ createdAt: -1 });

    res.json({
      documents: documents.map(doc => ({
        id: doc._id,
        type: doc.type,
        filename: doc.filename,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }))
    });
  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete from Cloudinary if exists
    if (document.cloudinaryPublicId) {
      try {
        await deletePDF(document.cloudinaryPublicId);
        console.log('File deleted from Cloudinary:', document.cloudinaryPublicId);
      } catch (error) {
        console.error('Failed to delete file from Cloudinary:', error);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting document' });
  }
};

// @desc    Check if both documents are uploaded
// @route   GET /api/documents/check
// @access  Private
const checkDocuments = async (req, res) => {
  try {
    const resume = await Document.findOne({ userId: req.user._id, type: 'resume' });
    const jd = await Document.findOne({ userId: req.user._id, type: 'jd' });

    res.json({
      hasResume: !!resume,
      hasJD: !!jd,
      bothUploaded: !!(resume && jd)
    });
  } catch (error) {
    console.error('Check error:', error);
    res.status(500).json({ message: 'Error checking documents' });
  }
};

module.exports = {
  uploadDocument,
  listDocuments,
  deleteDocument,
  checkDocuments
};
