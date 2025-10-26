import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatAPI, documentAPI } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [selectedCitation, setSelectedCitation] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      // Check if documents are uploaded
      const checkResponse = await documentAPI.check();
      if (!checkResponse.data.bothUploaded) {
        toast.error('Please upload both resume and job description');
        navigate('/upload');
        return;
      }

      // Start chat session
      const response = await chatAPI.start();
      const questionsText = response.data.questions;

      setMessages([
        {
          role: 'assistant',
          content: questionsText,
        },
      ]);

      // Extract first question for context
      const firstQuestion = questionsText.split('\n').find(line => line.trim().match(/^1[.)]/));
      if (firstQuestion) {
        setCurrentQuestion(firstQuestion);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to start chat';
      toast.error(message);
    } finally {
      setInitializing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    const userMessage = input.trim();
    setInput('');

    // Add user message to chat
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await chatAPI.query({
        message: userMessage,
        questionContext: currentQuestion,
      });

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.data.response,
          score: response.data.score,
          citations: response.data.citations,
        },
      ]);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get response';
      toast.error(message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEndChat = async () => {
    if (window.confirm('Are you sure you want to end this interview session?')) {
      try {
        await chatAPI.end();
        toast.success('Interview session ended');
        navigate('/upload');
      } catch (error) {
        console.error('Error ending chat:', error);
      }
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Starting your interview session..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <motion.div
        className="container mx-auto px-4 py-8 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card overflow-hidden flex flex-col shadow-2xl" style={{ height: 'calc(100vh - 10rem)' }}>
          {/* Header */}
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">AI Interview Session</h1>
            </div>
            <motion.button
              onClick={handleEndChat}
              className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-xl transition-all font-semibold backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              End Session
            </motion.button>
          </motion.div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <motion.div
                    className={`max-w-3xl rounded-2xl p-5 shadow-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {message.score && (
                      <motion.div
                        className="mt-4 pt-4 border-t border-gray-300"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold">Score:</span>
                          <motion.span
                            className={`font-bold text-xl px-4 py-1 rounded-full ${
                              message.score >= 7
                                ? 'bg-green-100 text-green-700'
                                : message.score >= 5
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                          >
                            {message.score}/10
                          </motion.span>
                        </div>
                      </motion.div>
                    )}

                    {message.citations && message.citations.length > 0 && (
                      <motion.div
                        className="mt-4 pt-4 border-t border-gray-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <p className="text-sm font-semibold mb-3">References:</p>
                        <div className="space-y-2">
                          {message.citations.map((citation, idx) => (
                            <motion.button
                              key={citation.id}
                              onClick={() => setSelectedCitation(citation)}
                              className="text-sm text-blue-600 hover:text-blue-800 block text-left hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors w-full"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + idx * 0.1 }}
                              whileHover={{ x: 5 }}
                            >
                              [{citation.id}] {citation.source} (similarity: {citation.similarity})
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {loading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200">
                    <div className="flex space-x-2">
                      <motion.div
                        className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                      <motion.div
                        className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                      />
                      <motion.div
                        className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <motion.div
            className="border-t border-gray-200 p-6 bg-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 input-field"
                disabled={loading}
              />
              <motion.button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>

      {/* Citation Modal */}
      <AnimatePresence>
        {selectedCitation && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCitation(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card max-w-2xl w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold gradient-text">
                  Reference from {selectedCitation.source}
                </h3>
                <motion.button
                  onClick={() => setSelectedCitation(null)}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-bold hover:bg-gray-100 rounded-lg w-10 h-10 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  &times;
                </motion.button>
              </div>
              <p className="text-gray-700 leading-relaxed">{selectedCitation.text}</p>
              <div className="mt-4 text-sm font-semibold gradient-text">
                Similarity: {selectedCitation.similarity}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
