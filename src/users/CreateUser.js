import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, removeUser } from '../store/slices/userSlice';
import { SERVER_URL, CLIENT_URL } from "../const";
import { checkPasswordConfirmation, validatePassword, validateLogin, validateFullName } from "../tools/dataValidation";

function CreateUser() {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('user');

    const [loginMessage, setLoginMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordConfirmationMessage, setPasswordConfirmationMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [fullNameMessage, setFullNameMessage] = useState('');

    return (
        <> 
            <h1>Create new user</h1>
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
                <label>
                    Role:
                    <select value={role} onChange={handleChangeRole}>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </label>
                <input type="submit" value="Create user" />
            </form>
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

    function handleChangeRole(event) {
        setRole(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();

        setLoginMessage('');
        setPasswordMessage('');
        setPasswordConfirmationMessage('');
        setEmailMessage('');
        setFullNameMessage('');

        if (isDataValid()) {
            fetch(SERVER_URL + '/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': curUser.token
                },
                body: JSON.stringify({ 
                    login,
                    password,
                    passwordConfirmation,
                    email,
                    fullName,
                    role,
                    link: CLIENT_URL + '/email-confirmation'
                })
            })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                else {
                    console.log(response.headers.location);
                    // setLogin('');
                    // setPassword('');
                    // setPasswordConfirmation('');
                    // setEmail('');
                    // setFullName('');

                    // res.setHeader("Location", `/api/users/${user.id}`)
//             .status(201).send();
                }
            })
            .catch((err) => {
                console.log('err', err, err.body);
                switch(err.status) {
                    case 400:
                        return err.json();
                    case 401:
                    case 403:
                        dispatch(removeUser());
                        window.location.href = '/login';
                        break;
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
                    else {
                        window.location.href = '/error';
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

export default CreateUser;

