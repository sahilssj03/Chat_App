const express = require('express')
const router = express.Router()
const { verifySignUp, verifyToken } = require('../middlewares/index');
const auth = require("../controllers/auth")
const user = require('../controllers/user')

// User Registration
router.post('/register', [verifySignUp.checkDuplicateEmail], auth.register);

// User Login
router.post('/login', auth.login)

// Token Validation
router.get('/', [verifyToken.tokenValidation], async (req, res) => {
    res.json({ message: req.user })
})

// Confirm User Account
router.get('/confirm/:confirmationCode', auth.verifyUser)

// Resend Confirmation Email 
router.post('/resend', auth.resendEmail)

// Get All Users
router.get('/', [verifyToken.tokenValidation], user.getallUsers)




module.exports = router;