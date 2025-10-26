import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Outer spinning ring */}
        <motion.div
          className="rounded-full h-16 w-16 border-4 border-transparent border-t-blue-600 border-r-purple-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner pulsing circle */}
        <motion.div
          className="absolute inset-0 m-auto rounded-full h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.p
        className="mt-6 text-lg font-semibold gradient-text"
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default LoadingSpinner;
