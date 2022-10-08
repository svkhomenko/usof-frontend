import React from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { setReset } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";

function CategoryCard({ category }) {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();
    
    return (
        <div>
            {
                curUser.role === 'admin' && 
                <div>
                    <Link to={`/categories/${category.id}/update`}>
                        Update
                    </Link>
                </div>
            }
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
                window.location.href = '/categories';
            }
        );
    }
}

function deleteCategoryById(categoryId, curUser, deleteUser, successFunc) {
    fetch(SERVER_URL + `/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': curUser.token
        }
    })
    .then((response) => {
        if (!response.ok) {
            throw response;
        }
        else {
            successFunc();
        }
    })
    .catch((err) => {
        console.log('err', err, err.body);
        switch(err.status) {
            case 401:
            case 403:
                deleteUser();
                window.location.href = '/login';
            default:
                window.location.href = '/error';
        }
    });
}

export { deleteCategoryById };

export default CategoryCard;

