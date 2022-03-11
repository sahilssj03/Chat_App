import React, { useState } from 'react'

import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'

const Login = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [show, setShow] = useState(false);
    const [picLoading, setPicLoading] = useState(false);

    const handleClick = () => {
        setShow(!show);
    }

    const submitHandler = () => {

    }
    return (
        <VStack spacing='5px'>
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
            

            <Button
                onClick={submitHandler}
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                isLoading={picLoading}
            >
                Login
            </Button>
        </VStack>
    )
}

export default Login