import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { SERVER_URL, CLIENT_URL } from "../const";

function SendPasswordConfirmation() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errMessage, setErrMessage] = useState('');

    return (
        <>
            {
                message 
                ? <h1>{message}</h1>
                : <>
                    <h1>Send password confirmation</h1>
                    <p>{errMessage}</p>
                    <p>Please enter the email you use for registration</p>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Email:
                            <input type="email" value={email} onChange={handleChangeEmail} required />
                        </label>
                        <input type="submit" value="Request password reset" />
                    </form>
                </>
            }
            <p>
                <Link to={'/login'}>
                    Go to the login page
                </Link>
            </p>
        </>
    );

    function handleChangeEmail(event) {
        setEmail(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();

        fetch(SERVER_URL + '/api/auth/password-reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email,
                link: CLIENT_URL + '/password-reset'
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw response;
            }
            else {
                setMessage(`Password reset confirmation sent to email ${email}`);
            }
        })
        .catch((err) => {
            console.log('err', err, err.body);
            switch(err.status) {
                case 400:
                case 404:
                    return err.json();
                default:
                    window.location.href = '/error';
            }
        })
        .then((err) => {
            if (err && err.message) {
                setErrMessage(err.message);
            }
        }); 
    }
}

export default SendPasswordConfirmation;

