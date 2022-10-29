import React, { useState } from 'react';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { SERVER_URL } from "../const";
import { validateContent } from "../tools/dataValidation";
import { getSrc } from "../tools/tools_func";

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

    // return (
    //     <div className='post_card update_post'> 
    //         <h2>Update comment</h2>
    //         <form onSubmit={handleSubmit}>
    //             {
    //                 curUser.role == 'admin'
    //                 ? <>
    //                     <label>
    //                         Status:
    //                         <p>{statusMessage}</p>
    //                         <select value={status} onChange={handleChangeStatus}>
    //                             <option value="active">Active</option>
    //                             <option value="inactive">Inactive</option>
    //                         </select>
    //                     </label>
    //                 </>
    //                 : <>
    //                     <div>{curComment.status}</div>
    //                 </>
    //             }
    //             {
    //                 curUser.id == curComment.author.id
    //                 ? <>
    //                     <label>
    //                         Content:
    //                         <p>{contentMessage}</p>
    //                         <textarea value={content} onChange={handleChangeContent} />
    //                     </label>
    //                     <div>
    //                         {curCommentImages.map((image) => {
    //                             return (
    //                                 <div key={image.id} style={{
    //                                     display: "flex",
    //                                     justifyContent: "center",
    //                                     alignItems: "center",
    //                                     width: "50px",
    //                                     height: "50px",
    //                                     overflow: "hidden"
    //                                 }}>
    //                                     <span onClick={() => {handleChangeDeleteFiles(image.id)}}>Delete</span>
    //                                     <img src={getSrc(image.image)} alt="Comment" style={{width: "auto",
    //                                                                             height: "100%"}} />
    //                                 </div>
    //                             );
    //                         })}
    //                     </div>
    //                     <label>
    //                         Images:
    //                         <p>{commentImagesMessage}</p>
    //                         <input type="file" onChange={handleChangeCommentImages} multiple accept="image/*" />
    //                         <div>
    //                             {Object.values(commentImages).map((image) => {
    //                                 return (
    //                                     <div key={image.name}>
    //                                         {image.name}{' '}{image.size}
    //                                     </div>
    //                                 );
    //                             })}
    //                         </div>
    //                     </label>
    //                 </>
    //                 : <>
    //                     <div>{curComment.content}</div>
    //                     <div>
    //                     {curComment.images.map((image) => {
    //                         return (
    //                             <div key={image.id} style={{
    //                                 display: "flex",
    //                                 justifyContent: "center",
    //                                 alignItems: "center",
    //                                 width: "50px",
    //                                 height: "50px",
    //                                 overflow: "hidden"
    //                             }}>
    //                                 <img src={getSrc(image.image)} alt="comment" style={{width: "auto",
    //                                                                         height: "100%"}} />
    //                             </div>
    //                         );
    //                     })}
    //                 </div>
    //                 </>
    //             }
    //             <input type="submit" value="Update comment" />
    //         </form>
    //     </div>
    // );

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ];

    return (
        <div className='post_card update_post'> 
            <form onSubmit={handleSubmit}>
                {
                    curUser.role == 'admin'
                    && <>
                        <div className='status_select_contatiner'>
                            <div className='label'>Status:</div>
                            <div className='message error'>{statusMessage}</div>
                            <Select value={getStatusValue()} options={statusOptions} 
                                    onChange={handleChangeStatus} className='status_select' classNamePrefix='status_select' />
                        </div>
                    </>
                }
                {
                    curUser.id == curComment.author.id
                    ? <>
                        <div className='label'>Content:</div>
                        <div className='message error'>{contentMessage}</div>
                        <textarea value={content} onChange={handleChangeContent}
                                        className="large" />
                        <div className='post_images_container'>
                            {curCommentImages.map((image) => (
                                <div key={image.id} className="user_icon_outer post_images_outer update" >
                                    <img src={getSrc(image.image)} alt="post" />
                                    <div onClick={() => {handleChangeDeleteFiles(image.id)}}
                                            className="delete_image">
                                        <iconify-icon icon="iwwa:delete" />
                                    </div>
                                </div>
                            ))}
                        </div> 
                        <div>
                            <div className='label'>Images:</div>
                            <div className='message error'>{commentImagesMessage}</div>
                            <label htmlFor={`file-upload_update_comment-${curComment.id}`} className='button negative file_upload_label'>
                                Upload Files
                            </label>
                            <input type="file" id={`file-upload_update_comment-${curComment.id}`} multiple accept="image/*"
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
                    </>
                    : <>
                        <div className='content'>{curComment.content}</div>
                        <div className='post_images_container'>
                            {curComment.images.map((image) => (
                                <div key={image.id} className="user_icon_outer post_images_outer" >
                                    <img src={getSrc(image.image)} alt="post" />
                                </div>
                            ))}
                        </div> 
                    </>
                }
                <input type="submit" value="Update comment" className='button submit' />
            </form>
        </div>
    );

    function getStatusValue() {
        return statusOptions.find(option => option.value == status);
    }

    function handleChangeStatus(event) {
        setStatus(event.value);
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
        let valid = validateContent(content, setContentMessage);

        if (commentImages.length + curCommentImages.length > 10) {
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

export default UpdateComment;

