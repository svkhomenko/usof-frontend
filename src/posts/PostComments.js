import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeSearchParameters } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";
import PageIndexContainer from "../filters/PageIndexContainer";
import CommentCard from '../comments/CommentCard';

function PostComments() {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);
    const searchParameters = useSelector((state) => state.searchParameters);

    const { id: postId } = useParams();

    const [comments, setComments] = useState([]);
    const [countComments, setCountComments] = useState(0);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        dispatch(removeSearchParameters());
    }, []);

    useEffect(() => {
        fetch(SERVER_URL + `/api/posts/${postId}/comments?` + new URLSearchParams(
            {
                page: searchParameters.page
            }
        ), 
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
            setComments(response.allComments);
            setCountComments(response.countComments);
            setLimit(response.limit);
        })
        .catch((err) => {
            console.log('err', err, err.body);
            switch(err.status) {
                case 403:
                case 404:
                    setComments([]);
                    setCountComments(0);
                default:
                    window.location.href = '/error';
            }
        });
    }, [ postId, searchParameters.page]);

    return (
        <>
            <h2>{countComments} comments</h2>
            <div>
                {
                    comments.length !== 0 
                    ? <>
                        {comments.map((comment) => (
                            <CommentCard key={comment.id} comment={comment} />
                        ))}
                    </>
                    : <p>No comments found</p>
                }
            </div>
            <PageIndexContainer numberOfPages={Math.ceil(countComments / limit)}/>
        </>
    );
}

export default PostComments;

