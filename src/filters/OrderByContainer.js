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

export default OrderByContainer;

