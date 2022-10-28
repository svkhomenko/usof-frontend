import React from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { setReset } from '../store/slices/searchParametersSlice';
import { deleteUserById } from "./user_tools";
import { getSrc } from "../tools/tools_func";

function UserCard({ user }) {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    return (
        <div className='user_card_outer'>
            {
                (curUser.role === 'admin' || curUser.id == user.id) && 
                <div onClick={deleteAccount} className="like_outer delete">
                    <iconify-icon icon="fluent:delete-16-filled" />
                </div>
            }
            <Link to={getLink()} className='user_card'>
                <div className="user_icon_role_outer">
                    <span className="user_icon_role">{user.role}</span>
                    <div className="user_icon_outer">
                        <img src={getSrc(user.profilePicture)} alt="avatar" />
                    </div>
                </div>
                <div className='info'>
                    <span className='login'>{user.login}</span>
                    <span className='delimiter'>·</span>
                    <span>{user.fullName}</span>
                    <div>{user.email}</div>
                    <span className='login'>{user.rating}</span>
                    <span className='delimiter'>·</span>
                    <span>{user.status}</span>
                </div>
            </Link>
        </div>
    );

    function getLink() {
        if (user.id == curUser.id) {
            return '/profile';
        }
        return `/users/${user.id}`;
    }

    function deleteAccount(event) {
        console.log('here');
        event.preventDefault();

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

