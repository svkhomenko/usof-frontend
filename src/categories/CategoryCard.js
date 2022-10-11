import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { setReset } from '../store/slices/searchParametersSlice';
import { deleteCategoryById } from './category_tools';

function CategoryCard({ category }) {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    
    return (
        <div>
            {/* {
                curUser.role === 'admin' && 
                <div>
                    <Link to={`/categories/${category.id}/update`}>
                        Update
                    </Link>
                </div>
            } */}
            {
                curUser.role === 'admin' && 
                <button onClick={deleteCategory}>Delete</button>
            }
            <Link to={`/categories/${category.id}`}>
                <div>{category.title}</div>
                <div>{category.description}</div>
            </Link>
            <hr/>
        </div>
    );

    function deleteCategory() {
        deleteCategoryById(category.id, curUser,
            () => {
                dispatch(removeUser());
            },
            () => {
                dispatch(setReset({
                    reset: false
                }));
                // navigate(0);
                // navigate("/categories");
                window.location.href = '/categories';
            }
        );
    }
}

export default CategoryCard;

