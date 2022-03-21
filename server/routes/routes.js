const express = require('express')
const router = express.Router()
const { verifySignUp, verifyToken } = require('../middlewares/index');
const auth = require("../controllers/auth")
const user = require('../controllers/user')
const message = require('../controllers/message')

// User Registration
router.post('/register', [verifySignUp.checkDuplicateEmail], auth.register);

// User Login
router.post('/login', auth.login)

// Confirm User Account
router.get('/confirm/:confirmationCode', auth.verifyUser)

// Resend Confirmation Email 
router.post('/resend', auth.resendEmail)

// Get All Users By Search
router.get('/users', [verifyToken.tokenValidation], user.getallUsers)

// Create A New Chat
router.post('/chat', [verifyToken.tokenValidation], user.createChat)

// Fetch All Chats 
router.get('/chat', [verifyToken.tokenValidation], user.fetchChat)

// Create A Group
router.post('/group', [verifyToken.tokenValidation], user.createGroup)

// Rename A Group
router.put('/rename', [verifyToken.tokenValidation], user.renameGroup)

// Add To Group
router.put('/groupadd', [verifyToken.tokenValidation], user.addToGroup)

// Remove From Group
router.put('/groupremove', [verifyToken.tokenValidation], user.removeFromGroup)

// To Send A Message
router.post('/message', [verifyToken.tokenValidation], message.sendAMessage)

// To Send A Message
router.get('/:chatId', [verifyToken.tokenValidation], message.allMessages)

module.exports = router;