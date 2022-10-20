import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetPage, setSearch } from '../store/slices/searchParametersSlice';

function SearchContainer({ placeholder }) {
    const dispatch = useDispatch();
    const searchParameters = useSelector((state) => state.searchParameters);

    return (
        <div className="search_container">
            <input className="search_input" value={searchParameters.search} onChange={handleChange} type="search" placeholder={placeholder} />
            {/* <button className="search_btn button" type="submit">Search</button> */}
        </div>
    );

    function handleChange(event) {
        dispatch(setSearch({
            search: event.target.value
        }));
        dispatch(resetPage());
    }
}

// function SearchContainer(props) {
//     const [search, setSearch] = useState('');

//     return (
//         <div className="search_container">
//             <input className="search_input" value={search} onChange={handleChange} type="search" placeholder="Find posts" />
//             <button className="search_btn button" type="submit">Search</button>
//         </div>
//     );

//     function handleChange(event) {
//         setSearch(event.target.value);
//         props.funcChangeSearch(event.target.value);
//     }
// }

export default SearchContainer;

