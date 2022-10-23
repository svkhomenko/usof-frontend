import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { setCategories } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";
import FilterCategoryContainer from '../filters/FilterCategoryContainer';
import { validateTitle, validateContent } from "../tools/dataValidation";
import { getSrc } from "../tools/tools_func";

function UpdatePost({ setIsUpdating, curPost, setCurPost }) {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);
    const searchParameters = useSelector((state) => state.searchParameters);
    const { id: postId } = useParams();

    const [status, setStatus] = useState(curPost.status);
    const [title, setTitle] = useState(curPost.title);
    const [content, setContent] = useState(curPost.content);
    const [deleteFiles, setDeleteFiles] = useState([]);
    const [curPostImages, setCurPostImages] = useState(curPost.images);
    const [postImages, setPostImages] = useState([]);

    const [statusMessage, setStatusMessage] = useState('');
    const [titleMessage, setTitleMessage] = useState('');
    const [contentMessage, setContentMessage] = useState('');
    const [categoriesMessage, setCategoriesMessage] = useState('');
    const [postImagesMessage, setPostImagesMessage] = useState('');

    useEffect(() => {
        dispatch(setCategories({
            categories: curPost.categories
        }));
    }, []);

    return (
        <> 
            <h2>Update post</h2>
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
                        <div>{curPost.status}</div>
                    </>
                }
                {
                    curUser.id == curPost.author.id
                    ? <>
                        <label>
                            Title:
                            <p>{titleMessage}</p>
                            <input type="text" value={title} onChange={handleChangeTitle} />
                        </label>
                        <label>
                            Content:
                            <p>{contentMessage}</p>
                            <textarea value={content} onChange={handleChangeContent} />
                        </label>
                    </>
                    : <>
                        <div>{curPost.title}</div>
                        <div>{curPost.content}</div>
                    </>
                }
                <label>
                    Categories:
                    <p>{categoriesMessage}</p>
                    <FilterCategoryContainer />
                </label>
                {
                    curUser.id == curPost.author.id
                    ? <>
                        <div>
                            {curPostImages.map((image) => {
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
                                        <img src={getSrc(image.image)} alt="post" style={{width: "auto",
                                                                                height: "100%"}} />
                                    </div>
                                );
                            })}
                        </div>
                        <label>
                            Images:
                            <p>{postImagesMessage}</p>
                            <input type="file" onChange={handleChangePostImages} multiple accept="image/*" />
                            <div>
                                {Object.values(postImages).map((image) => {
                                    return (
                                        <div key={image.name}>
                                            {image.name}{' '}{image.size}
                                        </div>
                                    );
                                })}
                            </div>
                        </label>
                    </>
                    : <div>
                        {curPost.images.map((image) => {
                            return (
                                <div key={image.id} style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "50px",
                                    height: "50px",
                                    overflow: "hidden"
                                }}>
                                    <img src={getSrc(image.image)} alt="post" style={{width: "auto",
                                                                            height: "100%"}} />
                                </div>
                            );
                        })}
                    </div>
                }
                <input type="submit" value="Update post" />
            </form>
        </>
    );

    function handleChangeStatus(event) {
        setStatus(event.target.value);
    }

    function handleChangeTitle(event) {
        setTitle(event.target.value);
    }

    function handleChangeContent(event) {
        setContent(event.target.value);
    }

    function handleChangeDeleteFiles(imageId) {
        setDeleteFiles([...deleteFiles, imageId]);
        setCurPostImages(curPostImages.filter(image => image.id != imageId));
    }

    function handleChangePostImages(event) {
        setPostImages(event.target.files);
    }

    function handleSubmit(event) {
        event.preventDefault();

        setStatusMessage('');
        setTitleMessage('');
        setContentMessage('');
        setCategoriesMessage('');
        setPostImagesMessage('');

        if (isDataValid()) {
            let formData = new FormData();

            formData.append("status", status);
            formData.append("title", title);
            formData.append("content", content);
            if (searchParameters.categories.length === 0) {
                formData.append("deleteAllCategories", true);
            }
            else {
                searchParameters.categories.forEach(((category, index) => {
                    formData.append(`categories[${index}]`, category.id);
                }));
            }
            deleteFiles.forEach(((fileId, index) => {
                formData.append(`deleteFiles[${index}]`, fileId);
            }));
            Object.values(postImages).forEach((image) => {
                formData.append("postImages", image);
            });
            
            fetch(SERVER_URL + `/api/posts/${postId}`, {
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
                setCurPost(response);
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
                        setCurPost(null);
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
                    else if (/categor/i.test(err.message)) {
                        setCategoriesMessage(err.message);
                    }
                    else if (/file/i.test(err.message)) {
                        setPostImages(err.message);
                    }
                    else {
                        setCurPost(null);
                    }
                }
            }); 
        }
    }
    
    function isDataValid() {
        let valid = true;

        valid = validateTitle(title, setTitleMessage) && valid;
        valid = validateContent(content, setContentMessage) && valid;

        if (postImages.length + curPostImages.length > 10) {
            setPostImagesMessage("Maximum number of files is 10");
            return false;
        }
        
        Object.values(postImages).forEach((image) => {
            if (!image.type.startsWith("image")) {
                setPostImagesMessage("Upload files in an image format");
                valid = false;
            }
        });

        return valid;
    }
}

export default UpdatePost;

