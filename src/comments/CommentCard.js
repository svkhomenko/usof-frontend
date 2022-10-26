import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { SERVER_URL, LIKE, UPDATE, DELETE } from "../const";
import UpdateComment from "./UpdateComment";
import LikeButton from "../tools/LikeButton";
import PostImages from "../tools/PostImages";
import { getSrc, getDateString } from "../tools/tools_func";

function CommentCard({ comment, isPostActive }) {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [curComment, setCurComment] = useState(comment);
    const [isUpdating, setIsUpdating] = useState(false);
    
    return (
        <div>
            {
                isUpdating
                ? <UpdateComment setIsUpdating={setIsUpdating} curComment={curComment} setCurComment={setCurComment} />
                : <div className="post_card comment_card">
                    <div className="header">
                        <div className="extra_data">
                            <div className="user_icon_container">
                                <div className="user_icon_role_outer">
                                    <span className="user_icon_role">{curComment.author.role}</span>
                                    <div className="user_icon_outer">
                                        <img src={getSrc(curComment.author.profilePicture)} alt="avatar" />
                                    </div>
                                </div>
                                <span>{curComment.author.login}</span>
                            </div>
                            <span className='delimiter'>·</span>
                            <span>{getDateString(curComment.publishDate)}</span>
                            <span className='delimiter'>·</span>
                            <span>{curComment.status}</span>
                        </div>
                        <div className='button_outer'>
                            {
                                (curUser.id == curComment.author.id || curUser.role === 'admin') && 
                                <button onClick={() => {setIsUpdating(true)}} className="button negative update">
                                    Update
                                </button>
                            }
                            <div className={'button_container for_comment' + ((curUser.id == curComment.author.id || curUser.role === 'admin') ? "" : " without_delete")}>
                                <LikeButton isLiked={curComment.isLiked} 
                                            handleLikeClick={handleLikeClick}
                                            isActive={isPostActive && curComment.status == 'active'}
                                            likesCount={curComment.likesCount}
                                            dislikesCount={curComment.dislikesCount} />
                                {
                                    (curUser.id == curComment.author.id || curUser.role === 'admin') && 
                                    <span onClick={deleteComment} className="like_outer delete">
                                        <iconify-icon icon="fluent:delete-16-filled" />
                                    </span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='content'>{curComment.content}</div>
                    <PostImages images={curComment.images} />
                </div>
            }
        </div>
    );

    // return (
    //     <div>
    //         {
    //             isUpdating
    //             ? <UpdateComment setIsUpdating={setIsUpdating} curComment={curComment} setCurComment={setCurComment} />
    //             : <>
    //                 <LikeButton isLiked={curComment.isLiked} 
    //                         handleLikeClick={handleLikeClick}
    //                         isActive={isPostActive && curComment.status == 'active'} />
    //                 {
    //                     (curUser.id == curComment.author.id || curUser.role === 'admin') && 
    //                     <button onClick={deleteComment}>Delete</button>
    //                 }
    //                 {
    //                     (curUser.id == curComment.author.id || curUser.role === 'admin') && 
    //                     <button onClick={() => {setIsUpdating(true)}}>
    //                         Update
    //                     </button>
    //                 }
    //                 <div>{curComment.content}</div>
    //                 <div>{curComment.status}</div>
    //                 <div>{curComment.author.login}</div>
    //                 <div>
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
    //             </>
    //         }
    //         <hr/>
    //     </div>
    // );

    function deleteComment() {
        fetch(SERVER_URL + `/api/comments/${curComment.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': curUser.token
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw response;
            }
            else {
                window.location.reload();
            }
        })
        .catch((err) => {
            console.log('err', err, err.body);
            switch(err.status) {
                case 401:
                case 403:
                    dispatch(removeUser());
                    window.location.href = '/login';
                    break;
                default:
                    window.location.href = '/error';
            }
        });
    }

    function handleLikeClick(type, action) {
        if (action == UPDATE) {
            fetch(SERVER_URL + `/api/comments/${curComment.id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': curUser.token
                },
                body: JSON.stringify({ 
                    type: type == LIKE ? 'like' : 'dislike'
                })
            })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                else {
                    setCurComment({
                        ...curComment,
                        isLiked: {
                            type: type == LIKE ? 'like' : 'dislike'
                        }
                    });
                }
            })
            .catch((err) => {
                console.log('err', err, err.body);
                switch(err.status) {
                    case 401:
                    case 403:
                        dispatch(removeUser());
                        window.location.href = '/login';
                        break;
                    default:
                        window.location.href = '/error';
                }
            });
        }
        else if (action == DELETE) {
            fetch(SERVER_URL + `/api/comments/${curComment.id}/like`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': curUser.token
                }
            })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                else {
                    setCurComment({
                        ...curComment,
                        isLiked: false
                    });
                }
            })
            .catch((err) => {
                console.log('err', err, err.body);
                switch(err.status) {
                    case 401:
                    case 403:
                        dispatch(removeUser());
                        window.location.href = '/login';
                        break;
                    default:
                        window.location.href = '/error';
                }
            });
        }
    }
}

export default CommentCard;

