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
        <div>
            {searchParameters.categories.length !== 0 && <div>
                {searchParameters.categories.map((category) => (
                    <div key={category.id}>
                        {category.title}
                        <span onClick={() => {removeCategory(category)}}>D</span>
                    </div>
                ))}
            </div>}
            <div className="search_container">
                <input className="search_input" value={filterCategorySearch} onChange={handleChange} type="search" placeholder="Check categories" />
            </div>
            {filterCategorySearch !== '' && <div>
                {allCategories.map((category) => (
                    <div key={category.id} onClick={() => {addCategory(category)}}>{category.title}</div>
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


// function FilterCategoryContainer(props) {
//     const curUser = useSelector((state) => state.user);
//     const [filterCategory, setFilterCategory] = useState([]);
//     const [filterCategorySearch, setFilterCategorySearch] = useState('');
//     const [categories, setCategories] = useState([]);

//     useEffect(() => {
//         fetch(SERVER_URL + '/api/categories?' + new URLSearchParams(
//             {
//                 page: 1,
//                 search: filterCategorySearch
//             }
//         ), 
//         {
//             method: 'GET',
//             headers: {
//                 'authorization': curUser.token
//             }
//         })
//         .then((response) => {
//             if (!response.ok) {
//                 throw response;
//             }
//             return response.json();
//         })
//         .then((response) => {
//             setCategories(response.allCategories);
//         })
//         .catch((err) => {
//             console.log('err', err, err.body);
//             if (err.status == 500) {
//                 window.location.href = '/error';
//             }
//         });
//     }, [filterCategorySearch]);

//     useEffect(() => {
//         let titles = filterCategory.map((category => category.title));
//         props.funcChangeFilterCategory(titles);
//     }, [filterCategory]);
    
//     return (
//         <div>
//             {filterCategory.length !== 0 && <div>
//                 {filterCategory.map((category) => (
//                     <div key={category.id}>
//                         {category.title}
//                         <span onClick={() => {removeCategory(category)}}>D</span>
//                     </div>
//                 ))}
//             </div>}
//             <div className="search_container">
//                 <input className="search_input" value={filterCategorySearch} onChange={handleChange} type="search" placeholder="Check categories" />
//             </div>
//             {filterCategorySearch !== '' && <div>
//                 {categories.map((category) => (
//                     <div key={category.id} onClick={() => {addCategory(category)}}>{category.title}</div>
//                 ))}
//             </div>}
//         </div>
//     );

//     function handleChange(event) {
//         setFilterCategorySearch(event.target.value);
//     }

//     function addCategory(category) {
//         if (!filterCategory.find(c => c.id == category.id)) {
//             setFilterCategory([...filterCategory, category]);
//         }
//     }
    
//     function removeCategory(category) {
//         setFilterCategory(filterCategory.filter(c => c.id != category.id));
//     }
// }

export default FilterCategoryContainer;

