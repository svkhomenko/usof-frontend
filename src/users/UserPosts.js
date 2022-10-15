import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeSearchParameters } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";
import PageIndexContainer from "../filters/PageIndexContainer";
import OrderByContainer from "../filters/OrderByContainer";
import FilterStatusContainer, { getFilterStatus } from "../filters/FilterStatusContainer";
import SearchContainer from "../filters/SearchContainer";
import FilterDateContainer, { getFilterDate } from "../filters/FilterDateContainer";
import PostCard from '../posts/PostCard';

function UserPosts({ isUpdating }) {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);
    const searchParameters = useSelector((state) => state.searchParameters);

    const [posts, setPosts] = useState([]);
    const [countPosts, setCountPosts] = useState(0);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        dispatch(removeSearchParameters());
    }, []);

    useEffect(() => {
        fetch(SERVER_URL + `/api/posts/own-posts?` + new URLSearchParams(
            {
                page: searchParameters.page,
                orderBy: searchParameters.orderBy,
                filterStatus: getFilterStatus(searchParameters),
                search : searchParameters.search,
                filterDate: getFilterDate(searchParameters)
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
            setPosts(response.allPosts);
            setCountPosts(response.countPosts);
            setLimit(response.limit);
        })
        .catch((err) => {
            console.log('err', err, err.body);
            switch(err.status) {
                case 401:
                    dispatch(removeUser());
                    window.location.href = '/login';
                    break;
                default:
                    window.location.href = '/error';
            }
        });
    }, [
        searchParameters.page, 
        searchParameters.orderBy, 
        searchParameters.activeChecked, 
        searchParameters.inactiveChecked, 
        searchParameters.search, 
        searchParameters.dateFrom,
        searchParameters.dateTo,
        isUpdating
    ]);

    return (
        <>
            <h2>{countPosts} your posts</h2>
            <OrderByContainer />
            <FilterStatusContainer />
            <SearchContainer />
            <FilterDateContainer />
            <button onClick={resetSettings}>Reset settings</button>
            <div>
                {
                    posts.length !== 0 
                    ? <>
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </>
                    : <p>No posts found</p>
                }
            </div>
            <PageIndexContainer numberOfPages={Math.ceil(countPosts / limit)}/>
        </>
    );

    function resetSettings() {
        dispatch(removeSearchParameters());
    }
}

export default UserPosts;

