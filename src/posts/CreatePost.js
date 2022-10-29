import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { removeSearchParameters } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";
import FilterCategoryContainer from "../filters/FilterCategoryContainer";
import { validateTitle, validateContent } from "../tools/dataValidation";

function CreatePost() {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);
    const searchParameters = useSelector((state) => state.searchParameters);

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
        <div className='display_center'>
            <div className='post_card update_post no_hr'> 
                <h2>Create new post</h2>
                <form onSubmit={handleSubmit}>
                    <div className='label'>Title:</div>
                    <div className='message error'>{titleMessage}</div>
                    <textarea value={title} onChange={handleChangeTitle}
                                className="small" />

                    <div className='label'>Content:</div>
                    <div className='message error'>{contentMessage}</div>
                    <textarea value={content} onChange={handleChangeContent}
                                className="large" />

                    <div className='label'>Categories:</div>
                    <div className='message error'>{categoriesMessage}</div>
                    <FilterCategoryContainer />
                    <div>
                        <div className='label'>Images:</div>
                        <div className='message error'>{postImagesMessage}</div>
                        <label htmlFor="file-upload_create_post" className='button negative file_upload_label'>
                            Upload Files
                        </label>
                        <input type="file" id="file-upload_create_post" multiple accept="image/*"
                                onChange={handleChangePostImages} className="input_file" />
                        {
                            Object.values(postImages).length > 0 &&
                            <div className='upload_files_container'>
                                {Object.values(postImages).map((image) => (
                                    <div key={image.name}>
                                        {image.name}{' - '}{(image.size / 1024).toFixed(2)}{' KB'}
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                    <input type="submit" value="Create post" className='button submit' />
                </form>
            </div>
        </div>
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
        let valid = true;

        valid = validateTitle(title, setTitleMessage) && valid;
        valid = validateContent(content, setContentMessage) && valid;

        if (postImages.length > 10) {
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

export default CreatePost;

