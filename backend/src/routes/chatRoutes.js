const express = require('express');
const {
  startChat,
  queryChat,
  getChatHistory,
  endChat
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/start', protect, startChat);
router.post('/query', protect, queryChat);
router.get('/history', protect, getChatHistory);
router.post('/end', protect, endChat);

module.exports = router;
