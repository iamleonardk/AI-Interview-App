const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a PDF file to Cloudinary
 * @param {string} filePath - Local path to the file
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} - Upload result with secure_url and public_id
 */
const uploadPDF = async (filePath, folder = 'documents') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw', // Use 'raw' for PDFs and other non-image files
      folder: folder,
      use_filename: true,
      unique_filename: true
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Cloudinary public_id of the file
 * @returns {Promise<Object>} - Deletion result
 */
const deletePDF = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete file from Cloudinary: ${error.message}`);
  }
};

module.exports = {
  uploadPDF,
  deletePDF,
  cloudinary
};
