import { Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Landing = () => {
  const { user, loading } = useContext(AuthContext);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect authenticated users to home page
  if (user) {
    return <Navigate to="/home" replace />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="gradient-text">AI-Powered</span>
              <br />
              <span className="text-gray-800">Interview Preparation</span>
            </h1>
          </motion.div>

          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto px-2"
            variants={itemVariants}
          >
            Practice interviews with AI, get instant feedback, and improve your chances
            of landing your dream job.
          </motion.p>

          <motion.div
            className="glass-card mb-8 sm:mb-10 lg:mb-12 p-4 sm:p-6 lg:p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold gradient-text mb-6 sm:mb-8">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  number: 1,
                  title: "Upload Documents",
                  description: "Upload your resume and the job description you're applying for",
                  icon: "📄"
                },
                {
                  number: 2,
                  title: "Practice Interview",
                  description: "Answer AI-generated questions tailored to the job description",
                  icon: "💬"
                },
                {
                  number: 3,
                  title: "Get Feedback",
                  description: "Receive instant AI feedback and scoring on your responses",
                  icon: "⭐"
                }
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
                  variants={cardVariants}
                  whileHover="hover"
                  custom={index}
                >
                  <motion.div
                    className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg"
                    whileHover={{ rotate: 360 }}
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

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/signup" className="btn-primary text-base sm:text-lg inline-block w-full sm:w-auto">
                Get Started
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/login" className="btn-secondary text-base sm:text-lg inline-block w-full sm:w-auto">
                Sign In
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center"
            variants={containerVariants}
          >
            {[
              { value: "10K+", label: "Practice Sessions" },
              { value: "95%", label: "Success Rate" },
              { value: "24/7", label: "AI Available" },
              { value: "100+", label: "Job Roles" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="p-2 sm:p-4"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-gray-600 text-xs sm:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
