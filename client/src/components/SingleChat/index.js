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

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat,chats } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    // console.log(selectedChat.users);

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
            setMessages(data);
            console.log(messages);
            setLoading(false);
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
        console.log(messages);
    }, [selectedChat,chats]);
    console.log(chats);

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
                setMessages([...messages, data]);
                console.log(messages);
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
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
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