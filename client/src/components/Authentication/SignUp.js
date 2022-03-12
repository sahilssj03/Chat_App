import React, { useState } from 'react'

import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'

import { useToast } from "@chakra-ui/toast";
// import axios from "axios";
import { useHistory } from "react-router-dom";

import './Authentication.css';

const SignUp = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [show, setShow] = useState(false);
    const [picLoading, setPicLoading] = useState(false);
    const toast = useToast();
    // const history = useHistory();

    const handleClick = () => {
        setShow(!show);
    }

    const postDetails = (pics) => {
        setPicLoading(true);
        if(pics === undefined){
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        console.log(pics);
        if(pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dhhv0rrwy");
            fetch("https://api.cloudinary.com/v1_1/dhhv0rrwy/image/upload", {
                method: "post",
                body: data
            })
            .then((res) => res.json())
            .then((data) => {
                setPic(data.url.toString());
                console.log(pic);
                setPicLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setPicLoading(false);
            })
        }
        else{
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            setPicLoading(false);
            return;
        }
    };

    const submitHandler = () => {

    }

    return (
        <VStack spacing='5px'>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter Your Name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Enter Your Password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button onClick={handleClick} h='1.7rem'>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button onClick={handleClick} h='1.7rem'>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic' isRequired>
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="images/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button
                onClick={submitHandler}
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                isLoading={picLoading}
            >
                SignUp
            </Button>
        </VStack>
    )
}

export default SignUp