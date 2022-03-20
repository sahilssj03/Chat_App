import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/ChatProvider';
import SingleChat from '../SingleChat';
import './ChatBox.css';

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const {selectedChat} = ChatState();
  return (
    <Box
      d={{base: selectedChat ? "flex" : "none", md:"flex"}}
      w={{base: "100%", md: "68%"}}
      className='chatBoxMainComponent'
    >
      <SingleChat 
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    </Box>
  )
}

export default ChatBox