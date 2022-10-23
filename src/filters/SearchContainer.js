import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetPage, setSearch } from '../store/slices/searchParametersSlice';

function SearchContainer({ placeholder }) {
    const dispatch = useDispatch();
    const searchParameters = useSelector((state) => state.searchParameters);

    return (
        <input type="search" className="search_input" value={searchParameters.search} onChange={handleChange} maxLength="200" placeholder={placeholder} />
    );

    function handleChange(event) {
        dispatch(setSearch({
            search: event.target.value
        }));
        dispatch(resetPage());
    }
}

export default SearchContainer;

