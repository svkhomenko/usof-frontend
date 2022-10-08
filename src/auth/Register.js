import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { checkPasswordConfirmation, validatePassword, validateLogin, validateFullName } from "../tools/dataValidation";
import { SERVER_URL, CLIENT_URL } from "../const";

function Register() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');

    const [mainMessage, setMainMessage] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordConfirmationMessage, setPasswordConfirmationMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [fullNameMessage, setFullNameMessage] = useState('');

    return (
        <> 
            <h1>Register</h1>
            <p>{mainMessage}</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Login:
                    <p>{loginMessage}</p>
                    <input type="text" value={login} onChange={handleChangeLogin} required />
                </label>
                <label>
                    Password:
                    <p>{passwordMessage}</p>
                    <input type="password" value={password} onChange={handleChangePassword} required />
                </label>
                <label>
                    Password confirmation:
                    <p>{passwordConfirmationMessage}</p>
                    <input type="password" value={passwordConfirmation} onChange={handleChangePasswordConfirmation} required />
                </label>
                <label>
                    Email:
                    <p>{emailMessage}</p>
                    <input type="email" value={email} onChange={handleChangeEmail} required />
                </label>
                <label>
                    Full name:
                    <p>{fullNameMessage}</p>
                    <input type="text" value={fullName} onChange={handleChangeFullName} required />
                </label>
                <input type="submit" value="Register" />
            </form>
            <p>
                Already have an account? 
                <Link to={'/login'}>
                    Log in
                </Link>
            </p>
        </>
    );

    function handleChangeLogin(event) {
        setLogin(event.target.value);
    }
    
    function handleChangePassword(event) {
        setPassword(event.target.value);
    } 

    function handleChangePasswordConfirmation(event) {
        setPasswordConfirmation(event.target.value);
    } 

    function handleChangeEmail(event) {
        setEmail(event.target.value);
    }

    function handleChangeFullName(event) {
        setFullName(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();

        setMainMessage('');
        setLoginMessage('');
        setPasswordMessage('');
        setPasswordConfirmationMessage('');
        setEmailMessage('');
        setFullNameMessage('');

        if (isDataValid()) {
            fetch(SERVER_URL + '/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    login,
                    password,
                    passwordConfirmation,
                    email,
                    fullName,
                    link: CLIENT_URL + '/email-confirmation'
                })
            })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                else {
                    setMainMessage('User was successfully created');
                    setLogin('');
                    setPassword('');
                    setPasswordConfirmation('');
                    setEmail('');
                    setFullName('');
                }
            })
            .catch((err) => {
                console.log('err', err, err.body);
                switch(err.status) {
                    case 400:
                        return err.json();
                    default:
                        window.location.href = '/error';
                }
            })
            .then((err) => {
                if (err && err.message) {
                    if (err.message.includes('email')) {
                        setEmailMessage(err.message);
                    }
                    else if (err.message.includes('Full name')) {
                        setFullNameMessage(err.message);
                    }
                    else if (/login/i.test(err.message)) {
                        setLoginMessage(err.message);
                    }
                    else if (err.message.includes('password confirmation')) {
                        setPasswordConfirmationMessage(err.message);
                    }
                    else if (err.message.includes('Password')) {
                        setPasswordMessage(err.message);
                    }
                }
            }); 
        }
    }

    function isDataValid() {
        let validData = true;

        validData = checkPasswordConfirmation(password, passwordConfirmation, setPasswordConfirmationMessage) && validData;
        validData = validatePassword(password, setPasswordMessage) && validData;
        validData = validateLogin(login, setLoginMessage) && validData;
        validData = validateFullName(fullName, setFullNameMessage) && validData;

        return validData;
    }
}

export default Register;

