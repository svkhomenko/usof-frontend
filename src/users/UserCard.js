import React from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { setReset } from '../store/slices/searchParametersSlice';
import { Buffer } from "buffer";
import { deleteUserById } from "./user_tools";
import avatar from "../images/avatar.png";

function UserCard({ user }) {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    let src = avatar;
    if (user.profilePicture) {
        src = 'data:image/png;base64,' + Buffer.from(user.profilePicture, "binary").toString("base64");
    }
    
    return (
        <div>
            {
                (curUser.role === 'admin' || curUser.id == user.id) && 
                <button onClick={deleteAccount}>Delete</button>
            }
            <Link to={`/users/${user.id}`}>
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
            </Link>
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
                    dispatch(setReset({
                        reset: false
                    }));
                    window.location.href = '/users';
                }
            }
        );
    }
}

export default UserCard;

