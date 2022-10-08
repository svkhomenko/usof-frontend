import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetPage, toggleActive, toggleInactive } from '../store/slices/searchParametersSlice';

function FilterStatusContainer(props) {
    const dispatch = useDispatch();
    const searchParameters = useSelector((state) => state.searchParameters);
    
    return (
        <label>
            Status
            <input type="checkbox" id="active" name="active" checked={searchParameters.activeChecked} onChange={handleChangeActive} />
            <label htmlFor="active">Active</label>
            <input type="checkbox" id="inactive" name="inactive" checked={searchParameters.inactiveChecked} onChange={handleChangeInactive} />
            <label htmlFor="inactive">Inactive</label>
        </label>
    );

    function handleChangeActive() {
        dispatch(toggleActive());
        dispatch(resetPage());
    }

    function handleChangeInactive() {
        dispatch(toggleInactive());
        dispatch(resetPage())
    }
}

export function getFilterStatus(searchParameters) {
    let res = [];
    if (searchParameters.activeChecked) {
        res.push('active');
    }
    if (searchParameters.inactiveChecked) {
        res.push('inactive');
    }
    return res.join(',');
}

// function FilterStatusContainer(props) {
//     const [activeChecked, setActiveChecked] = useState(true);
//     const [inactiveChecked, setInactiveChecked] = useState(false);

//     useEffect(() => {
//         setActiveChecked(true);
//         setInactiveChecked(false);
//     }, [props.reset]);

//     useEffect(() => {
//         let res = [];
//         if (activeChecked) {
//             res.push('active');
//         }
//         if (inactiveChecked) {
//             res.push('inactive');
//         }

//         props.funcChangeFilterStatus(res);
//     }, [activeChecked, inactiveChecked]);
    
//     return (
//         <label>
//             Status
//             <input type="checkbox" id="active" name="active" checked={activeChecked} onChange={handleChangeActive} />
//             <label htmlFor="active">Active</label>
//             <input type="checkbox" id="inactive" name="inactive" checked={inactiveChecked} onChange={handleChangeInactive} />
//             <label htmlFor="inactive">Inactive</label>
//         </label>
//     );

//     function handleChangeActive() {
//         setActiveChecked(!activeChecked);
//     }

//     function handleChangeInactive() {
//         setInactiveChecked(!inactiveChecked);
//     }
// }

export default FilterStatusContainer;

