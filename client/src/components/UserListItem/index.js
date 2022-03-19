import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../../Context/ChatProvider';

import './UserListItem.css';

const UserListItem = ({ handleFunction, user }) => {
    // const { user } = ChatState();

    return (
        <Box
            onClick={handleFunction}
            className='user-main-wrapper'
            _hover={{
                background: "#38B2AC",
                color: "white",
            }}>
            <Avatar
                name={user.name}
                src={user.image}
                size="sm"
                className='avatar'
            />
            <Box>
                <Text>{user.name}</Text>
                <Text d="flex">
                    <b>Email: </b><div className='email'>{user.email}</div>
                </Text>
            </Box>
        </Box>
    )
}

export default UserListItem