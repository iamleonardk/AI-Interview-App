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
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">AI-Powered</span>
              <br />
              <span className="text-gray-800">Interview Preparation</span>
            </h1>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Practice interviews with AI, get instant feedback, and improve your chances
            of landing your dream job.
          </motion.p>

          <motion.div
            className="glass-card mb-12"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-semibold gradient-text mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
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
                  className="p-6 rounded-xl bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
                  variants={cardVariants}
                  whileHover="hover"
                  custom={index}
                >
                  <motion.div
                    className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-4xl">{step.icon}</span>
                  </motion.div>
                  <h3 className="font-bold text-xl mb-3 gradient-text">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/signup" className="btn-primary text-lg inline-block">
                Get Started
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/login" className="btn-secondary text-lg inline-block">
                Sign In
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
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
                className="p-4"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
