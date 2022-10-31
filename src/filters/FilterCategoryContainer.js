import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetPage, setCategories } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";

function FilterCategoryContainer(props) {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const searchParameters = useSelector((state) => state.searchParameters);
    
    const [filterCategorySearch, setFilterCategorySearch] = useState('');
    const [allCategories, setAllCategories] = useState([]);

    useEffect(() => {
        if (searchParameters.categories.length === 0 && searchParameters.reset) {
            setFilterCategorySearch('');
            setAllCategories([]);
        }
    }, [searchParameters.categories]);

    useEffect(() => {
        fetch(SERVER_URL + '/api/categories?' + new URLSearchParams(
            {
                page: 1,
                search: filterCategorySearch
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
            setAllCategories(response.allCategories);
        })
        .catch((err) => {
            console.log('err', err, err.body);
            if (err.status == 500) {
                window.location.href = '/error';
            }
        });
    }, [filterCategorySearch]);
    
    return (
        <div className='category_filter'>
            {searchParameters.categories.length !== 0 && 
                <div className="categories_container">
                    {searchParameters.categories.map((category) => (
                        <div key={category.id} 
                            className="category tooltip" data-title={category.description}>
                            {category.title}
                            <div className='delete_category'
                                onClick={() => {removeCategory(category)}}>
                                <iconify-icon icon="iwwa:delete" />
                            </div>
                        </div>
                    ))}
                </div>
            }
            <input className="search_input" 
                    value={filterCategorySearch} onChange={handleChange} 
                    type="search" placeholder="Check categories" />
            {filterCategorySearch !== '' && allCategories.length !== 0 && 
                <div className='options_container'>
                    {allCategories.map((category) => (
                        <div key={category.id} className="options"
                            onClick={() => {addCategory(category)}}>
                            {category.title}
                        </div>
                    ))}
                </div>}
        </div>
    );

    function handleChange(event) {
        setFilterCategorySearch(event.target.value);
    }

    function addCategory(category) {
        if (!searchParameters.categories.find(c => c.id == category.id)) {
            dispatch(setCategories({
                categories: [...searchParameters.categories, category]
            }));
            dispatch(resetPage());
        }
    }
    
    function removeCategory(category) {
        dispatch(setCategories({
            categories: searchParameters.categories.filter(c => c.id != category.id)
        }));
        dispatch(resetPage());
    }
}

export default FilterCategoryContainer;

