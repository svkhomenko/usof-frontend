import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import { SERVER_URL } from "../const";

function EmailConfirmation() {
    let { token } = useParams();
    token = token.replaceAll('dot', '.');

    const [message, setMessage] = useState('Processing request...');

    useEffect(() => {
        fetch(SERVER_URL + `/api/auth/email-confirmation/${token}`, {
            method: 'POST'
        })
        .then((response) => {
            if (!response.ok) {
                throw response;
            }
            else {
                setMessage('Email was successfully verified');
            }
        })
        .catch((err) => {
            console.log('err', err, err.body);
            switch(err.status) {
                case 401:
                    return err.json();
                default:
                    window.location.href = '/error';
            }
        })
        .then((err) => {
            if (err && err.message) {
                setMessage(err.message);
            }
        }); 
    }, []);

    return (
        <>
            <p>{message}</p>
            <p>
                <Link to={'/login'}>
                    Go to the login page
                </Link>
            </p>
        </>
    );
}

export default EmailConfirmation;

