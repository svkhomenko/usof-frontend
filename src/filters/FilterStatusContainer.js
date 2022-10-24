import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetPage, toggleActive, toggleInactive } from '../store/slices/searchParametersSlice';

function FilterStatusContainer(props) {
    const dispatch = useDispatch();
    const searchParameters = useSelector((state) => state.searchParameters);
    
    return (
        <>
            <div>
                Status
                {/* <input type="checkbox" className="status_checkbox" name="status" id="status" />
                <label className="sidebar_blocks_text categories_text" htmlFor="status">status</label>
                <input type="checkbox" className="status_checkbox" name="status" id="status" />
                <label className="sidebar_blocks_text categories_text" htmlFor="status">status</label> */}
                
                <input type="checkbox" className="status_checkbox"
                        id="active" name="active" 
                        checked={searchParameters.activeChecked} onChange={handleChangeActive} />
                <label htmlFor="active" className="status_label">
                    Active
                </label>
                <input type="checkbox" className="status_checkbox"
                        id="inactive" name="inactive" 
                        checked={searchParameters.inactiveChecked} onChange={handleChangeInactive} />
                <label htmlFor="inactive" className="status_label">
                    Inactive
                </label>
            </div>
        </>
    );

    // return (
    //     <>
    //         <label>
    //             Status
    //             <input type="checkbox" id="active" name="active" checked={searchParameters.activeChecked} onChange={handleChangeActive} />
    //             <label htmlFor="active">Active</label>
    //             <input type="checkbox" id="inactive" name="inactive" checked={searchParameters.inactiveChecked} onChange={handleChangeInactive} />
    //             <label htmlFor="inactive">Inactive</label>
    //         </label>
    //     </>
    // );

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

export default FilterStatusContainer;

