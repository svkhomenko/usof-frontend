import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setReset, removeSearchParameters } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";
import PageIndexContainer from "../filters/PageIndexContainer";
import CommentCard from '../comments/CommentCard';

function PostComments({ isPostActive }) {
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
        if (searchParameters.reset) {
            dispatch(setReset({
                reset: false
            }));
        }

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
    }, [postId, searchParameters.page, searchParameters.reset]);

    return (
        <div className='post_comments_outer'>
            <div className='small_title'>
                {countComments} comment{countComments != 1 && 's'}
            </div>
            {
                comments.length !== 0 
                ? <>
                    {comments.map((comment) => (
                        <CommentCard key={comment.id} comment={comment} isPostActive={isPostActive} />
                    ))}
                    <PageIndexContainer numberOfPages={Math.ceil(countComments / limit)}/>
                </>
                : <div className='small_message'>No comments found</div>
            }
        </div>
    );
}

export default PostComments;

