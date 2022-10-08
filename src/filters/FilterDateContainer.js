import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetPage, setDateFrom, setDateTo } from '../store/slices/searchParametersSlice';

function FilterDateContainer(props) {
    const dispatch = useDispatch();
    const searchParameters = useSelector((state) => state.searchParameters);
    
    return (
        <label>
            Date
            from <input type="date" value={searchParameters.dateFrom} onChange={handleChangeFrom} />
            to <input type="date" value={searchParameters.dateTo} onChange={handleChangeTo} />
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

// function FilterDateContainer(props) {
//     const [from, setFrom] = useState('');
//     const [to, setTo] = useState('');

//     useEffect(() => {
//         setFrom('');
//         setTo('');
//     }, [props.reset]);
    
//     return (
//         <label>
//             Date
//             from <input type="date" value={from} onChange={handleChangeFrom} />
//             to <input type="date" value={to} onChange={handleChangeTo} />
//         </label>
//     );

//     function handleChangeFrom(event) {
//         setFrom(event.target.value);
//         props.funcChangeFilterDateFrom(event.target.value);
//     }

//     function handleChangeTo(event) {
//         setTo(event.target.value);
//         props.funcChangeFilterDateTo(event.target.value);
//     }
// }

export default FilterDateContainer;

