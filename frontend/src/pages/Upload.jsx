import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentAPI } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

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
      await fetchDocuments();

      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
      }, 1000);
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>

        {doc ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-green-800">{doc.filename}</p>
                  <p className="text-sm text-green-600">
                    Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive[type] ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={(e) => handleDrag(e, type)}
              onDragLeave={(e) => handleDrag(e, type)}
              onDragOver={(e) => handleDrag(e, type)}
              onDrop={(e) => handleDrop(e, type)}
            >
              <p className="text-gray-600 mb-2">Upload a new {title.toLowerCase()}</p>
              <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
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
            className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
              dragActive[type]
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={(e) => handleDrag(e, type)}
            onDragLeave={(e) => handleDrag(e, type)}
            onDragOver={(e) => handleDrag(e, type)}
            onDrop={(e) => handleDrop(e, type)}
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <p className="mt-4 text-gray-600">
              Drag and drop your {title.toLowerCase()} here, or
            </p>
            <label className="mt-2 cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
              Browse Files
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={(e) => handleFileInput(e, type)}
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">PDF only, max 2MB</p>
          </div>
        )}

        {progress > 0 && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">{progress}% uploaded</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Upload Documents</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <UploadZone type="resume" title="Resume" />
          <UploadZone type="jd" title="Job Description" />
        </div>

        <div className="text-center">
          <button
            onClick={handleProceedToChat}
            disabled={loading}
            className="btn-primary text-lg"
          >
            Proceed to Interview
          </button>
        </div>

        {loading && <LoadingSpinner message="Uploading and processing document..." />}
      </div>
    </div>
  );
};

export default Upload;
