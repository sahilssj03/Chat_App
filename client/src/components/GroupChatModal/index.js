import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserBadgeItem';
import UserListItem from '../UserListItem';
import './GroupChatModal.css';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();
    console.log(user , " user");
    console.log(chats , " chats");

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query)
            return;

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.accessToken}`
                }
            };
            const { data } = await axios.get(`/users?search=${search}`, config);
            // console.log(data.users);
            setLoading(false);
            setSearchResult(data.users);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.accessToken}`
                }
            };
            const { data } = await axios.post("/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config);
            console.log(data.chats, "data Chats");
            console.log(chats, "chats");
            setChats([data.chats, ...chats]);
            onClose();
            console.log("Hi");
            toast({
                title: "New Group Chat Created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        } catch (error) {
            toast({
                title: "Failed to create new group",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        }
    }

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
    }

    const handleGroup = (userAdd) => {
        if (selectedUsers.includes(userAdd)) {
            toast({
                title: "User Already Exists",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userAdd]);
    }

    // console.log(searchResult);

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className='modal-header'>
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className='modal-body'>
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add Users eg: Aakash, Sanjay'
                                mb={2}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box d="flex" flexWrap="wrap">
                            {
                                selectedUsers.map(u => (
                                    <UserBadgeItem
                                        key={user.data.id}
                                        user={u}
                                        handleFunction={() => handleDelete(u)}
                                    />
                                ))
                            }
                        </Box>
                        {loading ? <div>Loading</div> : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)}
                                />))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal