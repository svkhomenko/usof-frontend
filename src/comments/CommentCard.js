import React, { useState } from 'react';
import { Buffer } from "buffer";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/slices/userSlice';
import { SERVER_URL } from "../const";
import UpdateComment from "./UpdateComment";

function CommentCard({ comment }) {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [curComment, setCurComment] = useState(comment);
    const [isUpdating, setIsUpdating] = useState(false);

    return (
        <div>
            {
                isUpdating
                ? <UpdateComment setIsUpdating={setIsUpdating} curComment={curComment} setCurComment={setCurComment} />
                : <>
                    {
                        (curUser.id == curComment.author.id || curUser.role === 'admin') && 
                        <button onClick={deleteComment}>Delete</button>
                    }
                    {
                        (curUser.id == curComment.author.id || curUser.role === 'admin') && 
                        <button onClick={() => {setIsUpdating(true)}}>
                            Update
                        </button>
                    }
                    <div>{curComment.content}</div>
                    <div>{curComment.status}</div>
                    <div>{curComment.author.login}</div>
                    <div>
                        {curComment.images.map((image) => {
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
                                    <img src={src} alt="comment" style={{width: "auto",
                                                                            height: "100%"}} />
                                </div>
                            );
                        })}
                    </div>
                </>
            }
            <hr/>
        </div>
    );

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
}

export default CommentCard;

