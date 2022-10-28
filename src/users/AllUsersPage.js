import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setReset, removeSearchParameters } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";
import PageIndexContainer from "../filters/PageIndexContainer";
import SearchContainer from "../filters/SearchContainer";
import UserCard from "./UserCard";

function AllUsersPage() {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);
    const searchParameters = useSelector((state) => state.searchParameters);

    const [users, setUsers] = useState([]);
    const [countUsers, setCountUsers] = useState(0);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        dispatch(removeSearchParameters());
        if (searchParameters.reset) {
            dispatch(removeSearchParameters());
        }
        else {
            dispatch(setReset({
                reset: false
            }));
        }
    }, []);
    
    useEffect(() => {
        fetch(SERVER_URL + '/api/users?' + new URLSearchParams(
            {
                page: searchParameters.page,
                search : searchParameters.search
            }
        ), 
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
        .then((response) => {
            setUsers(response.allUsers);
            setCountUsers(response.countUsers);
            setLimit(response.limit);
        })
        .catch((err) => {
            console.log('err', err, err.body);
            window.location.href = '/error';
        });
    }, [
        searchParameters.page, 
        searchParameters.search
    ]);

    return (
        <div className='main_page category_page'> 
            <h2>Users</h2>
            {
                curUser.role === 'admin' && 
                <Link to={'/create-user'} className="button main_button">
                    Create user
                </Link>
            }
            <div className='category_search_container'>
                <SearchContainer placeholder="Find users" />
                <button onClick={resetSettings}
                        className="button negative reset_settings">
                        Reset settings
                </button>
            </div>
            {
                users.length !== 0 
                ? <>
                    <div className='users_listing'>
                        {users.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                    <PageIndexContainer numberOfPages={Math.ceil(countUsers / limit)}/>
                </>
                : <p>No users found</p>
            }
        </div>
    );

    function resetSettings() {
        dispatch(removeSearchParameters());
    }
}

export default AllUsersPage;

