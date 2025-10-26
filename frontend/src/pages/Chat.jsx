import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatAPI, documentAPI } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 10rem)' }}>
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">AI Interview Session</h1>
            <button
              onClick={handleEndChat}
              className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded transition"
            >
              End Session
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>

                  {message.score && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">Score:</span>
                        <span
                          className={`font-bold ${
                            message.score >= 7
                              ? 'text-green-600'
                              : message.score >= 5
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {message.score}/10
                        </span>
                      </div>
                    </div>
                  )}

                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-sm font-semibold mb-2">References:</p>
                      <div className="space-y-1">
                        {message.citations.map((citation) => (
                          <button
                            key={citation.id}
                            onClick={() => setSelectedCitation(citation)}
                            className="text-sm text-blue-600 hover:text-blue-800 block text-left"
                          >
                            [{citation.id}] {citation.source} (similarity: {citation.similarity})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 input-field"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-primary"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Citation Modal */}
      {selectedCitation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCitation(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">
                Reference from {selectedCitation.source}
              </h3>
              <button
                onClick={() => setSelectedCitation(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <p className="text-gray-700">{selectedCitation.text}</p>
            <div className="mt-4 text-sm text-gray-500">
              Similarity: {selectedCitation.similarity}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
