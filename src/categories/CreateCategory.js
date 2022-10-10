import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { SERVER_URL } from "../const";

function CreateCategory() {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [mainMessage, setMainMessage] = useState('');
    const [titleMessage, setTitleMessage] = useState('');
    const [descriptionMessage, setDescriptionMessage] = useState('');

    return (
        <> 
            <h1>Create new category</h1>
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
                <input type="submit" value="Create category" />
            </form>
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

        fetch(SERVER_URL + '/api/categories', {
            method: 'POST',
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
                setMainMessage('Category was successfully created');
                setTitle('');
                setDescription('');
            }
        })
        .catch((err) => {
            console.log('err', err, err.body);
            switch(err.status) {
                case 400:
                    return err.json();
                case 401:
                case 403:
                    dispatch(removeUser());
                    window.location.href = '/login';
                    break;
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
            }
        }); 
    }
}

export default CreateCategory;

