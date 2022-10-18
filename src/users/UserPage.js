import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, removeUser } from '../store/slices/userSlice';
import { removeSearchParameters } from '../store/slices/searchParametersSlice';
import { Buffer } from "buffer";
import { SERVER_URL } from "../const";
import avatar from "../images/avatar.png";
import { deleteUserById } from "./user_tools";
import UpdateProfile from "./UpdateProfile";

function UserPage() {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { id: userId } = useParams();

    const [user, setUser] = useState();
    const [message, setMessage] = useState('User is not found');
    const [isUpdating, setIsUpdating] = useState(false);

    let src = avatar;
    if (user && user.profilePicture) {
        src = 'data:image/png;base64,' + Buffer.from(user.profilePicture, "binary").toString("base64");
    }
    
    useEffect(() => {
        fetch(SERVER_URL + `/api/users/${userId}`, 
        {
            method: 'GET',
            headers: {
                'authorization': curUser.token
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .then((data) => {
            setUser(data);
        })
        .catch((err) => {
            console.log('err', err, err.body);
            switch(err.status) {
                case 401:
                case 403:
                case 404:
                    setUser(null);
                    break;
                default:
                    window.location.href = '/error';
            }
        });
    }, []);

    return (
        <> 
            {
                user
                ? <>
                    {
                        isUpdating
                        ? <UpdateProfile user={user} successFunc={successUpdateFunc} />
                        : <>
                            {
                                (curUser.role === 'admin' || curUser.id == user.id) && 
                                <>
                                    <button onClick={deleteAccount}>Delete</button>
                                    <button onClick={() => {setIsUpdating(true)}}>
                                        Update
                                    </button>
                                </>
                            }
                            <div>{user.login}</div>
                            <div>{user.email}</div>
                            <div>{user.fullName}</div>
                            <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "50px",
                                    height: "50px",
                                    overflow: "hidden"
                            }}>
                                <img src={src} alt="avatar" style={{width: "auto",
                                                                    height: "100%"}} />
                            </div>
                            <div>{user.role}</div>
                            <div>{user.status}</div>
                            <div>{user.rating}</div>
                        </>
                    }
                </>
                : <p>{message}</p>
            }
        </>
    );

    function deleteAccount() {
        deleteUserById(user.id, curUser,
            () => {
                dispatch(removeUser());
            },
            () => {
                if (user.id == curUser.id) {
                    dispatch(removeUser());
                    window.location.href = '/login';
                }
                else {
                    setUser(null);
                    setMessage('User was successfully deleted');
                }                
            }
        );
    }

    function successUpdateFunc(data) {
        setUser(data);
        setIsUpdating(false);
    }
}

export default UserPage;

