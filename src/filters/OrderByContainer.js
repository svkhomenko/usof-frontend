import React from 'react';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { resetPage, setOrderBy } from '../store/slices/searchParametersSlice';

function OrderByContainer() {
    const dispatch = useDispatch();
    const searchParameters = useSelector((state) => state.searchParameters);

    const options = [
        { value: 'like', label: 'Like' },
        { value: 'date', label: 'Date' }
    ];
 
    return (
        <label className='order_by_label'>
            Order by
            <Select value={getValue()} options={options} 
                    onChange={handleChange} className='order_by' classNamePrefix='order_by' />
        </label>
    );

    function handleChange(event) {
        dispatch(setOrderBy({
            orderBy: event.value
        }));
        dispatch(resetPage());
    }

    function getValue() {
        return options.find(option => option.value == searchParameters.orderBy);
    }
}

// function OrderByContainer() {
//     const dispatch = useDispatch();
//     const searchParameters = useSelector((state) => state.searchParameters);

//     return (
//         <>
//             <label>
//                 Order by
//                 <Select value={searchParameters.orderBy} classes={{ root: (dd()).select }}
//                         onChange={handleChange}>
//                     <MenuItem value="like">Like</MenuItem>
//                     <MenuItem value="date">Date</MenuItem>
//                 </Select>
//             </label>
            
//         {/* <label>
//             Order by
//             <select value={searchParameters.orderBy} onChange={handleChange}
//                     className='order_by'>
//                 <option value="like">Like</option>
//                 <option value="date">Date</option>
//             </select>
//         </label>
//         <label>
//             Order by
//             <select value={searchParameters.orderBy} onChange={handleChange}>
//                 <option value="like">Like</option>
//                 <option value="date">Date</option>
//             </select>
//         </label> */}
//         </>
//     );

//     function handleChange(event) {
//         dispatch(setOrderBy({
//             orderBy: event.target.value
//         }));
//         dispatch(resetPage());
//     }
// }

export default OrderByContainer;

