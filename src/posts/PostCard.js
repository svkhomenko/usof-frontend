import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Buffer } from "buffer";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { setReset } from '../store/slices/searchParametersSlice';
import { deletePostById, likeClick, favClick } from './post_tools';
import LikeButton from "../tools/LikeButton";
import FavButton from "../tools/FavButton";

function PostCard({ post }) {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [curPost, setCurPost] = useState(post);

    return (
        <div className="post_card">
            <Link to={`/posts/${curPost.id}`} className="post_outer">
                <div className='title'>{curPost.title}</div>
                <div className="categories_container">
                    {curPost.categories.map((category) => {
                        return (
                            <span key={category.id} className="category">
                                {category.title}
                            </span>
                        );
                    })}
                </div>
                <div className='content'>{curPost.content}</div>
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
            <div className='button_container'>
                <LikeButton isLiked={curPost.isLiked} 
                            handleLikeClick={handleLikeClick}
                            isActive={curPost.status == 'active'} />
                <FavButton isFav={curPost.addToFavoritesUser} 
                            handleFavClick={handleFavClick}
                            isActive={curPost.status == 'active'} />
                {
                    (curUser.id == curPost.author.id || curUser.role === 'admin') && 
                    <span onClick={deletePost} className="like_outer delete">
                        <iconify-icon icon="fluent:delete-16-filled" />
                    </span>
                }
            </div>
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
        likeClick(type, action, curPost, curUser, setCurPost, () => {dispatch(removeUser());});
    }

    function handleFavClick() {
        favClick(curPost, curUser, setCurPost, () => {dispatch(removeUser());});
    }
}

export default PostCard;

