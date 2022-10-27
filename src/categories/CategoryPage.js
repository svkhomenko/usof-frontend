import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { SERVER_URL } from "../const";
import CategoryPosts from "./CategoryPosts";
import { deleteCategoryById } from './category_tools';
import UpdateCategory from './UpdateCategory';

function CategoryPage() {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { id: categoryId } = useParams();

    const [curCategory, setCurCategory] = useState();
    const [message, setMessage] = useState('Category is not found');
    const [isUpdating, setIsUpdating] = useState(false);
    
    useEffect(() => {
        fetch(SERVER_URL + `/api/categories/${categoryId}`, 
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
            setCurCategory(response.category);
        })
        .catch((err) => {
            console.log('err', err, err.body);
            if (err.status == 404) {
                setCurCategory(null);
            }
            if (err.status == 500) {
                window.location.href = '/error';
            }
        });
    }, []);

    return (
        <div className='post_page category_page'> 
            {
                curCategory
                ? <>
                    {
                        isUpdating
                        ? <UpdateCategory setIsUpdating={setIsUpdating} curCategory={curCategory} setCurCategory={setCurCategory} />
                        : <div className="category_card">
                            {
                                curUser.role === 'admin' && 
                                <div className='buttons_container'>
                                    <button onClick={() => {setIsUpdating(true)}} className="button negative">
                                        Update
                                    </button>
                                    <Link to={'/create-category'} className="button">
                                        Create category
                                    </Link>
                                    <span onClick={deleteCategory} className="like_outer delete">
                                        <iconify-icon icon="fluent:delete-16-filled" />
                                    </span>
                                </div>
                            }
                            <h2>{curCategory.title}</h2>
                            <div className='description'>{curCategory.description}</div>
                        </div>
                    }
                    <CategoryPosts isUpdating={isUpdating} />
                </>
                : <div className='main_message'>{message}</div>
            }
        </div>
    );

    function deleteCategory() {
        deleteCategoryById(categoryId, curUser,
            () => {
                dispatch(removeUser());
            },
            () => {
                setCurCategory(null);
                setMessage('Category was successfully deleted');
            }
        );
    }
}

export default CategoryPage;

