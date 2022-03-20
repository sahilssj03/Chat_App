import { Box } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import SideDrawer from '../../components/SideDrawer';
import MyChats from '../../components/MyChats.js';
import ChatBox from '../../components/ChatBox';
import './ChatPage.css';

const ChatPage = () => {
  const { user } = ChatState();

  const [fetchAgain, setFetchAgain] = useState(false);
  console.log(fetchAgain," FetchAgain");
  return (
    <div>
      {user ? <SideDrawer /> : null}
      <Box className='main-box'>
        {user ?
          <MyChats
            fetchAgain={fetchAgain}
          /> : null}
        {user ?
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          /> : null}
      </Box>
    </div>
  )
}

export default ChatPage