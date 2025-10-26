import { Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
  const { user, loading } = useContext(AuthContext);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect authenticated users to home page
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            AI-Powered Interview Preparation
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice interviews with AI, get instant feedback, and improve your chances
            of landing your dream job.
          </p>

          <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Upload Documents</h3>
                <p className="text-gray-600">
                  Upload your resume and the job description you're applying for
                </p>
              </div>

              <div className="p-6">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Practice Interview</h3>
                <p className="text-gray-600">
                  Answer AI-generated questions tailored to the job description
                </p>
              </div>

              <div className="p-6">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Get Feedback</h3>
                <p className="text-gray-600">
                  Receive instant AI feedback and scoring on your responses
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Link to="/signup" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
