import React, { useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { setReset } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";
import { validateContent } from "../tools/dataValidation";

function CreateComment({ repliedComment, setRepliedComment, goToRef }) {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);
    const { id: postId } = useParams();
    const createCommentForm = useRef(null);

    const [content, setContent] = useState('');
    const [commentImages, setCommentImages] = useState([]);

    const [mainMessage, setMainMessage] = useState('');
    const [contentMessage, setContentMessage] = useState('');
    const [commentImagesMessage, setCommentImagesMessage] = useState('');

    return (
        <div className='display_center'>
            <div className='create_comment_outer'> 
                <div className='small_title'>Leave your answer</div>
                <div className='message success'>{mainMessage}</div>
                {
                    repliedComment &&
                    <div className='replied_comment_outer'>
                        <div className='icon'>
                            <iconify-icon icon="bi:reply" />
                        </div>
                        <div className='replied_comment' 
                            onClick={() => {goToRef(repliedComment.id)}}>
                            <div className='login'>{repliedComment.author.login}</div>
                            <div className='content'>{repliedComment.content}</div>
                        </div>
                        <div className='icon delete'
                            onClick={removeRepliedComment}>
                            <iconify-icon icon="iwwa:delete" />
                        </div>
                    </div>
                }
                <form onSubmit={handleSubmit} ref={createCommentForm}>
                    <div className='message error'>{contentMessage}</div>
                    <textarea value={content} onChange={handleChangeContent} 
                                className="large" placeholder="Answer..." />
                    <div>
                        <div className='message error'>{commentImagesMessage}</div>
                        <label htmlFor="file-upload_new_comment" className='button negative'>
                            Upload Files
                        </label>
                        <input type="file" id='file-upload_new_comment' multiple accept="image/*"
                                onChange={handleChangeCommentImages} className="input_file" />
                        {
                            Object.values(commentImages).length > 0 &&
                            <div className='upload_files_container'>
                                {Object.values(commentImages).map((image) => (
                                    <div key={image.name}>
                                        {image.name}{' - '}{(image.size / 1024).toFixed(2)}{' KB'}
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                    <input type="submit" value="Create comment" className='button create' />
                </form>
            </div>
        </div>
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
            if (repliedComment) {
                formData.append("repliedCommentId", repliedComment.id);
            }

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
                    createCommentForm.current.reset();
                    dispatch(setReset({ reset: true }));
                    setRepliedComment(null);
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

    function removeRepliedComment() {
        setRepliedComment(null);
    }
}

export default CreateComment;

