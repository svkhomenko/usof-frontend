import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { SERVER_URL } from "../const";
import { validateTitle, validateDescription } from "../tools/dataValidation";

function CreateCategory() {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [titleMessage, setTitleMessage] = useState('');
    const [descriptionMessage, setDescriptionMessage] = useState('');

    return (
        <> 
            <h2>Create new category</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <p>{titleMessage}</p>
                    <input type="text" value={title} onChange={handleChangeTitle} />
                </label>
                <label>
                    Description:
                    <p>{descriptionMessage}</p>
                    <textarea value={description} onChange={handleChangeDescription} />
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

        setTitleMessage('');
        setDescriptionMessage('');

        if (isDataValid()) {
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
                    let resId = response.headers.get('location').split('/')[3];
                    window.location.href = `/categories/${resId}`;
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

    function isDataValid() {
        let validData = true;

        validData = validateTitle(title, setTitleMessage) && validData;
        validData = validateDescription(description, setDescriptionMessage) && validData;

        return validData;
    }
}

export default CreateCategory;

