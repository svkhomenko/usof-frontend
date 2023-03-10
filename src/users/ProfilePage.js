import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, removeUser } from '../store/slices/userSlice';
import { SERVER_URL } from "../const";
import { deleteUserById } from "./user_tools";
import UpdateProfile from "./UpdateProfile";
import UserPosts from "./UserPosts";
import FavoritesPosts from "./FavoritesPosts";
import { getSrc } from "../tools/tools_func";

function ProfilePage() {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [isUpdating, setIsUpdating] = useState(false);
    const [isFavoritesPosts, setIsFavoritesPosts] = useState(false);

    useEffect(() => {
        fetch(SERVER_URL + `/api/users/${curUser.id}`, 
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
            dispatch(setUser({
                id: data.id,
                login: data.login,
                email: data.email,
                fullName: data.fullName,
                profilePicture: data.profilePicture,
                role: data.role,
                status: data.status,
                rating: data.rating,
                token: curUser.token
            }));
        })
        .catch((err) => {
            console.log('err', err, err.body);
            switch(err.status) {
                case 401:
                case 403:
                case 404:
                    dispatch(removeUser());
                    window.location.href = '/login';
                    break;
                default:
                    window.location.href = '/error';
            }
        });
    }, []);

    return (
        <div className='profile_page'>
            {
                isUpdating
                ? <UpdateProfile user={curUser} successFunc={successUpdateFunc} />
                : <div className='user_page hr'>
                    <div className='buttons_container'>
                        <button onClick={() => {setIsUpdating(true)}} className="button negative">
                            Update
                        </button>
                        {
                            curUser.role === 'admin' && 
                            <Link to={'/create-user'} className="button main_button">
                                Create user
                            </Link>
                        }
                        <span onClick={deleteAccount} className="like_outer delete">
                            <iconify-icon icon="fluent:delete-16-filled" />
                        </span>
                    </div>
                    <div className='user_container'>
                        <div className="user_icon_role_outer">
                            <span className="user_icon_role">{curUser.role}</span>
                            <div className="user_icon_outer">
                                <img src={getSrc(curUser.profilePicture)} alt="avatar" />
                            </div>
                        </div>
                        <div className='info'>
                            <div className='login'>{curUser.login}</div>
                            <div>{curUser.fullName}</div>
                            <div>{curUser.email}</div>
                            <div className='login'>{curUser.rating}</div>
                            <div>{curUser.status}</div>
                        </div>
                    </div>
                </div>
            }
            <div className='navigation'>
                <div onClick={() => {setIsFavoritesPosts(false)}} className={isFavoritesPosts ? '' : 'active'}>
                    Your posts
                </div>
                <div onClick={() => {setIsFavoritesPosts(true)}} className={isFavoritesPosts ? 'active' : ''}>
                    Favorites posts
                </div>
            </div>
            {
                isFavoritesPosts 
                ? <FavoritesPosts isUpdating={isUpdating} />
                : <UserPosts isUpdating={isUpdating} />
            }
        </div>
    );
    
    function deleteAccount() {
        deleteUserById(curUser.id, curUser,
            () => {
                dispatch(removeUser());
            },
            () => {
                dispatch(removeUser());
                window.location.href = '/login';
            }
        );
    }

    function successUpdateFunc(data) {
        dispatch(setUser({
            id: data.id,
            login: data.login,
            email: data.email,
            fullName: data.fullName,
            profilePicture: data.profilePicture,
            role: data.role,
            status: data.status,
            rating: data.rating,
            token: curUser.token
        }));
        setIsUpdating(false);
    }
}

export default ProfilePage;

