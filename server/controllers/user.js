const User = require('../model/users.Schema')
const Chat = require('../model/chat.Schema')


getallUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ],
        }
        : {};


    const users = await User.find(keyword).find({ _id: { $ne: req.user.id }, status: { $ne: 'Pending' } });
    res.status(200).send({ status: "success", users: users });
}

createChat = async (req, res) => {
    const userId = req.body.id;

    if (!userId) {
        return res.status(400).send({ status: 'error', message: 'userId not found' })
    }

    // checking if the chat already exists
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user.id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    }).populate("users",
        "-password -status -confirmationCode")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name image email",
    });

    if (isChat.length) {
        // if chat exists send it
        res.status(200).send({ status: 'success', chat: isChat[0] })
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user.id, userId],
        };

        const createdChat = await Chat.create(chatData)
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password -status -confirmationCode"
        ).then(FullChat => {
            res.status(200).send(FullChat);

        }).catch(err => {
            res.status(400).send({ status: 'error', message: err })
        })


    }

}

fetchChat = async (req, res) => {
    Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
        .populate("users",
            "-password -status -confirmationCode")
        .populate("groupAdmin",
            "-password -status -confirmationCode")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (data) => {
            data = await User.populate(data, {
                path: "latestMessage.sender",
                select: "name image email",
            });
            res.status(200).send({ status: 'success', chats: data })
        })
        .catch(err => {
            res.status(400).send({ status: 'error', message: err })
        })
}

createGroup = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ status: 'error', message: 'Fill all details' });
    }

    var users = JSON.parse(req.body.users)

    if (users.length < 2) {
        return res.status(400).send({ status: 'error', message: 'More than two users are required' });
    }

    users.push(req.user.id);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password -status -confirmationCode")
            .populate("groupAdmin", "-password -status -confirmationCode");

        res.status(200).send(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }


}

renameGroup = async (req, res) => {
    const chatId = req.body.id
    const chatName = req.body.name
    const requestingUserId = req.user.id

    const adminId = await Chat.findById(chatId);
    if (adminId.groupAdmin.toString() === requestingUserId) {

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName: chatName,
            },
            {
                new: true,
            }
        )
            .populate("users", "-password -status -confirmationCode")
            .populate("groupAdmin", "-password -status -confirmationCode");

        if (!updatedChat) {
            res.status(404).send({ status: 'error', message: 'Chat not found' });
            throw new Error("Chat Not Found");
        } else {
            res.status(200).send({ status: 'success', chat: updatedChat });
        }
    }
    else {
        res.status(401).send({ status: 'error', message: 'You are not authorized to perform this action' });
    }


}

addToGroup = async (req, res) => {

    const chatId = req.body.id
    const userId = req.body.user

    const requestingUserId = req.user.id

    const adminId = await Chat.findById(chatId);
    if (adminId.groupAdmin.toString() === requestingUserId) {

        const added = await Chat.findByIdAndUpdate(chatId,
            { $push: { users: userId } },
            {
                new: true
            }
        )
            .populate("users", "-password -status -confirmationCode")
            .populate("groupAdmin", "-password -status -confirmationCode");

        if (!added) {
            res.status(404).send({ status: 'error', message: 'Chat not found' })
        }
        else {
            res.status(200).send({ status: 'success', chat: added })
        }
    }
    else {
        res.status(401).send({ status: 'error', message: 'You are not authorized to perform this action' });
    }

}

removeFromGroup = async (req, res) => {
    const chatId = req.body.id
    const userId = req.body.user

    const requestingUserId = req.user.id

    const adminId = await Chat.findById(chatId);
    if (adminId.groupAdmin.toString() === requestingUserId) {
        const remove = await Chat.findByIdAndUpdate(chatId,
            { $pull: { users: userId } },
            {
                new: true
            }
        )
            .populate("users", "-password -status -confirmationCode")
            .populate("groupAdmin", "-password -status -confirmationCode");

        if (!remove) {
            res.status(404).send({ status: 'error', message: 'Chat not found' })
        }
        else {
            res.status(200).send({ status: 'success', chat: remove })
        }
    }
    else {
        res.status(401).send({ status: 'error', message: 'You are not authorized to perform this action' });
    }
}

module.exports = { getallUsers, createChat, fetchChat, createGroup, renameGroup, addToGroup, removeFromGroup }