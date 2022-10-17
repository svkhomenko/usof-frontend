import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { setReset } from '../store/slices/searchParametersSlice';
import { Buffer } from "buffer";
// import { deleteCategoryById } from './category_tools';
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
            {/* <button onClick={deleteAccount}>Delete</button>
            <button onClick={() => {setIsUpdating(true)}}>
                Update
            </button> */}
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
        </div>
    );

    function deleteCategory() {
        deleteCategoryById(category.id, curUser,
            () => {
                dispatch(removeUser());
            },
            () => {
                dispatch(setReset({
                    reset: false
                }));
                // navigate(0);
                // navigate("/categories");
                window.location.href = '/categories';
            }
        );
    }
}

export default UserCard;

