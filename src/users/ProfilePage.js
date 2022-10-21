import React, { useState, useEffect } from 'react';
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
        <>
            {
                isUpdating
                ? <UpdateProfile user={curUser} successFunc={successUpdateFunc} />
                : <>
                    <button onClick={deleteAccount}>Delete</button>
                    <button onClick={() => {setIsUpdating(true)}}>
                        Update
                    </button>
                    <div>{curUser.login}</div>
                    <div>{curUser.email}</div>
                    <div>{curUser.fullName}</div>
                    <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "50px",
                            height: "50px",
                            overflow: "hidden"
                    }}>
                        <img src={getSrc(curUser.profilePicture)} alt="avatar" style={{width: "auto",
                                                            height: "100%"}} />
                    </div>
                    <div>{curUser.role}</div>
                    <div>{curUser.status}</div>
                    <div>{curUser.rating}</div>
                </>
            }
            <hr />
            <div onClick={() => {setIsFavoritesPosts(false)}}>Your posts</div>
            <div onClick={() => {setIsFavoritesPosts(true)}}>Favorites posts</div>
            {
                isFavoritesPosts 
                ? <FavoritesPosts isUpdating={isUpdating} />
                : <UserPosts isUpdating={isUpdating} />
            }
        </>
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

