import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetPage, setDateFrom, setDateTo } from '../store/slices/searchParametersSlice';

function FilterDateContainer() {
    const dispatch = useDispatch();
    const searchParameters = useSelector((state) => state.searchParameters);
    
    return (
        <label className='date_filter'>
            Date
            from <input type="date" value={searchParameters.dateFrom} onChange={handleChangeFrom} />
            {" "}to <input type="date" value={searchParameters.dateTo} onChange={handleChangeTo} />
        </label>
    );

    function handleChangeFrom(event) {
        dispatch(setDateFrom({
            dateFrom: event.target.value
        }));
        dispatch(resetPage());
    }

    function handleChangeTo(event) {
        dispatch(setDateTo({
            dateTo: event.target.value
        }));
        dispatch(resetPage());
    }
}

export function getFilterDate(searchParameters) {
    let str = '';
    if (searchParameters.dateFrom) {
        str += searchParameters.dateFrom;
    }
    str += '...';
    if (searchParameters.dateTo) {
        str += searchParameters.dateTo;
    }
    return str;
}

export default FilterDateContainer;

