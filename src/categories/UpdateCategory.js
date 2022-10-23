import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { SERVER_URL } from "../const";
import { validateTitle, validateDescription } from "../tools/dataValidation";

function UpdateCategory({ setIsUpdating, curCategory, setCurCategory }) {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);
    const { id: categoryId } = useParams();

    const [title, setTitle] = useState(curCategory.title);
    const [description, setDescription] = useState(curCategory.description);

    const [titleMessage, setTitleMessage] = useState('');
    const [descriptionMessage, setDescriptionMessage] = useState('');

    return (
        <> 
            <h2>Update category</h2>
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
                <input type="submit" value="Update category" />
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
                    return response.json();
                }
            })
            .then((response) => {
                setCurCategory(response.curCategory);
                setIsUpdating(false);
            })
            .catch((err) => {
                console.log('err', err, err.body);
                switch(err.status) {
                    case 400:
                        return err.json();
                    case 401:
                        dispatch(removeUser());
                        window.location.href = '/login';
                        break;
                    case 403:
                        window.location.href = '/categories';
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
                    else {
                        setCurCategory(null);
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

export default UpdateCategory;

