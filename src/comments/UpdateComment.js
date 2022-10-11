import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { Buffer } from "buffer";
import { SERVER_URL } from "../const";

function UpdateComment({ setIsUpdating, curComment, setCurComment }) {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);

    const [status, setStatus] = useState(curComment.status);
    const [content, setContent] = useState(curComment.content);
    const [deleteFiles, setDeleteFiles] = useState([]);
    const [curCommentImages, setCurCommentImages] = useState(curComment.images);
    const [commentImages, setCommentImages] = useState([]);

    const [statusMessage, setStatusMessage] = useState('');
    const [contentMessage, setContentMessage] = useState('');
    const [commentImagesMessage, setCommentImagesMessage] = useState('');

    return (
        <> 
            <h1>Update comment</h1>
            <form onSubmit={handleSubmit}>
                {
                    curUser.role == 'admin'
                    ? <>
                        <label>
                            Status:
                            <p>{statusMessage}</p>
                            <select value={status} onChange={handleChangeStatus}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </label>
                    </>
                    : <>
                        <div>{curComment.status}</div>
                    </>
                }
                {
                    curUser.id == curComment.author.id
                    ? <>
                        <label>
                            Content:
                            <p>{contentMessage}</p>
                            <textarea value={content} onChange={handleChangeContent} required />
                        </label>
                        <div>
                            {curCommentImages.map((image) => {
                                let src = 'data:image/png;base64,' + Buffer.from(image.image, "binary").toString("base64");
                                return (
                                    <div key={image.id} style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "50px",
                                        height: "50px",
                                        overflow: "hidden"
                                    }}>
                                        <span onClick={() => {handleChangeDeleteFiles(image.id)}}>Delete</span>
                                        <img src={src} alt="Comment" style={{width: "auto",
                                                                                height: "100%"}} />
                                    </div>
                                );
                            })}
                        </div>
                        <label>
                            Images:
                            <p>{commentImagesMessage}</p>
                            <input type="file" onChange={handleChangeCommentImages} multiple />
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
                    </>
                    : <>
                        <div>{curComment.content}</div>
                        <div>
                        {curComment.images.map((image) => {
                            let src = 'data:image/png;base64,' + Buffer.from(image.image, "binary").toString("base64");
                            return (
                                <div key={image.id} style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "50px",
                                    height: "50px",
                                    overflow: "hidden"
                                }}>
                                    <img src={src} alt="comment" style={{width: "auto",
                                                                            height: "100%"}} />
                                </div>
                            );
                        })}
                    </div>
                    </>
                }
                <input type="submit" value="Update comment" />
            </form>
        </>
    );

    function handleChangeStatus(event) {
        setStatus(event.target.value);
    }

    function handleChangeContent(event) {
        setContent(event.target.value);
    }

    function handleChangeDeleteFiles(imageId) {
        setDeleteFiles([...deleteFiles, imageId]);
        setCurCommentImages(curCommentImages.filter(image => image.id != imageId));
    }

    function handleChangeCommentImages(event) {
        setCommentImages(event.target.files);
    }

    function handleSubmit(event) {
        event.preventDefault();

        setStatusMessage('');
        setContentMessage('');
        setCommentImagesMessage('');

        if (isDataValid()) {
            let formData = new FormData();

            formData.append("status", status);
            formData.append("content", content);
            deleteFiles.forEach(((fileId, index) => {
                formData.append(`deleteFiles[${index}]`, fileId);
            }));
            Object.values(commentImages).forEach((image) => {
                formData.append("commentImages", image);
            });
            
            fetch(SERVER_URL + `/api/comments/${curComment.id}`, {
                method: 'PATCH',
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
                    return response.json();
                }
            })
            .then((response) => {
                setCurComment(response);
                setIsUpdating(false);
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
                    if (err.message.includes('Status')) {
                        setStatusMessage(err.message);
                    }
                    else if (/file/i.test(err.message)) {
                        setCommentImages(err.message);
                    }
                    else {
                        setCurComment(null);
                    }
                }
            }); 
        }
    }
    
    function isDataValid() {
        if (commentImages.length + curCommentImages.length > 10) {
            setCommentImagesMessage("Maximum number of files is 10");
            return false;
        }
        
        let valid = true;
        Object.values(commentImages).forEach((image) => {
            if (!image.type.startsWith("image")) {
                setCommentImagesMessage("Upload files in an image format");
                valid = false;
            }
        });

        return valid;
    }
}

export default UpdateComment;

