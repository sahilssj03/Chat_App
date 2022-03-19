const Message = require('../model/message.Schema')
const User = require('../model/users.Schema')
const Chat = require('../model/chat.Schema')

sendAMessage = async (req, res) => {
    const chatId = req.body.chatId
    const content = req.body.content
    if (!chatId || !content) {
        return res.status(400).send({ status: 'error', message: 'Invalid Data Passed' })
    }
    var newMessage = {
        chat: chatId,
        content: content,
        sender: req.user.id
    }

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name image")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name image email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.status(200).send({ status: 'success', message: message });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message })
        throw new Error(error.message);
    }

}

allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name image email")
            .populate("chat");
        res.status(200).send({ status: 'success', message: messages });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message })
        throw new Error(error.message);
    }
}

module.exports = { sendAMessage, allMessages }