import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameLoggedSender, isSameSender, isSameSenderMargin, isSameUser } from '../../config/ChatLogics';
import { ChatState } from '../../Context/ChatProvider';
import './ScrollableChat.css';

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
    // console.log(messages, "Messages New Data");
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) =>
                <div style={{ display: "flex", alignItems: "center" }}>
                    {
                        ((isSameSender(messages, m, i, user.data.id) || isLastMessage(messages, i, user.data.id)) &&
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
                        marginLeft: `${m.sender._id === user.data.id ? "auto" : (isLastMessage(messages, i, user.data.id) ? "33px" : "3px")}`,
                        marginTop: `${m.sender._id === user.data.id ? "3px" : "6px"}`,
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