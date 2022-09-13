const User = require('../model/users.Schema')

checkDuplicateEmail = async (req, res, next) => {
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    function isEmailValid(email) {
        if (!email)
            return false;

        if (email.length > 254)
            return false;

        var valid = emailRegex.test(email);
        if (!valid)
            return false;

        // Further checking of some things regex can't handle
        var parts = email.split("@");
        if (parts[0].length > 64)
            return false;

        var domainParts = parts[1].split(".");
        if (domainParts.some(function (part) { return part.length > 63; }))
            return false;

        return true;
    }

    try {
        const email = req.body.email;
        const plainTextPassword = req.body.password;
        const userWithSameEmail = await User.findOne({ email: email })

        if (!email || typeof email !== 'string' || !isEmailValid(email)) {
            res.status(400).send({ status: 'error', message: 'Invalid email' })
            return;
        }


        if (!plainTextPassword || typeof plainTextPassword !== 'string') {
            res.status(400).send({ status: 'error', message: 'Invalid password' })
            return;
        }

        if (plainTextPassword.length < 8) {
            res.status(400).send({
                status: 'error',
                message: 'Password too small. Should be atleast 8 characters'
            })
            return;
        }

        if (userWithSameEmail) {
            res.status(400).send({ status: "error", message: "Email already associated!" });
            return;
        }
        next();
    }
    catch (err) {
        res.json(err);
        return;
    }
}

const verifySignUp = {
    checkDuplicateEmail
};

module.exports = verifySignUp;