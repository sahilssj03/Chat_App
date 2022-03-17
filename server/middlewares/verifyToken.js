require('dotenv').config();
const jwt = require('jsonwebtoken')
const User = require('../model/users.Schema')

tokenValidation = async (req, res, next) => {
    token = req.headers['authorization']
    if (token == null) return res.sendStatus(401)
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const currentUser = await User.findById(user.id)
    req.user = currentUser
    next();
}

const verifyToken = { tokenValidation }

module.exports = verifyToken 