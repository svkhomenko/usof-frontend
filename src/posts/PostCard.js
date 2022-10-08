import React from 'react';
import { Link } from "react-router-dom";
import { Buffer } from "buffer";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { setReset } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";

function PostCard({ post }) {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    return (
        <div>
            {
                (curUser.id == post.author.id || curUser.role === 'admin') && 
                <button onClick={deletePost}>Delete</button>
            }
            {
                (curUser.id == post.author.id || curUser.role === 'admin') && 
                <div>
                    <Link to={`/posts/${post.id}/update`}>
                        Update
                    </Link>
                </div>
            }
            <Link to={`/posts/${post.id}`}>
                <div>{post.title}</div>
                <div>{post.content}</div>
                <div>
                    {post.categories.map((category) => {
                        return (
                            <span key={category.id}>
                                {category.title}
                            </span>
                        );
                    })}
                </div>
                <div>
                    {post.images.map((image) => {
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
        deletePostById(post.id, curUser,
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
}

function deletePostById(postId, curUser, deleteUser, successFunc) {
    fetch(SERVER_URL + `/api/posts/${postId}`, {
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
            successFunc();
        }
    })
    .catch((err) => {
        console.log('err', err, err.body);
        switch(err.status) {
            case 401:
            case 403:
                deleteUser();
                window.location.href = '/login';
            default:
                window.location.href = '/error';
        }
    });
}

export { deletePostById };

export default PostCard;

