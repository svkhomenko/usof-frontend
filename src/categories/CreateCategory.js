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
        <div className='display_center'>
            <div className='post_card update_post no_hr'> 
                <h2>Create new category</h2>
                <form onSubmit={handleSubmit}>
                    <div className='label'>Title:</div>
                    <div className='message error'>{titleMessage}</div>
                    <textarea value={title} onChange={handleChangeTitle}
                                className="small" />
                
                    <div className='label'>Description:</div>
                    <div className='message error'>{descriptionMessage}</div>
                    <textarea value={description} onChange={handleChangeDescription}
                                    className="large" />
            
                    <input type="submit" value="Create category" className='button submit' />
                </form>
            </div>
        </div>
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

