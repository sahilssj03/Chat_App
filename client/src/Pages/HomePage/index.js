import React, { useEffect } from 'react';
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'

import './HomePage.css';
import Login from '../../components/Authentication/Login';
import SignUp from '../../components/Authentication/SignUp';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const history = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInformation"));

        if (userInfo) {
            history("/chats");
        }
    }, [history]);
  return (
    <Container className='main-wrapper'>
      <Box className='UpperBox'>
        <Text className='UpperBox-text'>Chat App</Text>
      </Box>
      <Box className='LowerBox'>
        <Tabs variant='soft-rounded'>
          <TabList>
            <Tab className='tab'>Login</Tab>
            <Tab className='tab'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage