import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, removeUser } from './store/slices/userSlice';
import { Buffer } from "buffer";
import { SERVER_URL } from "./const";
import avatar from "./images/avatar.png";

function Header() {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    let src = avatar;
    if (curUser.profilePicture) {
        src = 'data:image/png;base64,' + Buffer.from(curUser.profilePicture, "binary").toString("base64");
    }
    
    return (
        <header> 
            <h1><Link to={'/'}>Usof</Link></h1>
            {/* <div>
                <Link to={'/'}>Posts</Link>
                <Link to={'/categories'}>Categories</Link>
                <Link to={'/users'}>Users</Link>
            </div> */}
            <input className="search_input" type="search" placeholder="Search" />
            {
                curUser.id 
                ? <div className='header_buttons_container'>
                    <button className="button first" onClick={logout}>Log out</button>
                    <Link to={'/profile'} className="cur_user_container">
                        <span className="cur_user_role">{curUser.role}</span>
                        <div className="cur_user_outer">
                            <img src={src} alt="avatar" />
                        </div>
                        <span>{curUser.login}</span>
                    </Link>
                </div>
                : <div className='header_buttons_container'>
                    <Link to={'/register'} className="button negative first">
                        Create account
                    </Link>
                    <Link to={'/login'} className="button">
                        Log in
                    </Link>
                </div>
            }
            {/* <span className='delimiter'>·</span> */}
        </header>
    );

    function logout() {
        fetch(SERVER_URL + '/api/auth/logout', {
            method: 'POST',
            headers: {
                'authorization': curUser.token
            }
        })
        .then(() => {
            dispatch(removeUser());
        })
        .catch((err) => {
            console.log('err', err, err.body);
            window.location.href = '/error';
        }); 
    }
}

export default Header;

