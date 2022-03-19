import { Box } from '@chakra-ui/react';
import React from 'react'
import {ChatState} from '../../Context/ChatProvider';
import SideDrawer from '../../components/SideDrawer';
import MyChats from '../../components/MyChats.js';
import ChatBox from '../../components/ChatBox';
import './ChatPage.css';

const ChatPage = () => {
  const {user} = ChatState();
  return (
    <div>
      {user ? <SideDrawer /> : null}
      <Box className='main-box'>
        {user ? <MyChats /> : null}
        {user ? <ChatBox /> : null}
      </Box>
    </div>
  )
}

export default ChatPage