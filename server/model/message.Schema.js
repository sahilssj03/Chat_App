const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
    {
        content: { type: String, trim: true },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserSchema"
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatSchema"
        }

    },
    { collection: 'messages', timestamps: true }
)

const model = mongoose.model('MessageSchema', MessageSchema)

module.exports = model