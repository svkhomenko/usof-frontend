import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, removeUser } from '../store/slices/userSlice';
import { resetPage, setReset } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";
import { validateContent } from "../tools/dataValidation";

function CreateComment() {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);
    const { id: postId } = useParams();
    const createCommentFrom = useRef(null);

    const [content, setContent] = useState('');
    const [commentImages, setCommentImages] = useState([]);

    const [mainMessage, setMainMessage] = useState('');
    const [contentMessage, setContentMessage] = useState('');
    const [commentImagesMessage, setCommentImagesMessage] = useState('');

    return (
        <> 
            <h1>Leave your answer</h1>
            <p>{mainMessage}</p>
            <form onSubmit={handleSubmit} ref={createCommentFrom}>
                <label>
                    Content:
                    <p>{contentMessage}</p>
                    <textarea value={content} onChange={handleChangeContent} />
                </label>
                <label>
                    Images:
                    <p>{commentImagesMessage}</p>
                    <input type="file" onChange={handleChangeCommentImages} multiple accept="image/*" />
                    <div>
                        {Object.values(commentImages).map((image) => {
                            return (
                                <div key={image.name}>
                                    {image.name}{' '}{image.size}
                                </div>
                            );
                        })}
                    </div>
                </label>
                <input type="submit" value="Create comment" />
            </form>
        </>
    );
    
    function handleChangeContent(event) {
        setContent(event.target.value);
    } 

    function handleChangeCommentImages(event) {
        setCommentImages(event.target.files);
    }

    function handleSubmit(event) {
        event.preventDefault();

        setMainMessage('');
        setContentMessage('');
        setCommentImagesMessage('');

        if (isDataValid()) {
            let formData = new FormData();

            formData.append("content", content);
            Object.values(commentImages).forEach((image) => {
                formData.append("commentImages", image);
            });

            fetch(SERVER_URL + `/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'authorization': curUser.token
                },
                body: formData
            })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                else {
                    setMainMessage('Comment was successfully created');
                    setContent('');
                    createCommentFrom.current.reset();
                    dispatch(resetPage());
                    dispatch(setReset({ reset: true }));
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
                    case 404:
                        window.location.href = '/';
                        break;
                    default:
                        window.location.href = '/error';
                }
            })
            .then((err) => {
                if (err && err.message) {
                    if (err.message.includes('Content')) {
                        setContentMessage(err.message);
                    }
                    else if (/file/i.test(err.message)) {
                        setCommentImages(err.message);
                    }
                }
            }); 
        }
    }
    
    function isDataValid() {
        let valid = validateContent(content, setContentMessage);

        if (commentImages.length > 10) {
            setCommentImagesMessage("Maximum number of files is 10");
            return false;
        }
        
        Object.values(commentImages).forEach((image) => {
            if (!image.type.startsWith("image")) {
                setCommentImagesMessage("Upload files in an image format");
                valid = false;
            }
        });

        return valid;
    }
}

export default CreateComment;

