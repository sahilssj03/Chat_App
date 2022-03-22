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

import io from 'socket.io-client';

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, chats } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false)

    const toast = useToast();

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
            const { data } = await axios.get(`/${selectedChat._id}`, config);
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
        socket.on("connection", () => setSocketConnected(true));
    }, [])

    

    useEffect(() => {
        // console.log("Hi");
        socket.on("message recieved", (newMessageRecieved) => {
            console.log("Hi");
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                console.log("qwer");
            }
            else {
                console.log(newMessageRecieved);
                setMessages([...messages, newMessageRecieved]);
            }
        })
    });

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.data.accessToken}`
                    }
                };
                setNewMessage("");
                const { data } = await axios.post("/message", {
                    chatId: selectedChat._id,
                    content: newMessage
                }, config);

                socket.emit("new Message", data)

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