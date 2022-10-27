import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { setReset } from '../store/slices/searchParametersSlice';
import { deletePostById, likeClick, favClick } from './post_tools';
import LikeButton from "../tools/LikeButton";
import FavButton from "../tools/FavButton";
import { getSrc, getDateString } from "../tools/tools_func";

function PostCard({ post }) {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [curPost, setCurPost] = useState(post);

    return (
        <div className="post_card">
            <Link to={`/posts/${curPost.id}`}>
                <div className="header">
                    <div className="extra_data">
                        <div className="user_icon_container">
                            <div className="user_icon_role_outer">
                                <span className="user_icon_role">{curPost.author.role}</span>
                                <div className="user_icon_outer">
                                    <img src={getSrc(curPost.author.profilePicture)} alt="avatar" />
                                </div>
                            </div>
                            <span>{curPost.author.login}</span>
                        </div>
                        <span className='delimiter'>·</span>
                        <span>{getDateString(curPost.publishDate)}</span>
                        <span className='delimiter'>·</span>
                        <span>{curPost.status}</span>
                    </div>
                    <div className='button_container'>
                        <LikeButton isLiked={curPost.isLiked} 
                                    handleLikeClick={handleLikeClick}
                                    isActive={curPost.status == 'active'}
                                    likesCount={curPost.likesCount}
                                    dislikesCount={curPost.dislikesCount} />
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
                <div className='title'>{curPost.title}</div>
                <div className="categories_container">
                    {curPost.categories.map((category) => (
                        <div key={category.id} 
                            className="category tooltip" data-title={category.description}
                            onClick={(event) => {
                                event.preventDefault();
                                window.location.href = `/categories/${category.id}`;
                            }}>
                            {category.title}
                        </div>
                    ))}
                </div>
                <div className='content'>{curPost.content}</div>
            </Link>
        </div>
    );

    function deletePost(event) {
        event.preventDefault();
        
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

