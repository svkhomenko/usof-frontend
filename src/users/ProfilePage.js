import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, removeUser } from '../store/slices/userSlice';
import { removeSearchParameters } from '../store/slices/searchParametersSlice';
import { Buffer } from "buffer";
import { SERVER_URL } from "../const";
import avatar from "../images/avatar.png";
import { deleteUserById } from "./user_tools";
import UpdateProfile from "./UpdateProfile";
import UserPosts from "./UserPosts";

function ProfilePage() {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [isUpdating, setIsUpdating] = useState(false);

    let src = avatar;
    if (curUser.profilePicture) {
        src = 'data:image/png;base64,' + Buffer.from(curUser.profilePicture, "binary").toString("base64");
    }

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
                ? <UpdateProfile setIsUpdating={setIsUpdating} />
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
                        <img src={src} alt="avatar" style={{width: "auto",
                                                            height: "100%"}} />
                    </div>
                    <div>{curUser.role}</div>
                    <div>{curUser.status}</div>
                    <div>{curUser.rating}</div>
                </>
            }
            <hr />
            <UserPosts isUpdating={isUpdating} />
        </>
    );

    function deleteAccount() {
        deleteUserById(curUser.id, curUser,
            () => {
                dispatch(removeUser());
            }, () => {
                dispatch(removeUser());
                window.location.href = '/login';
            });
    }
}

export default ProfilePage;

