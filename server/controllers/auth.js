const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../model/users.Schema')
require('dotenv').config();
const nodemailer = require("../config/nodemailer.config");


register = async (req, res) => {
    const password = await bcrypt.hash(req.body.password, 10)
    const userRegister = new User({
        name: req.body.name,
        image: req.body.image,
        email: req.body.email,
        password: password,
        confirmationCode: jwt.sign({ email: req.body.email }, process.env.ACCESS_TOKEN_SECRET)
    })

    userRegister.save().then(data => {
        nodemailer.sendConfirmationEmail(
            userRegister.name,
            userRegister.email,
            userRegister.confirmationCode
        );

        return res.status(200).send({
            status: "success",
            message: "User was registered successfully! Please check your email"
        });
    })
        .catch(error => {
            return res.json(error)
        })

}

verifyUser = async (req, res) => {
    User.findOne({
        confirmationCode: req.params.confirmationCode,
    })
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            user.status = "Active";
            user.save((err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                else {
                    res.status(200).send({ message: "Account Confirmed" });
                    return
                }
            });
        })
        .catch((e) => console.log("error", e));
};

login = async (req, res) => {

    const user = await User.findOne({ email: req.body.email })


    if (!user) {
        if (req.body.email) {
            return res.status(401).send({ status: 'error', message: 'Invalid email/password' })
        }
        else {
            return res.status(401).send({ status: 'error', message: 'Invalid email/password' })
        }

    }

    if (user.status != "Active") {
        return res.status(401).send({
            status: 'error',
            message: "Pending Account. Please Verify Your Email!",
            email: user.email
        });
    }

    if (await bcrypt.compare(req.body.password, user.password)) {

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email
            },
            process.env.ACCESS_TOKEN_SECRET
        )
        return res.status(200).send({ status: 'success', data: { accessToken: token, name: user.name, username: user.username, email: user.email } })
    }
    res.status(401).send({ status: 'error', message: 'Invalid email/password' })
}

resendEmail = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user && user.status != 'Active') {
        nodemailer.sendConfirmationEmail(
            user.name,
            user.email,
            user.confirmationCode
        );

        return res.status(200).send({ status: 'success', message: 'Email sent successfully' })

    }
    else if (user && user.status === 'Active') {
        return res.status(200).send({ status: 'success', message: 'User Already Confirmed' })

    }
    else {
        return res.status(404).send({ status: 'error', message: 'Account not found' })
    }
}

module.exports = { register, login, verifyUser, resendEmail }