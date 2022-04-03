/* eslint-disable react-hooks/exhaustive-deps */
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useToast } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react'
import { useDisclosure } from "@chakra-ui/hooks";
import axios from 'axios';

import { useNavigate } from 'react-router-dom';


import './SideDrawer.css';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from '../ProfileModal';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserListItem';

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lodingChat, setLodingChat] = useState();

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const history = useNavigate();
    const {
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats
    } = ChatState();

    const logOutHandler = () => {
        localStorage.removeItem("userInformation");
        history("/");
        window.location.reload()
    };


    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter Sonething in Search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.accessToken}`
                }
            };

            const { data } = await axios.get(`https://ag-chatapp.herokuapp.com/users?search=${search}`, config);
            setLoading(false);
            setSearchResult(data.users);
            // console.log(data.users);
        } catch (error) {
            toast({
                title: "Error Orrured",
                description: "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const accessChat = async (userId) => {
        try {
            setLodingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.data.accessToken}`,
                }
            };
            const { data } = await axios.post("https://ag-chatapp.herokuapp.com/chat", {
                id: userId
            }, config);

            if (!chats.find((val) => val._id === data.chat._id))
                setChats([data.chat, ...chats]);
            // console.log(chats);
            setSelectedChat(data.chat);
            setLodingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    return (
        <>
            <Box className='upper-box'>
                <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
                    <Button bg="white" onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text className='search-text'>Search User</Text>
                    </Button>
                </Tooltip>
                <Text className='logo-text'>Chat-App</Text>
                <div>
                    <Menu>
                        <MenuButton>
                            <BellIcon style={{ fontSize: '25px' }} />
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} className='profile-menu'>
                            <Avatar src={user.data.image} size="sm" />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logOutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                size="sm"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box d="flex">
                            <Input
                                placeholder='Search by name or email'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                ml={1.5}
                                onClick={handleSearch}
                            >
                                Go
                            </Button>
                        </Box>
                        <br />
                        {
                            loading ? <ChatLoading /> : (
                                searchResult?.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)}
                                    />
                                )))
                        }
                        {lodingChat && <Spinner />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer;