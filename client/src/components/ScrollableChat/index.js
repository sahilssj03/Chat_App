import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameLoggedSender, isSameSender, isSameSenderMargin, isSameUser } from '../../config/ChatLogics';
import { ChatState } from '../../Context/ChatProvider';
import './ScrollableChat.css';

const ScrollableChat = ({ messages }) => {
    const messagesData = messages.message;
    const { user } = ChatState();
    console.log(messagesData, );
    console.log(user.data.id);
    // console.log(isSameSenderMargin(messagesData, messagesData[0], 0, user.data.id));
    return (
        <ScrollableFeed>
            {messagesData && messagesData.map((m, i) => 
            <div key={m._id} style={{display: "flex", alignItems:"center"}}>
                {
                    ((isSameSender(messagesData, m, i, user.data.id) || isLastMessage(messagesData, i, user.data.id)) &&
                        <Tooltip label={m.sender.name}
                            placement="bottom-start"
                            hasArrow
                        >
                            <Avatar
                                mt="7px"
                                mr={1}
                                size="sm"
                                cursor="pointer"
                                name={m.sender.name}
                                src={m.sender.image}
                            />
                        </Tooltip>
                    )
                }
                <span style={{
                    backgroundColor: `${m.sender._id === user.data.id ? "#BEE3F8" : "#B9F5D0"}`,
                    marginLeft:`${m.sender._id === user.data.id ? "auto" : (isLastMessage(messagesData, i, user.data.id) ? "33px" : "3px")}`,
                    marginTop:`${m.sender._id === user.data.id ? "3px" : "6px"}`,
                    }} 
                    className='chatStyles'
                >
                    {m.content}
                </span>
            </div>)}
        </ScrollableFeed>
    )
}

export default ScrollableChat