import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState();
    const [notification, setNotification] = useState([]);

    const history = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInformation"));
        // console.log(userInfo.data.name);
        setUser(userInfo);

        if (!userInfo) {
            history("/");
        }
    }, [history]);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                user,
                setUser,
                notification,
                setNotification,
                chats,
                setChats
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;