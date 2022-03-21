import React, { useState } from 'react'
import { useDisclosure } from "@chakra-ui/hooks";
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';

import './ProfileModal.css';
import { ViewIcon } from '@chakra-ui/icons';

const ProfileModal = ({ children }) => {
    const { user } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {
                children ? (
                    <span onClick={onOpen}>{children}</span>
                ) : (
                    <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
                )
            }
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className='modal-header'>{user.data.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className='modal-body'>
                        <Image
                            className='modal-image'
                            src={user.data.image}
                        />
                        <Text className='modal-email'>{user.data.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal