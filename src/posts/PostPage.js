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
import { getSrc } from "../tools/tools_func";

// function PostPage() {
//     const curUser = useSelector((state) => state.user);
//     const dispatch = useDispatch();

//     const { id: postId } = useParams();
//     const [curPost, setCurPost] = useState();
//     const [message, setMessage] = useState('Post is not found');
    
//     useEffect(() => {
//         fetch(SERVER_URL + `/api/posts/${postId}`, 
//         {
//             method: 'GET',
//             headers: {
//                 'authorization': curUser.token
//             }
//         })
//         .then((response) => {
//             if (!response.ok) {
//                 throw response;
//             }
//             return response.json();
//         })
//         .then((response) => {
//             setCurPost(response);
//         })
//         .catch((err) => {
//             console.log('err', err, err.body);
//             switch(err.status) {
//                 case 403:
//                 case 404:
//                     setCurPost(null);
//                 default:
//                     window.location.href = '/error';
//             }
//         });
//     }, []);

//     return (
//         <> 
//             {
//                 curPost
//                 ? <>
//                     <h1>{curPost.title}</h1>
//                     {
//                         (curUser.id == curPost.author.id || curUser.role === 'admin') && 
//                         <button onClick={deletePost}>Delete</button>
//                     }
//                     {
//                         curUser.id && 
//                         <p>
//                             <Link to={'/create-post'}>
//                                 Create Post
//                             </Link>
//                         </p>
//                     }
//                     {
//                         (curUser.id == curPost.author.id || curUser.role === 'admin') && 
//                         <div>
//                             <Link to={`/posts/${curPost.id}/update`}>
//                                 Update
//                             </Link>
//                         </div>
//                     }
//                     <div>{curPost.content}</div>
//                     <div>
//                         {curPost.categories.map((category) => {
//                             return (
//                                 <span key={category.id}>
//                                     {category.title}
//                                 </span>
//                             );
//                         })}
//                     </div>
//                     <div>
//                         {curPost.images.map((image) => {
//                             let src = 'data:image/png;base64,' + Buffer.from(image.image, "binary").toString("base64");
//                             return (
//                                 <div key={image.id} style={{
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                     width: "50px",
//                                     height: "50px",
//                                     overflow: "hidden"
//                                 }}>
//                                     <img src={src} alt="post" style={{width: "auto",
//                                                                             height: "100%"}} />
//                                 </div>
//                             );
//                         })}
//                     </div>
//                     <hr />
//                     <PostComments />
//                     <CreateComment />
//                 </>
//                 : <p>{message}</p>
//             }
//         </>
//     );

//     function deletePost() {
//         deletePostById(postId, curUser,
//             () => {
//                 dispatch(removeUser());
//             },
//             () => {
//                 setCurPost(null);
//                 setMessage('Post was successfully deleted');
//             }
//         );
//     }
// }

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
                default:
                    window.location.href = '/error';
            }
        });
    }, []);

    return (
        <> 
            {
                curPost
                ? <>
                    {
                        isUpdating
                        ? <UpdatePost setIsUpdating={setIsUpdating} curPost={curPost} setCurPost={setCurPost} />
                        : <>
                            <h1>{curPost.title}</h1>
                            <LikeButton isLiked={curPost.isLiked} 
                                        handleLikeClick={handleLikeClick}
                                        isActive={curPost.status == 'active'} />
                            <FavButton isFav={curPost.addToFavoritesUser} 
                                        handleFavClick={handleFavClick}
                                        isActive={curPost.status == 'active'} />
                            {
                                (curUser.id == curPost.author.id || curUser.role === 'admin') && 
                                <button onClick={deletePost}>Delete</button>
                            }
                            {
                                curUser.id && 
                                <p>
                                    <Link to={'/create-post'}>
                                        Create Post
                                    </Link>
                                </p>
                            }
                            {
                                (curUser.id == curPost.author.id || curUser.role === 'admin') && 
                                <button onClick={() => {setIsUpdating(true)}}>
                                    Update
                                </button>
                            }
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
                        </>
                    }
                    <hr />
                    <PostComments isPostActive={curPost.status == 'active'} />
                    <CreateComment />
                </>
                : <p>{message}</p>
            }
        </>
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

