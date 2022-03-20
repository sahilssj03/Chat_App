import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserBadgeItem';
import UserListItem from '../UserListItem';
import './UpdateGroupChatModal.css';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);

    const toast = useToast();

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


    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.accessToken}`,
                },
            };
            const { data } = await axios.put("/rename",
                {
                    name: groupChatName,
                    id: selectedChat._id,
                },
                config
            );

            // console.log(data._id, data);
            // setSelectedChat("");
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                // description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        // console.log(selectedChat.groupAdmin._id, user);
        if (selectedChat.groupAdmin._id !== user.data.id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.accessToken}`,
                },
            };
            const { data } = await axios.put("/groupadd",
                {
                    id: selectedChat._id,
                    user: user1._id,
                },
                config
            );
            // console.log(data);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    const handleRemove = async (user1) => {
        // console.log(user1, user, selectedChat);
        if (selectedChat.groupAdmin._id !== user.data.id && user1._id !== user.data.id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.accessToken}`,
                },
            };
            const { data } = await axios.put("/groupremove",
                {
                    id: selectedChat._id,
                    user: user1._id,
                },
                config
            );
            // console.log(data);

            user1.data.id === user.data.id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    return (
        <>
            <IconButton icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className='modal-header-component'>
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%" d="flex" flexWrap="wrap" mb={2}>
                            {selectedChat.users.map(u => (
                                <UserBadgeItem
                                    key={user.data.id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl d="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={() => handleRemove(user)} >
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default UpdateGroupChatModal;