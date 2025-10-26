import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Home = () => {
  const { user } = useContext(AuthContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.03,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Section */}
          <motion.div className="mb-8 sm:mb-10 lg:mb-12" variants={itemVariants}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 leading-tight">
              <span className="gradient-text">Welcome back,</span>
              <br />
              <span className="text-gray-800">{user?.name}!</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Ready to ace your next interview? Let's get started.
            </p>
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12"
            variants={itemVariants}
          >
            {/* Upload Documents Card */}
            <Link to="/upload" className="block">
              <motion.div
                className="glass-card hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 lg:p-8"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <motion.div
                    className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-2 sm:p-3 mr-3 sm:mr-4 shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl font-bold gradient-text">Upload Documents</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Upload your resume and job description to get personalized interview questions.
                </p>
                <div className="flex items-center gradient-text font-semibold text-sm sm:text-base">
                  Get Started
                  <motion.svg
                    className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </div>
              </motion.div>
            </Link>

            {/* Practice Interview Card */}
            <Link to="/chat" className="block">
              <motion.div
                className="glass-card hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500 bg-gradient-to-br from-white to-green-50 p-4 sm:p-6 lg:p-8"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <motion.div
                    className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-2 sm:p-3 mr-3 sm:mr-4 shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl font-bold text-green-600">Practice Interview</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Start your AI-powered interview practice session and get instant feedback.
                </p>
                <div className="flex items-center text-green-600 font-semibold text-sm sm:text-base">
                  Start Practicing
                  <motion.svg
                    className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            className="glass-card mb-6 sm:mb-8 p-4 sm:p-6 lg:p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-6 sm:mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  number: 1,
                  title: "Upload Your Documents",
                  description: "Upload your resume and the job description you're targeting to personalize your practice session.",
                  color: "from-blue-500 to-purple-600",
                  icon: "📄"
                },
                {
                  number: 2,
                  title: "Answer AI Questions",
                  description: "Practice with AI-generated questions tailored to your resume and job description.",
                  color: "from-green-500 to-emerald-600",
                  icon: "💬"
                },
                {
                  number: 3,
                  title: "Get Instant Feedback",
                  description: "Receive detailed AI feedback and scoring to improve your interview performance.",
                  color: "from-purple-500 to-pink-600",
                  icon: "⭐"
                }
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  className="text-center p-2 sm:p-4"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                >
                  <motion.div
                    className={`bg-gradient-to-br ${step.color} rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-3xl sm:text-4xl">{step.icon}</span>
                  </motion.div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 gradient-text">{step.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            className="glass-card bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none p-4 sm:p-6 lg:p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Interview Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                "Practice regularly to build confidence and improve your responses",
                "Use the STAR method (Situation, Task, Action, Result) for behavioral questions",
                "Review the AI feedback carefully and work on areas that need improvement",
                "Tailor your answers to match the specific job requirements"
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileHover={{ x: 5 }}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm sm:text-base">{tip}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
