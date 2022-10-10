import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { SERVER_URL } from "../const";
import CategoryPosts from "./CategoryPosts";
import { deleteCategoryById } from './CategoryCard';
import UpdateCategory from './UpdateCategory';

// function CategoryPage() {
//     const curUser = useSelector((state) => state.user);
//     const dispatch = useDispatch();

//     const { id: categoryId } = useParams();
//     const [curCategory, setCurCategory] = useState();
//     const [message, setMessage] = useState('Category is not found');
    
//     useEffect(() => {
//         fetch(SERVER_URL + `/api/categories/${categoryId}`, 
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
//             setCurCategory(response.category);
//         })
//         .catch((err) => {
//             console.log('err', err, err.body);
//             if (err.status == 404) {
//                 setCurCategory(null);
//             }
//             if (err.status == 500) {
//                 window.location.href = '/error';
//             }
//         });
//     }, []);

//     return (
//         <> 
//             {
//                 curCategory
//                 ? <>
//                     <h1>{curCategory.title}</h1>
//                     {
//                         curUser.role === 'admin' && 
//                         <button onClick={deleteCategory}>Delete</button>
//                     }
//                     {
//                         curUser.role === 'admin' && 
//                         <p>
//                             <Link to={'/create-category'}>
//                                 Create category
//                             </Link>
//                         </p>
//                     }
//                     {
//                         curUser.role === 'admin' && 
//                         <div>
//                             <Link to={`/categories/${curCategory.id}/update`}>
//                                 Update
//                             </Link>
//                         </div>
//                     }
//                     <div>{curCategory.description}</div>
//                     <hr />
//                     <CategoryPosts />
//                 </>
//                 : <p>{message}</p>
//             }
//         </>
//     );

//     function deleteCategory() {
//         deleteCategoryById(categoryId, curUser,
//             () => {
//                 dispatch(removeUser());
//             },
//             () => {
//                 setCurCategory(null);
//                 setMessage('Category was successfully deleted');
//             }
//         );
//     }
// }

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
        <> 
            {
                curCategory
                ? <>
                    {
                        isUpdating
                        ? <UpdateCategory setIsUpdating={setIsUpdating} curCategory={curCategory} setCurCategory={setCurCategory} />
                        : <>
                            <h1>{curCategory.title}</h1>
                            {
                                curUser.role === 'admin' && 
                                <button onClick={deleteCategory}>Delete</button>
                            }
                            {
                                curUser.role === 'admin' && 
                                <p>
                                    <Link to={'/create-category'}>
                                        Create category
                                    </Link>
                                </p>
                            }
                            {
                                curUser.role === 'admin' && 
                                <button onClick={() => {setIsUpdating(true)}}>
                                    Update
                                </button>
                            }
                            <div>{curCategory.description}</div>
                        </>
                    }
                    <hr />
                    <CategoryPosts isUpdating={isUpdating} />
                </>
                : <p>{message}</p>
            }
        </>
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

