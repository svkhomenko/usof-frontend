import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeSearchParameters } from '../store/slices/searchParametersSlice';
// import { Buffer } from "buffer";
import { SERVER_URL } from "../const";
// import PageIndexContainer from "../filters/PageIndexContainer";
// import OrderByContainer from "../filters/OrderByContainer";
// import FilterStatusContainer, { getFilterStatus } from "../filters/FilterStatusContainer";
// import SearchContainer from "../filters/SearchContainer";
// import FilterCategoryContainer from "../filters/FilterCategoryContainer";
// import FilterDateContainer, { getFilterDate } from "../filters/FilterDateContainer";
// import PostCard from './PostCard';

function ProfilePage() {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    return (
        <>
            <div>{curUser.login}</div>
            {/* {
                isUpdating
                ? <UpdateCategory setIsUpdating={setIsUpdating} curCategory={curCategory} setCurCategory={setCurCategory} />
                : <>
                    <h1>{curCategory.title}</h1>
                    {
                        curUser.role === 'admin' && 
                        <button onClick={deleteCategory}>Delete</button>
                    }
                    {
                        curUser.role === 'admin' && 
                        <p>
                            <Link to={'/create-category'}>
                                Create category
                            </Link>
                        </p>
                    }
                    {
                        curUser.role === 'admin' && 
                        <button onClick={() => {setIsUpdating(true)}}>
                            Update
                        </button>
                    }
                    <div>{curCategory.description}</div>
                </>
            }
            <hr />
            <CategoryPosts isUpdating={isUpdating} /> */}
        </>
    );
}

export default ProfilePage;

