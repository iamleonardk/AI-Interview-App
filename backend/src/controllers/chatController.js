const Chat = require('../models/Chat');
const Document = require('../models/Document');
const { generateEmbedding, cosineSimilarity, generateChatCompletion } = require('../utils/openai');

// @desc    Start chat session with initial questions
// @route   POST /api/chat/start
// @access  Private
const startChat = async (req, res) => {
  try {
    // Check if both documents exist
    const resume = await Document.findOne({ userId: req.user._id, type: 'resume' });
    const jd = await Document.findOne({ userId: req.user._id, type: 'jd' });

    if (!resume || !jd) {
      return res.status(400).json({
        message: 'Please upload both resume and job description before starting chat'
      });
    }

    // Delete any existing active chat session
    await Chat.deleteMany({ userId: req.user._id });

    // Generate initial questions from JD
    const jdText = jd.rawText.substring(0, 3000); // Limit text for context

    const prompt = `Based on this job description, generate exactly 3 interview questions that are relevant and specific to the role. Return ONLY the questions, numbered 1-3, without any additional text or explanations.

Job Description:
${jdText}`;

    const questionsText = await generateChatCompletion([
      { role: 'system', content: 'You are an experienced technical interviewer.' },
      { role: 'user', content: prompt }
    ]);

    // Create new chat session
    const chat = await Chat.create({
      userId: req.user._id,
      messages: [
        {
          role: 'system',
          content: 'Interview session started'
        },
        {
          role: 'assistant',
          content: questionsText
        }
      ]
    });

    res.json({
      chatId: chat._id,
      questions: questionsText,
      message: 'Chat session started. Here are your interview questions.'
    });
  } catch (error) {
    console.error('Start chat error:', error);
    res.status(500).json({ message: 'Error starting chat session' });
  }
};

// @desc    Process user query with RAG
// @route   POST /api/chat/query
// @access  Private
const queryChat = async (req, res) => {
  try {
    const { message, questionContext } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get active chat session
    let chat = await Chat.findOne({ userId: req.user._id, isActive: true });

    if (!chat) {
      return res.status(400).json({ message: 'No active chat session. Please start a new chat.' });
    }

    // Get documents
    const resume = await Document.findOne({ userId: req.user._id, type: 'resume' });
    const jd = await Document.findOne({ userId: req.user._id, type: 'jd' });

    if (!resume || !jd) {
      return res.status(400).json({ message: 'Documents not found' });
    }

    // Generate embedding for user query
    const queryEmbedding = await generateEmbedding(message);

    // Find top 2 relevant chunks from resume
    const resumeChunks = resume.chunks.map(chunk => ({
      text: chunk.text,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
      source: 'resume',
      index: chunk.index
    }));

    // Find top 2 relevant chunks from JD
    const jdChunks = jd.chunks.map(chunk => ({
      text: chunk.text,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
      source: 'jd',
      index: chunk.index
    }));

    // Combine and sort by similarity
    const allChunks = [...resumeChunks, ...jdChunks].sort((a, b) => b.similarity - a.similarity);

    // Get top 2 chunks
    const topChunks = allChunks.slice(0, 2);

    // Create context for evaluation
    const context = topChunks.map((chunk, i) =>
      `[Source ${i + 1} - ${chunk.source}]: ${chunk.text}`
    ).join('\n\n');

    // Determine which question is being answered
    const currentQuestion = questionContext || 'the interview question';

    // Create evaluation prompt
    const evaluationPrompt = `You are an experienced technical interviewer evaluating a candidate's response.

Question: ${currentQuestion}

Candidate's Response: ${message}

Relevant Information:
${context}

Evaluate the candidate's response based on:
1. Relevance to the question
2. Alignment with their resume/experience
3. Fit with job requirements
4. Communication clarity

Provide:
- A score from 1-10 (where 10 is excellent)
- Concise feedback in 100 words maximum
- One specific suggestion for improvement

Format your response as:
Score: [number]
Feedback: [your feedback]
Suggestion: [improvement suggestion]`;

    // Get AI evaluation
    const evaluation = await generateChatCompletion([
      { role: 'system', content: 'You are an expert technical interviewer providing constructive feedback.' },
      { role: 'user', content: evaluationPrompt }
    ]);

    // Extract score
    const scoreMatch = evaluation.match(/Score:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

    // Save messages to chat
    chat.messages.push({
      role: 'user',
      content: message
    });

    chat.messages.push({
      role: 'assistant',
      content: evaluation,
      score: score
    });

    await chat.save();

    res.json({
      response: evaluation,
      score: score,
      citations: topChunks.map((chunk, i) => ({
        id: i + 1,
        source: chunk.source,
        text: chunk.text.substring(0, 200) + '...',
        similarity: chunk.similarity.toFixed(3)
      }))
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ message: 'Error processing query' });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user._id, isActive: true });

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json({
      chatId: chat._id,
      messages: chat.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        score: msg.score,
        timestamp: msg.timestamp
      }))
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
};

// @desc    End chat session
// @route   POST /api/chat/end
// @access  Private
const endChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user._id, isActive: true });

    if (chat) {
      chat.isActive = false;
      await chat.save();
    }

    res.json({ message: 'Chat session ended' });
  } catch (error) {
    console.error('End chat error:', error);
    res.status(500).json({ message: 'Error ending chat session' });
  }
};

module.exports = {
  startChat,
  queryChat,
  getChatHistory,
  endChat
};
