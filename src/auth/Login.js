import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, removeUser } from '../store/slices/userSlice';
import { SERVER_URL, CLIENT_URL } from "../const";

function Login() {
    // const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const [errMessage, setErrMessage] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    return (
        <> 
            <h2>Login</h2>
            <p>{errMessage}</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Login:
                    {loginMessage}
                    <input type="text" value={login} onChange={handleChangeLogin} />
                </label>
                <label>
                    Password:
                    {passwordMessage}
                    <input type="password" value={password} onChange={handleChangePassword} />
                </label>
                <input type="submit" value="Log in" />
            </form>
            <p>
                Don't have an account yet? 
                <Link to={'/register'}>
                    Create one
                </Link>
            </p>
            <p>
                Forgot your password? 
                <Link to={'/password-reset'}>
                    Reset it
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

    function handleSubmit(event) {
        event.preventDefault();

        setLoginMessage('');
        setPasswordMessage('');

        if (isDataValid()) {
            fetch(SERVER_URL + '/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    login,
                    password,
                    link: CLIENT_URL + '/email-confirmation' })
            })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then((data) => {
                dispatch(setUser({
                    id: data.id,
                    login: data.login,
                    email: data.email,
                    fullName: data.fullName,
                    profilePicture: data.profilePicture,
                    role: data.role,
                    status: data.status,
                    rating: data.rating,
                    token: data.token
                }));
            })
            .catch((err) => {
                console.log('err', err, err.body);
                switch(err.status) {
                    case 400:
                    case 403:
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

    function isDataValid() {
        let validData = true;

        if (!login) {
            setLoginMessage("Login is required");
            validData = false;
        }
        if (!password) {
            setPasswordMessage("Password is required");
            validData = false;
        }

        return validData;
    }
}

export default Login;

