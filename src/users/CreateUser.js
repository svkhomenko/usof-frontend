import React, { useState } from 'react';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { SERVER_URL, CLIENT_URL } from "../const";
import { checkPasswordConfirmation, validatePassword, validateLogin, validateFullName, validateEmail } from "../tools/dataValidation";

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

    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' }
    ];

    return (
        <div className='display_center'>
            <div className='post_card update_post no_hr user_form'> 
                <h2>Create new user</h2>
                <form onSubmit={handleSubmit}>
                    <div className='label'>Login:</div>
                    <div className='message error'>{loginMessage}</div>
                    <input type="text" value={login} onChange={handleChangeLogin} className="input" />

                    <div className='label'>Password:</div>
                    <div className='message error'>{passwordMessage}</div>
                    <input type="password" value={password} onChange={handleChangePassword} className="input" />

                    <div className='label'>Password confirmation:</div>
                    <div className='message error'>{passwordConfirmationMessage}</div>
                    <input type="password" value={passwordConfirmation} onChange={handleChangePasswordConfirmation} className="input" />

                    <div className='label'>Email:</div>
                    <div className='message error'>{emailMessage}</div>
                    <input type="text" value={email} onChange={handleChangeEmail} className="input" />

                    <div className='label'>Full name:</div>
                    <div className='message error'>{fullNameMessage}</div>
                    <input type="text" value={fullName} onChange={handleChangeFullName} className="input" />

                    <div className='status_select_contatiner'>
                        <div className='label'>Role:</div>
                        <Select value={getRoleValue()} options={roleOptions} 
                                onChange={handleChangeRole} className='status_select' classNamePrefix='status_select' />
                    </div>
                    <input type="submit" value="Create user" className='button submit' />
                </form>
            </div>
        </div>
    );

    function getRoleValue() {
        return roleOptions.find(option => option.value == role);
    }
    
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
        setRole(event.value);
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
                    let resId = response.headers.get('location').split('/')[3];
                    window.location.href = `/users/${resId}`;
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
                    if (/email/i.test(err.message)) {
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
        validData = validateEmail(email, setEmailMessage) && validData;

        return validData;
    }
}

export default CreateUser;

