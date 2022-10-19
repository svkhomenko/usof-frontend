import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, removeUser } from '../store/slices/userSlice';
import { removeSearchParameters } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";
import FilterCategoryContainer from "../filters/FilterCategoryContainer";

function CreatePost() {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);
    const searchParameters = useSelector((state) => state.searchParameters);
    const createPostForm = useRef(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [postImages, setPostImages] = useState([]);

    const [titleMessage, setTitleMessage] = useState('');
    const [contentMessage, setContentMessage] = useState('');
    const [categoriesMessage, setCategoriesMessage] = useState('');
    const [postImagesMessage, setPostImagesMessage] = useState('');

    useEffect(() => {
        dispatch(removeSearchParameters());
    }, []);

    return (
        <> 
            <h1>Create new post</h1>
            <form onSubmit={handleSubmit} ref={createPostForm}>
                <label>
                    Title:
                    <p>{titleMessage}</p>
                    <input type="text" value={title} onChange={handleChangeTitle} required />
                </label>
                <label>
                    Content:
                    <p>{contentMessage}</p>
                    <textarea value={content} onChange={handleChangeContent} required />
                </label>
                <label>
                    Categories:
                    <p>{categoriesMessage}</p>
                    <FilterCategoryContainer />
                </label>
                <label>
                    Images:
                    <p>{postImagesMessage}</p>
                    <input type="file" onChange={handleChangePostImages} multiple />
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
                <input type="submit" value="Create post" />
            </form>
        </>
    );

    function handleChangeTitle(event) {
        setTitle(event.target.value);
    }
    
    function handleChangeContent(event) {
        setContent(event.target.value);
    } 

    function handleChangePostImages(event) {
        setPostImages(event.target.files);
    }

    function handleSubmit(event) {
        event.preventDefault();

        setTitleMessage('');
        setContentMessage('');
        setCategoriesMessage('');
        setPostImagesMessage('');

        if (isDataValid()) {
            let formData = new FormData();

            formData.append("title", title);
            formData.append("content", content);
            searchParameters.categories.forEach(((category, index) => {
                formData.append(`categories[${index}]`, category.id);
            }));
            Object.values(postImages).forEach((image) => {
                formData.append("postImages", image);
            });

            fetch(SERVER_URL + '/api/posts', {
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
                    let resId = response.headers.get('location').split('/')[3];
                    window.location.href = `/posts/${resId}`;
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
                    else if (err.message.includes('Title')) {
                        setTitleMessage(err.message);
                    }
                    else if (/categor/i.test(err.message)) {
                        setCategoriesMessage(err.message);
                    }
                    else if (/file/i.test(err.message)) {
                        setPostImages(err.message);
                    }
                }
            }); 
        }
    }

    function isDataValid() {
        if (postImages.length > 10) {
            setPostImagesMessage("Maximum number of files is 10");
            return false;
        }
        
        let valid = true;
        Object.values(postImages).forEach((image) => {
            if (!image.type.startsWith("image")) {
                setPostImagesMessage("Upload files in an image format");
                valid = false;
            }
        });

        return valid;
    }
}

export default CreatePost;

