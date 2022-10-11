import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Buffer } from "buffer";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { setReset } from '../store/slices/searchParametersSlice';
import { deletePostById, LikeClick } from './post_tools';
import LikeButton from "../tools/LikeButton";

function PostCard({ post }) {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [curPost, setCurPost] = useState(post);

    return (
        <div>
            {
                (curUser.id == curPost.author.id || curUser.role === 'admin') && 
                <button onClick={deletePost}>Delete</button>
            }
            {/* {
                (curUser.id == curPost.author.id || curUser.role === 'admin') && 
                <div>
                    <Link to={`/posts/${curPost.id}/update`}>
                        Update
                    </Link>
                </div>
            } */}
            <Link to={`/posts/${curPost.id}`}>
                <LikeButton isLiked={curPost.isLiked} handleLikeClick={handleLikeClick} />
                <div>{curPost.title}</div>
                <div>{curPost.content}</div>
                <div>
                    {curPost.categories.map((category) => {
                        return (
                            <span key={category.id}>
                                {category.title}
                            </span>
                        );
                    })}
                </div>
                <div>
                    {curPost.images.map((image) => {
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
                                <img src={src} alt="post" style={{width: "auto",
                                                                        height: "100%"}} />
                            </div>
                        );
                    })}
                </div>
            </Link>
            <hr/>
        </div>
    );

    function deletePost() {
        deletePostById(curPost.id, curUser,
            () => {
                dispatch(removeUser());
            },
            () => {
                dispatch(setReset({
                    reset: false
                }));
                window.location.href = '/';
            }
        );
    }

    // function handleLikeClick(type, action) {
    //     if (action == UPDATE) {
    //         fetch(SERVER_URL + `/api/posts/${curPost.id}/like`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'authorization': curUser.token
    //             },
    //             body: JSON.stringify({ 
    //                 type: type == LIKE ? 'like' : 'dislike'
    //             })
    //         })
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw response;
    //             }
    //             else {
    //                 setCurPost({
    //                     ...curPost,
    //                     isLiked: {
    //                         type: type == LIKE ? 'like' : 'dislike'
    //                     }
    //                 });
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('err', err, err.body);
    //             switch(err.status) {
    //                 case 401:
    //                 case 403:
    //                     dispatch(removeUser());
    //                     window.location.href = '/login';
    //                     break;
    //                 default:
    //                     window.location.href = '/error';
    //             }
    //         });
    //     }
    //     else if (action == DELETE) {
    //         fetch(SERVER_URL + `/api/posts/${curPost.id}/like`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'authorization': curUser.token
    //             }
    //         })
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw response;
    //             }
    //             else {
    //                 setCurPost({
    //                     ...curPost,
    //                     isLiked: false
    //                 });
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('err', err, err.body);
    //             switch(err.status) {
    //                 case 401:
    //                 case 403:
    //                     dispatch(removeUser());
    //                     window.location.href = '/login';
    //                     break;
    //                 default:
    //                     window.location.href = '/error';
    //             }
    //         });
    //     }
    // }

    function handleLikeClick(type, action) {
        LikeClick(type, action, curPost, curUser, setCurPost, () => {dispatch(removeUser());});
    }
}

export default PostCard;

