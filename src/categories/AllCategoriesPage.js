import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setReset, removeSearchParameters } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";
import PageIndexContainer from "../filters/PageIndexContainer";
import SearchContainer from "../filters/SearchContainer";
import CategoryCard from "./CategoryCard";

function CategoryPage() {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);
    const searchParameters = useSelector((state) => state.searchParameters);

    const [categories, setCategories] = useState([]);
    const [countCategories, setCountCategories] = useState(0);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
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
        fetch(SERVER_URL + '/api/categories?' + new URLSearchParams(
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
            setCategories(response.allCategories);
            setCountCategories(response.countCategories);
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
        searchParameters.search
    ]);

    return (
        <> 
            <h1>Categories</h1>
            {
                curUser.role === 'admin' && 
                <p>
                    <Link to={'/create-category'}>
                        Create category
                    </Link>
                </p>
            }
            <SearchContainer />
            <button onClick={resetSettings}>Reset settings</button>
            <div>
                {
                    categories.length !== 0 
                    ? <>
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </>
                    : <p>No categories found</p>
                }
            </div>
            <PageIndexContainer numberOfPages={Math.ceil(countCategories / limit)}/>
        </>
    );

    function resetSettings() {
        dispatch(removeSearchParameters());
    }
}

export default CategoryPage;

