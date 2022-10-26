import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeSearchParameters } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";
import PageIndexContainer from "../filters/PageIndexContainer";
import OrderByContainer from "../filters/OrderByContainer";
import FilterStatusContainer, { getFilterStatus } from "../filters/FilterStatusContainer";
import SearchContainer from "../filters/SearchContainer";
import FilterCategoryContainer from "../filters/FilterCategoryContainer";
import FilterDateContainer, { getFilterDate } from "../filters/FilterDateContainer";
import PostCard from './PostCard';

function MainPage() {
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
        fetch(SERVER_URL + '/api/posts?' + new URLSearchParams(
            {
                page: searchParameters.page,
                orderBy: searchParameters.orderBy,
                filterStatus: getFilterStatus(searchParameters),
                search : searchParameters.search,
                filterCategory: searchParameters.categories.map((category => category.title)).join(','),
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
            if (err.status == 500) {
                window.location.href = '/error';
            }
        });
    }, [
        searchParameters.page, 
        searchParameters.orderBy, 
        searchParameters.activeChecked, 
        searchParameters.inactiveChecked, 
        searchParameters.search, 
        searchParameters.categories, 
        searchParameters.dateFrom,
        searchParameters.dateTo
    ]);

    return (
        <div className='main_page'> 
            <h2>Main page</h2>
            {
                curUser.id && 
                <Link to={'/create-post'} className="button main_button">
                    Create post
                </Link>
            }
            <div className='filter_container'>
                <SearchContainer placeholder="Find posts" />
                <FilterDateContainer />
                <FilterCategoryContainer />
                {
                    curUser.role == 'admin' &&
                    <FilterStatusContainer />
                }
                <OrderByContainer />
                <button onClick={resetSettings} 
                        className="button negative reset_settings">
                    Reset settings
                </button>
            </div>
            <div>
                {
                    posts.length !== 0 
                    ? <>
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                        <PageIndexContainer numberOfPages={Math.ceil(countPosts / limit)}/>
                    </>
                    : <p>No posts found</p>
                }
            </div>
        </div>
    );

    function resetSettings() {
        dispatch(removeSearchParameters());
    }
}

export default MainPage;

