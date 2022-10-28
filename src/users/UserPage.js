import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { SERVER_URL } from "../const";
import { deleteUserById } from "./user_tools";
import UpdateProfile from "./UpdateProfile";
import { getSrc } from "../tools/tools_func";

function UserPage() {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { id: userId } = useParams();

    const [user, setUser] = useState();
    const [message, setMessage] = useState('User is not found');
    const [isUpdating, setIsUpdating] = useState(false);
    
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
        <div>
            {
                user
                ? <>
                    {
                        isUpdating
                        ? <UpdateProfile user={user} successFunc={successUpdateFunc} />
                        : <div className='user_page'>
                            <div className='buttons_container'>
                                {
                                    (curUser.role === 'admin' || curUser.id == user.id) && 
                                    <button onClick={() => {setIsUpdating(true)}} className="button negative">
                                        Update
                                    </button>
                                    
                                }
                                {
                                    curUser.role === 'admin' && 
                                    <Link to={'/create-user'} className="button main_button">
                                        Create user
                                    </Link>
                                }
                                {
                                    (curUser.role === 'admin' || curUser.id == user.id) && 
                                    <span onClick={deleteAccount} className="like_outer delete">
                                        <iconify-icon icon="fluent:delete-16-filled" />
                                    </span>
                                    
                                }
                            </div>
                            <div className='user_container'>
                                <div className="user_icon_role_outer">
                                    <span className="user_icon_role">{user.role}</span>
                                    <div className="user_icon_outer">
                                        <img src={getSrc(user.profilePicture)} alt="avatar" />
                                    </div>
                                </div>
                                <div className='info'>
                                    <div className='login'>{user.login}</div>
                                    <div>{user.fullName}</div>
                                    <div>{user.email}</div>
                                    <div className='login'>{user.rating}</div>
                                    <div>{user.status}</div>
                                </div>
                            </div>
                        </div>
                    }
                </>
                : <div className='main_message'>{message}</div>
            }
        </div>
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

