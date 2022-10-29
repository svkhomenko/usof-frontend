import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setReset, removeSearchParameters } from '../store/slices/searchParametersSlice';
import { SERVER_URL } from "../const";
// import PageIndexContainer from "../filters/PageIndexContainer";
import CommentCard from '../comments/CommentCard';

// function PostComments({ isPostActive }) {
//     const dispatch = useDispatch();
//     const curUser = useSelector((state) => state.user);
//     const searchParameters = useSelector((state) => state.searchParameters);
//     const { id: postId } = useParams();

//     const [comments, setComments] = useState([]);
//     const [countComments, setCountComments] = useState(0);
//     const [limit, setLimit] = useState(10);

//     useEffect(() => {
//         dispatch(removeSearchParameters());
//     }, []);

//     useEffect(() => {
//         if (searchParameters.reset) {
//             dispatch(setReset({
//                 reset: false
//             }));
//         }

//         fetch(SERVER_URL + `/api/posts/${postId}/comments?` + new URLSearchParams(
//             {
//                 page: searchParameters.page
//             }
//         ), 
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
//             setComments(response.allComments);
//             setCountComments(response.countComments);
//             setLimit(response.limit);
//         })
//         .catch((err) => {
//             console.log('err', err, err.body);
//             switch(err.status) {
//                 case 403:
//                 case 404:
//                     setComments([]);
//                     setCountComments(0);
//                 default:
//                     window.location.href = '/error';
//             }
//         });
//     }, [postId, searchParameters.page, searchParameters.reset]);

//     return (
//         <div className='post_comments_outer'>
//             <div className='small_title'>
//                 {countComments} comment{countComments != 1 && 's'}
//             </div>
//             {
//                 comments.length !== 0 
//                 ? <>
//                     {comments.map((comment) => (
//                         <CommentCard key={comment.id} comment={comment} isPostActive={isPostActive} />
//                     ))}
//                     <PageIndexContainer numberOfPages={Math.ceil(countComments / limit)}/>
//                 </>
//                 : <div className='small_message'>No comments found</div>
//             }
//         </div>
//     );
// }

// function PostComments({ isPostActive }) {
//     const dispatch = useDispatch();
//     const curUser = useSelector((state) => state.user);
//     const searchParameters = useSelector((state) => state.searchParameters);
//     const { id: postId } = useParams();

//     const [comments, setComments] = useState([]);
//     const [countComments, setCountComments] = useState(0);
//     const [limit, setLimit] = useState(10);
    
//     const commentsRef = useRef({});

//     useEffect(() => {
//         dispatch(removeSearchParameters());
//     }, []);

//     useEffect(() => {
//         if (searchParameters.reset) {
//             dispatch(setReset({
//                 reset: false
//             }));
//         }

//         fetch(SERVER_URL + `/api/posts/${postId}/comments?` + new URLSearchParams(
//             {
//                 page: searchParameters.page
//             }
//         ), 
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
//             setComments(response.allComments);
//             setCountComments(response.countComments);
//             setLimit(response.limit);
//         })
//         .catch((err) => {
//             console.log('err', err, err.body);
//             switch(err.status) {
//                 case 403:
//                 case 404:
//                     setComments([]);
//                     setCountComments(0);
//                 default:
//                     window.location.href = '/error';
//             }
//         });
//     }, [postId, searchParameters.page, searchParameters.reset]);

//     return (
//         <div className='post_comments_outer'>
//             <div className='small_title'>
//                 {countComments} comment{countComments != 1 && 's'}
//             </div>
//             {
//                 comments.length !== 0 
//                 ? <>
//                     {comments.map((comment) => (
//                         <CommentCard key={comment.id} 
//                                     comment={comment} 
//                                     isPostActive={isPostActive}
//                                     innerRef={commentsRef.current}
//                                     goToRef={goToRef}
//                         />
//                     ))}
//                     <PageIndexContainer numberOfPages={Math.ceil(countComments / limit)}/>
//                 </>
//                 : <div className='small_message'>No comments found</div>
//             }
//         </div>
//     );

//     function goToRef(commentId) {
//         if (commentsRef.current[commentId]) {
//             commentsRef.current[commentId].scrollIntoView({ behavior: "smooth", block: "start" });
//         }
//     }
// }

function PostComments({ isPostActive }) {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);
    const searchParameters = useSelector((state) => state.searchParameters);
    const { id: postId } = useParams();

    const [comments, setComments] = useState([]);
    const [countComments, setCountComments] = useState(0);
    // const [limit, setLimit] = useState(10);
    
    const commentsRef = useRef({});

    useEffect(() => {
        dispatch(removeSearchParameters());
    }, []);

    // useEffect(() => {
    //     if (searchParameters.reset) {
    //         uploadComments(false);
    //         dispatch(setReset({
    //             reset: false
    //         }));
    //     }
    //     else {
    //         uploadComments();
    //     }
    // }, [postId, searchParameters.reset]);

    useEffect(() => {
        uploadComments();
    }, [postId]);

    useEffect(() => {
        if (searchParameters.reset) {
            uploadComments(false);
            dispatch(setReset({
                reset: false
            }));
        }
    }, [searchParameters.reset]);
    
    return (
        <div className='post_comments_outer'>
            <div className='small_title'>
                {countComments} comment{countComments != 1 && 's'}
            </div>
            {
                comments.length !== 0 
                ? <>
                    {comments.map((comment) => (
                        <CommentCard key={comment.id} 
                                    comment={comment} 
                                    isPostActive={isPostActive}
                                    innerRef={commentsRef.current}
                                    goToRef={goToRef}
                        />
                    ))}
                    {
                        (countComments > comments.length) &&
                        <div onClick={uploadComments}>
                            See more comments
                        </div>
                    }
                    {/* update */}
                </>
                : <div className='small_message'>No comments found</div>
            }
        </div>
    );

    function goToRef(commentId) {
        if (commentsRef.current[commentId]) {
            commentsRef.current[commentId].scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function uploadComments(showNew = true) {
        // console.log(showNew);
        let searchParams = {};

        if (!showNew) {
            searchParams.numberOfPosts = comments.length;
        }
        else {
            if (comments.length > 0) {
                searchParams.lastDate = comments[comments.length - 1].publishDate;
            }
        }

        console.log(searchParams);

        // let lastDate = '';
        // let numberOfPosts = '';

        // if (!showNew) {
        //     numberOfPosts = comments.length
        // }
        // else {
        //     if (comments.length > 0) {
        //         lastDate = comments[comments.length - 1].publishDate;
        //     }
        // }

        fetch(SERVER_URL + `/api/posts/${postId}/comments?` + new URLSearchParams(searchParams), 
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
            if (searchParams.numberOfPosts) {
                setComments(response.allComments);
            }
            else {
                setComments([...comments, ...response.allComments]);
            }

            if (!searchParams.lastDate) {
                setCountComments(response.countComments);
            }
            // setLimit(response.limit);
        })
        .catch((err) => {
            console.log('err', err, err.body);
            switch(err.status) {
                case 403:
                case 404:
                    setComments([]);
                    setCountComments(0);
                    break;
                default:
                    window.location.href = '/error';
            }
        });
    }
}

export default PostComments;

