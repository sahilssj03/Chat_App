const Message = require('../model/message.Schema')
const User = require('../model/users.Schema')

sendAMessage = async (req, res) => {
    const chatId = req.body.chat
    const content = req.body.content
    if (!chatId || !content) {
        return res.status(400).send({ status: 'error', message: 'Invalid Data Passed' })
    }
    var newMessage = {
        chat: chatId,
        content: content,
        sender: req.user.id
    }

    await Message.create(newMessage)
        .then(data => {
            data.populate("sender", "name image")
                .then(data => {
                    data.populate("chat")
                        .then(data => {
                            data.chat.populate("users").then(data => {
                                console.log(data)
                            })
                        })
                })
        })
        .catch((err) => {
            res.status(400).send({ status: 'error', message: err })
        })
}

allMessages = async (req, res) => {

}

module.exports = { sendAMessage, allMessages }