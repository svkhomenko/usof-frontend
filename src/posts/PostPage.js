import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { SERVER_URL } from "../const";
import PostComments from "./PostComments";
import { deletePostById, likeClick, favClick } from './post_tools';
import CreateComment from '../comments/CreateComment';
import UpdatePost from './UpdatePost';
import LikeButton from "../tools/LikeButton";
import FavButton from "../tools/FavButton";
import PostImages from "../tools/PostImages";
import { getSrc, getDateString } from "../tools/tools_func";

function PostPage() {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const { id: postId } = useParams();
    const [curPost, setCurPost] = useState();
    const [message, setMessage] = useState('Post is not found');
    const [isUpdating, setIsUpdating] = useState(false);
    
    useEffect(() => {
        fetch(SERVER_URL + `/api/posts/${postId}`, 
        {
            method: 'GET',
            headers: {
                'authorization': curUser.token
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .then((response) => {
            setCurPost(response);
        })
        .catch((err) => {
            console.log('err', err, err.body);
            switch(err.status) {
                case 403:
                case 404:
                    setCurPost(null);
                    break;
                default:
                    window.location.href = '/error';
            }
        });
    }, []);

    return (
        <div className='post_page'> 
            {
                curPost
                ? <>
                    {
                        isUpdating
                        ? <UpdatePost setIsUpdating={setIsUpdating} curPost={curPost} setCurPost={setCurPost} />
                        : <div className="post_card">
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
                                <div className='button_outer'>
                                    {
                                        (curUser.id == curPost.author.id || curUser.role === 'admin') && 
                                        <button onClick={() => {setIsUpdating(true)}} className="button negative update">
                                            Update
                                        </button>
                                    }
                                    {
                                        curUser.id && 
                                        <Link to={'/create-post'} className="button create">
                                            Create post
                                        </Link>
                                    }
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
                            </div>
                            <h2>{curPost.title}</h2>
                            <div className='content'>{curPost.content}</div>
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
                            <PostImages images={curPost.images} />
                        </div>
                    }
                    <PostComments isPostActive={curPost.status == 'active'} />
                    <CreateComment />
                </>
                : <div className='main_message'>{message}</div>
            }
        </div>
    );

    function deletePost() {
        deletePostById(postId, curUser,
            () => {
                dispatch(removeUser());
            },
            () => {
                setCurPost(null);
                setMessage('Post was successfully deleted');
            }
        );
    }

    function handleLikeClick(type, action) {
        likeClick(type, action, curPost, curUser, setCurPost, () => {dispatch(removeUser());});
    }

    function handleFavClick() {
        favClick(curPost, curUser, setCurPost, () => {dispatch(removeUser());});
    }
}

export default PostPage;

