const express = require('express')
const router = express.Router()
const { verifySignUp, verifyToken } = require('../middlewares/index');
const auth = require("../controllers/auth")


// Registration Endpoint
router.post('/register', [verifySignUp.checkDuplicateEmailOrUsername], auth.register);

// Confirmation Endpoint
router.get("/confirm/:confirmationCode", auth.verifyUser)

// Resend Confirmation Email Endpoint
router.post("/resend", auth.resendEmail)

// Login Endpoint
router.post('/login', auth.login)

router.get('/', [verifyToken.tokenValidation], async (req, res) => {
    res.json({ message: req.user })
})

module.exports = router;