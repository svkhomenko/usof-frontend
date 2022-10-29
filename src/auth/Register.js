import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { checkPasswordConfirmation, validatePassword, validateLogin, validateFullName, validateEmail } from "../tools/dataValidation";
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

    // return (
    //     <> 
    //         <h2>Register</h2>
    //         <p>{mainMessage}</p>
    //         <form onSubmit={handleSubmit}>
    //             <label>
    //                 Login:
    //                 <p>{loginMessage}</p>
    //                 <input type="text" value={login} onChange={handleChangeLogin} />
    //             </label>
    //             <label>
    //                 Password:
    //                 <p>{passwordMessage}</p>
    //                 <input type="password" value={password} onChange={handleChangePassword} />
    //             </label>
    //             <label>
    //                 Password confirmation:
    //                 <p>{passwordConfirmationMessage}</p>
    //                 <input type="password" value={passwordConfirmation} onChange={handleChangePasswordConfirmation} />
    //             </label>
    //             <label>
    //                 Email:
    //                 <p>{emailMessage}</p>
    //                 <input type="text" value={email} onChange={handleChangeEmail} />
    //             </label>
    //             <label>
    //                 Full name:
    //                 <p>{fullNameMessage}</p>
    //                 <input type="text" value={fullName} onChange={handleChangeFullName} />
    //             </label>
    //             <input type="submit" value="Register" />
    //         </form>
    //         <p>
    //             Already have an account? 
    //             <Link to={'/login'}>
    //                 Log in
    //             </Link>
    //         </p>
    //     </>
    // );

    return (
        <div className='display_center'>
            <div className='post_card no_hr user_form'>
                <h2>Register</h2>
                <div className='message success'>{mainMessage}</div>
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

                    <input type="submit" value="Register" className='button submit' />
                </form>
                <div className='auth_link'>
                    Already have an account?{' '}
                    <Link to={'/login'}>
                        Log in
                    </Link>
                </div>
            </div>
        </div>
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

export default Register;

