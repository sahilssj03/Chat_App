import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import './SingleChat.css';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../config/ChatLogics';
import ProfileModal from '../ProfileModal';
import UpdateGroupChatModal from '../UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from '../ScrollableChat';
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
import io from 'socket.io-client';

const ENDPOINT = "https://ag-chat-app-node.herokuapp.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, chats } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const fetchMessages = async () => {
        if (!selectedChat)
            return;
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.accessToken}`
                }
            };
            const { data } = await axios.get(`https://ag-chat-app-node.herokuapp.com/${selectedChat._id}`, config);
            setMessages(data.message);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);

        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to load the message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    }

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
        setFetchAgain(!fetchAgain);
    }, [selectedChat]);



    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, [])



    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.message.chat._id) {
                console.log("qwer");
            }
            else {
                setMessages([...messages, newMessageRecieved.message]);
            }
        })
    });

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.data.accessToken}`
                    }
                };
                setNewMessage("");
                const { data } = await axios.post("https://ag-chat-app-node.herokuapp.com/message", {
                    chatId: selectedChat._id,
                    content: newMessage
                }, config);

                socket.emit("new Message", data)
                console.log(socket.emit("new Message", data))

                setMessages([...messages, data.message]);
                setFetchAgain(!fetchAgain);
            } catch (error) {
                toast({
                    title: "Error Occured",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 50000,
                    isClosable: true,
                    position: "bottom"
                });
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) {
            return;
        }
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    return (
        <>
            {selectedChat ?
                (<>
                    <Text fontSize={{ base: "28px", md: "30px" }}
                        justifyContent={{ base: "space-between" }}
                        className='selectedChatMainComponent'
                    >
                        <IconButton
                            d={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal userData={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>

                        )}
                    </Text>
                    <Box className='mainChatBoxContainer'>
                        {
                            loading ? (
                                <Spinner
                                    size="xl"
                                    alignSelf="center"
                                    w={20}
                                    h={20}
                                    margin="auto"
                                />
                            ) :
                                (
                                    <div className='messages'>
                                        <ScrollableChat messages={messages} />
                                    </div>
                                )
                        }
                        <FormControl onKeyDown={sendMessage} isRequired>
                            {isTyping ?
                                <div>
                                    <Lottie
                                        options={defaultOptions}
                                        // height={50}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div> : <></>}
                            <Input
                                variant="filled"
                                bg="#e0e0e0"
                                placeholder="Enter a message..."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
                ) :
                (
                    <Box className='startChatTextContainer'>
                        <Text className='startChatText'>Click on a User to start Chatting</Text>
                    </Box>
                )}
        </>
    )
}

export default SingleChat