const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserSchema"
        }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MessageSchema"
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserSchema"
        }

    },
    { collection: 'chats', timestamps: true }
)

const model = mongoose.model('ChatSchema', ChatSchema)

module.exports = model