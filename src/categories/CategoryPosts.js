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

function CategoryPosts({ isUpdating }) {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);
    const searchParameters = useSelector((state) => state.searchParameters);

    const { id: categoryId } = useParams();

    const [posts, setPosts] = useState([]);
    const [countPosts, setCountPosts] = useState(0);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        dispatch(removeSearchParameters());
    }, []);

    useEffect(() => {
        fetch(SERVER_URL + `/api/categories/${categoryId}/posts?` + new URLSearchParams(
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
            if (err.status == 500) {
                window.location.href = '/error';
            }
        });
    }, [
        categoryId,
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
        <div className='post_comments_outer'>
            <div className='small_title'>
                {countPosts} post{countPosts != 1 && 's'}
            </div>
            <div className='filter_container'>
                <SearchContainer placeholder="Find posts" />
                <FilterDateContainer />
                <OrderByContainer />
                {
                    curUser.role == 'admin' &&
                    <FilterStatusContainer />
                }
                <button onClick={resetSettings} 
                        className="button negative reset_settings">
                    Reset settings
                </button>
            </div>
            {
                posts.length !== 0 
                ? <>
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                    <PageIndexContainer numberOfPages={Math.ceil(countPosts / limit)}/>
                </>
                : <div className='small_message'>No posts found</div>
            }
        </div>
    );
    
    function resetSettings() {
        dispatch(removeSearchParameters());
    }
}

export default CategoryPosts;

