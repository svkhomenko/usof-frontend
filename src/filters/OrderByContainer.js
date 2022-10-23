import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetPage, setOrderBy } from '../store/slices/searchParametersSlice';

function OrderByContainer() {
    const dispatch = useDispatch();
    const searchParameters = useSelector((state) => state.searchParameters);
    
    return (
        <>
        <label>
            Order by
            <select value={searchParameters.orderBy} onChange={handleChange}
                    className='order_by'>
                <option value="like">Like</option>
                <option value="date">Date</option>
            </select>
        </label>
        <label>
            Order by
            <select value={searchParameters.orderBy} onChange={handleChange}>
                <option value="like">Like</option>
                <option value="date">Date</option>
            </select>
        </label>
        </>
    );

    function handleChange(event) {
        dispatch(setOrderBy({
            orderBy: event.target.value
        }));
        dispatch(resetPage());
    }
}

export default OrderByContainer;

