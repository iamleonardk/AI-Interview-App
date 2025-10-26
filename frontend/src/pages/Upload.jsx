import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Upload = () => {
  const [documents, setDocuments] = useState([]);
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

  const handleDrag = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === 'dragleave') {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  }, []);

  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], type);
    }
  }, []);

  const handleFileInput = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0], type);
    }
  };

  const handleFileUpload = useCallback(async (file, type) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must not exceed 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    let interval = null;

    try {
      // Simulate progress with smoother updates
      let progress = 0;
      interval = setInterval(() => {
        progress += 10;
        setUploadProgress((prev) => ({ ...prev, [type]: Math.min(progress, 90) }));
      }, 150);

      await documentAPI.upload(formData);

      clearInterval(interval);
      interval = null;
      setUploadProgress((prev) => ({ ...prev, [type]: 100 }));

      toast.success(`${type === 'resume' ? 'Resume' : 'Job Description'} uploaded successfully!`);

      // Delay fetchDocuments to allow progress animation to complete
      setTimeout(async () => {
        await fetchDocuments();
        setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
      }, 1000);
    } catch (error) {
      if (interval) clearInterval(interval);
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
      setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
    }
  }, []);

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
      <div
        className="glass-card p-4 sm:p-6 lg:p-8"
      >
        <h3 className="text-lg sm:text-xl font-bold gradient-text mb-3 sm:mb-4">{title}</h3>

        {doc ? (
          <div className="space-y-3 sm:space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="bg-green-500 rounded-full p-1.5 sm:p-2 flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-green-800 text-sm sm:text-base truncate">{doc.filename}</p>
                      <p className="text-xs sm:text-sm text-green-600">
                        Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:text-red-800 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base self-end sm:self-auto flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center transition-all duration-200 ${
                  dragActive[type]
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                }`}
                onDragEnter={(e) => handleDrag(e, type)}
                onDragLeave={(e) => handleDrag(e, type)}
                onDragOver={(e) => handleDrag(e, type)}
                onDrop={(e) => handleDrop(e, type)}
              >
                <p className="text-sm sm:text-base text-gray-600 mb-2">Upload a new {title.toLowerCase()}</p>
                <label className="cursor-pointer gradient-text font-semibold hover:underline text-sm sm:text-base">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => handleFileInput(e, type)}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-200 ${
                dragActive[type]
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              }`}
              onDragEnter={(e) => handleDrag(e, type)}
              onDragLeave={(e) => handleDrag(e, type)}
              onDragOver={(e) => handleDrag(e, type)}
              onDrop={(e) => handleDrop(e, type)}
            >
              <svg
                className={`mx-auto h-12 w-12 sm:h-16 sm:w-16 transition-all duration-200 ${
                  dragActive[type] ? 'text-purple-500 scale-110' : 'text-gray-400'
                }`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700 font-medium">
                Drag and drop your {title.toLowerCase()} here, or
              </p>
              <label className="mt-2 sm:mt-3 inline-block cursor-pointer gradient-text font-bold text-base sm:text-lg hover:underline">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => handleFileInput(e, type)}
                />
              </label>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">PDF only, max 2MB</p>
            </div>
          )}

        {progress > 0 && (
          <div className="mt-3 sm:mt-4">
              {progress < 100 && (
                <div
                  key="progress"
                  className="space-y-2 overflow-hidden"
                >
                  <div className="bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden shadow-inner">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full shadow-lg"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold gradient-text text-center">
                    Uploading... {progress}%
                  </p>
                </div>
              )}

          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 lg:py-12">
      <div
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl"
      >
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-2 sm:mb-3">Upload Documents</h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">Upload your resume and job description to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
          <UploadZone type="resume" title="Resume" />
          <UploadZone type="jd" title="Job Description" />
        </div>

        <div className="text-center">
          <button
            onClick={handleProceedToChat}
            className="btn-primary text-base sm:text-lg"
          >
            Proceed to Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
