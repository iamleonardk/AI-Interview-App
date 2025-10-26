import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentAPI } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const Upload = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ resume: 0, jd: 0 });
  const [dragActive, setDragActive] = useState({ resume: false, jd: false });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await documentAPI.list();
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive({ ...dragActive, [type]: true });
    } else if (e.type === 'dragleave') {
      setDragActive({ ...dragActive, [type]: false });
    }
  };

  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive({ ...dragActive, [type]: false });

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], type);
    }
  }, [dragActive]);

  const handleFileInput = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0], type);
    }
  };

  const handleFileUpload = async (file, type) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must not exceed 2MB');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress((prev) => ({ ...prev, [type]: Math.min(progress, 90) }));
      }, 100);

      await documentAPI.upload(formData);

      clearInterval(interval);
      setUploadProgress((prev) => ({ ...prev, [type]: 100 }));

      toast.success(`${type === 'resume' ? 'Resume' : 'Job Description'} uploaded successfully!`);

      // Delay fetchDocuments to allow progress animation to complete
      setTimeout(async () => {
        await fetchDocuments();
        setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
      }, 1200);
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
      setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentAPI.delete(id);
      toast.success('Document deleted successfully');
      await fetchDocuments();
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleProceedToChat = async () => {
    try {
      const response = await documentAPI.check();
      if (response.data.bothUploaded) {
        navigate('/chat');
      } else {
        toast.error('Please upload both resume and job description');
      }
    } catch (error) {
      toast.error('Error checking documents');
    }
  };

  const getDocumentByType = (type) => {
    return documents.find((doc) => doc.type === type);
  };

  const UploadZone = ({ type, title }) => {
    const doc = getDocumentByType(type);
    const progress = uploadProgress[type];

    return (
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold gradient-text mb-4">{title}</h3>

        <AnimatePresence mode="sync" initial={false}>
          {doc ? (
            <motion.div
              key={`uploaded-${type}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <motion.div
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 shadow-md"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500 rounded-full p-2">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">{doc.filename}</p>
                      <p className="text-sm text-green-600">
                        Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:text-red-800 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                  dragActive[type]
                    ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
                onDragEnter={(e) => handleDrag(e, type)}
                onDragLeave={(e) => handleDrag(e, type)}
                onDragOver={(e) => handleDrag(e, type)}
                onDrop={(e) => handleDrop(e, type)}
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-gray-600 mb-2">Upload a new {title.toLowerCase()}</p>
                <label className="cursor-pointer gradient-text font-semibold hover:underline">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => handleFileInput(e, type)}
                  />
                </label>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={`empty-${type}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive[type]
                  ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                  : 'border-gray-300 hover:border-purple-300'
              }`}
              onDragEnter={(e) => handleDrag(e, type)}
              onDragLeave={(e) => handleDrag(e, type)}
              onDragOver={(e) => handleDrag(e, type)}
              onDrop={(e) => handleDrop(e, type)}
              whileHover={{ scale: 1.02 }}
            >
              <motion.svg
                className="mx-auto h-16 w-16 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                animate={dragActive[type] ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: dragActive[type] ? Infinity : 0 }}
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
              <p className="mt-4 text-gray-700 font-medium">
                Drag and drop your {title.toLowerCase()} here, or
              </p>
              <label className="mt-3 inline-block cursor-pointer gradient-text font-bold text-lg hover:underline">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => handleFileInput(e, type)}
                />
              </label>
              <p className="mt-3 text-sm text-gray-500">PDF only, max 2MB</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 min-h-[60px]">
          <AnimatePresence>
            {progress > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full shadow-lg"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  />
                </div>
                <motion.p
                  className="text-sm font-semibold gradient-text mt-2 text-center"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {progress}% uploaded
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen py-12">
      <motion.div
        className="container mx-auto px-4 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold gradient-text mb-3">Upload Documents</h1>
          <p className="text-gray-600 text-lg">Upload your resume and job description to get started</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <UploadZone type="resume" title="Resume" />
          <UploadZone type="jd" title="Job Description" />
        </div>

        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.button
            onClick={handleProceedToChat}
            disabled={loading}
            className="btn-primary text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Proceed to Interview
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {loading && <LoadingSpinner message="Uploading and processing document..." />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Upload;
