import React from 'react';
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'

import './HomePage.css';
import Login from '../../components/Authentication/Login';
import SignUp from '../../components/Authentication/SignUp';

const HomePage = () => {
  return (
    <Container>
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