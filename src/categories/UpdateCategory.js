import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { SERVER_URL } from "../const";

function UpdateCategory() {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);

    const { id: categoryId } = useParams();

    const [curCategory, setCurCategory] = useState();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [mainMessage, setMainMessage] = useState('');
    const [titleMessage, setTitleMessage] = useState('');
    const [descriptionMessage, setDescriptionMessage] = useState('');
    
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
            setTitle(response.category.title);
            setDescription(response.category.description);
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
                    <h1>Update category</h1>
                    <p>{mainMessage}</p>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Title:
                            <p>{titleMessage}</p>
                            <input type="text" value={title} onChange={handleChangeTitle} required />
                        </label>
                        <label>
                            Description:
                            <p>{descriptionMessage}</p>
                            <textarea value={description} onChange={handleChangeDescription} required />
                        </label>
                        <input type="submit" value="Update category" />
                    </form>
                </>
                : <p>Category is not found</p>
            }
        </>
    );

    function handleChangeTitle(event) {
        setTitle(event.target.value);
    }
    
    function handleChangeDescription(event) {
        setDescription(event.target.value);
    } 

    function handleSubmit(event) {
        event.preventDefault();

        setMainMessage('');
        setTitleMessage('');
        setDescriptionMessage('');

        fetch(SERVER_URL + `/api/categories/${categoryId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'authorization': curUser.token
            },
            body: JSON.stringify({ 
                title,
                description
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw response;
            }
            else {
                setMainMessage('Category was successfully updated');
            }
        })
        .catch((err) => {
            console.log('err', err, err.body);
            switch(err.status) {
                case 400:
                    return err.json();
                case 401:
                    dispatch(removeUser());
                    window.location.href = '/login';
                case 403:
                    window.location.href = '/categories';
                default:
                    window.location.href = '/error';
            }
        })
        .then((err) => {
            if (err && err.message) {
                if (err.message.includes('Title')) {
                    setTitleMessage(err.message);
                }
                else if (err.message.includes('Description')) {
                    setDescriptionMessage(err.message);
                }
                else {
                    setCurCategory(null);
                }
            }
        }); 
    }
}

export default UpdateCategory;

