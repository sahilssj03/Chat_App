import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const ConfirmationHandler = () => {
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("userInformation"));

    const history = useNavigate();

    var URL = window.location.href.split('/');

    const confirmationCode = URL[URL.length - 1]
    const apiCall = async () => {
        setLoading(true);
        const res = await axios.get('https://ag-chatapp.herokuapp.com/confirm/' + confirmationCode)
        localStorage.setItem('userInformation', JSON.stringify(res.data));
        console.log(localStorage.setItem('userInformation', JSON.stringify(res.data)))
        const userInfo = JSON.parse(localStorage.getItem("userInformation"));
        setLoading(false);
        if (userInfo) {
            history("/chats");
        }
    }
    useEffect(() => {
        if (user == null) {
            apiCall();
        }
        else {
            history("/chats");
        }
    }, [confirmationCode])
    return (
        <div>
            {loading ? <Spinner /> : null}
        </div>
    )
}

export default ConfirmationHandler;