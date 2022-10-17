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
        <> 
            <h1><Link to={'/'}>Usof</Link></h1>
            <div>
                <Link to={'/'}>Posts</Link>
                <Link to={'/categories'}>Categories</Link>
                <Link to={'/users'}>Users</Link>
            </div>
            {
                curUser.id 
                ? <>
                    <button onClick={logout}>Log out</button>
                    <Link to={'/profile'}>
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
                        <div>{curUser.login}</div>
                    </Link>
                </>
                : <>
                    <p>
                        <Link to={'/register'}>
                            Create account
                        </Link>
                    </p>
                    <p>
                        <Link to={'/login'}>
                            Log in
                        </Link>
                    </p>
                </>
            }
        </>
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

