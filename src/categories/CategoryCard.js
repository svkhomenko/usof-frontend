import React from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { setReset } from '../store/slices/searchParametersSlice';
import { deleteCategoryById } from './category_tools';

function CategoryCard({ category }) {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();;
    
    return (
        <Link to={`/categories/${category.id}`} className="category_card">
            <div className='header'>
                <div className='title'>{category.title}</div>
                {
                    curUser.role === 'admin' && 
                    <span onClick={deleteCategory} className="like_outer delete">
                        <iconify-icon icon="fluent:delete-16-filled" />
                    </span>
                }
            </div>
            <div className='description'>{category.description}</div>
        </Link>
    );
    
    function deleteCategory(event) {
        event.preventDefault();

        deleteCategoryById(category.id, curUser,
            () => {
                dispatch(removeUser());
            },
            () => {
                dispatch(setReset({
                    reset: false
                }));
                window.location.href = '/categories';
            }
        );
    }
}

export default CategoryCard;

