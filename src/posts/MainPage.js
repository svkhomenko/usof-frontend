import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeSearchParameters } from '../store/slices/searchParametersSlice';
import { Buffer } from "buffer";
import { SERVER_URL, GET_POSTS } from "../const";
import PageIndexContainer from "../filters/PageIndexContainer";
import OrderByContainer from "../filters/OrderByContainer";
import FilterStatusContainer, { getFilterStatus } from "../filters/FilterStatusContainer";
import SearchContainer from "../filters/SearchContainer";
import FilterCategoryContainer from "../filters/FilterCategoryContainer";
import FilterDateContainer, { getFilterDate } from "../filters/FilterDateContainer";
import PostCard from './PostCard';

function MainPage() {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);
    const searchParameters = useSelector((state) => state.searchParameters);

    console.log("curUser", curUser.id);

    const [posts, setPosts] = useState([]);
    const [countPosts, setCountPosts] = useState(0);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        dispatch(removeSearchParameters());
    }, []);

    useEffect(() => {
        fetch(SERVER_URL + '/api/posts?' + new URLSearchParams(
            {
                page: searchParameters.page,
                orderBy: searchParameters.orderBy,
                filterStatus: getFilterStatus(searchParameters),
                search : searchParameters.search,
                filterCategory: searchParameters.categories.map((category => category.title)).join(','),
                filterDate: getFilterDate(searchParameters)
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
            setPosts(response.allPosts);
            setCountPosts(response.countPosts);
            setLimit(response.limit);
        })
        .catch((err) => {
            console.log('err', err, err.body);
            if (err.status == 500) {
                window.location.href = '/error';
            }
        });
    }, [
        searchParameters.page, 
        searchParameters.orderBy, 
        searchParameters.activeChecked, 
        searchParameters.inactiveChecked, 
        searchParameters.search, 
        searchParameters.categories, 
        searchParameters.dateFrom,
        searchParameters.dateTo
    ]);

    return (
        <> 
            <h1>Main page</h1>
            {
                curUser.id && 
                <p>
                    <Link to={'/create-post'}>
                        Create post
                    </Link>
                </p>
            }
            <OrderByContainer />
            <FilterStatusContainer />
            <SearchContainer />
            <FilterCategoryContainer />
            <FilterDateContainer />
            <button onClick={resetSettings}>Reset settings</button>
            <div>
                {
                    posts.length !== 0 
                    ? <>
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </>
                    : <p>No posts found</p>
                }
            </div>
            <PageIndexContainer numberOfPages={Math.ceil(countPosts / limit)}/>
        </>
    );

    function resetSettings() {
        dispatch(removeSearchParameters());
    }
}

// function MainPage() {
//     const curUser = useSelector((state) => state.user);

//     const [posts, setPosts] = useState([]);
//     const [curPage, setCurPage] = useState(1);
//     const [orderBy, setOrderBy] = useState('like');
//     const [filterStatus, setFilterStatus] = useState(['active']);
//     const [search, setSearch] = useState('');
//     const [filterCategory, setFilterCategory] = useState([]);
//     const [filterDateFrom, setFilterDateFrom] = useState('');
//     const [filterDateTo, setFilterDateTo] = useState('');
//     const [reset, setReset] = useState(1);
//     const [countPosts, setCountPosts] = useState(0);
//     const [limit, setLimit] = useState(10);

//     useEffect(() => {
//         fetch(SERVER_URL + '/api/posts?' + new URLSearchParams(
//             {
//                 page: curPage,
//                 orderBy,
//                 filterStatus: filterStatus.join(','),
//                 search,
//                 filterCategory: filterCategory.join(','),
//                 filterDate: getFilterDate()
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
//             setPosts(response.allPosts);
//             setCountPosts(response.countPosts);
//             setLimit(response.limit);
//         })
//         .catch((err) => {
//             console.log('err', err, err.body);
//             if (err.status == 500) {
//                 window.location.href = '/error';
//             }
//         });
//     }, [curPage, orderBy, filterStatus, search, filterCategory, filterDateFrom, filterDateTo]);

//     return (
//         <> 
//             <h1>Main page</h1>
//             <OrderByContainer funcChangeOrderBy={changeOrderBy} reset={reset} />
//             <FilterStatusContainer funcChangeFilterStatus={changeFilterStatus} reset={reset} />
//             <SearchContainer funcChangeSearch={changeSearch} reset={reset} />
//             <FilterCategoryContainer funcChangeFilterCategory={changeFilterCategory} reset={reset} />
//             <FilterDateContainer funcChangeFilterDateFrom={changeFilterDateFrom}
//                                 funcChangeFilterDateTo={changeFilterDateTo}
//                                 reset={reset} />
//             <button onClick={resetSettings}>Reset settings</button>
//             <div>
//                 {
//                     posts.length !== 0 
//                     ? <>
//                         {posts.map((post) => {
//                             return (
//                                 <div key={post.id}>
//                                     <div>{post.title}</div>
//                                     <div>{post.content}</div>
//                                     <hr/>
//                                 </div>
//                             );
//                         })}
//                     </>
//                     : <p>No posts found</p>
//                 }
//             </div>
//             <PageIndexContainer funcSetCurPage={setCurPage}
//                                 curPage={curPage}
//                                 numberOfPages={Math.ceil(countPosts / limit)}/>
//         </>
//     );

//     function changeOrderBy(order) {
//         setOrderBy(order);
//         setCurPage(1);
//     }

//     function changeFilterStatus(status) {
//         setFilterStatus(status);
//         setCurPage(1);
//     }

//     function changeSearch(srch) {
//         setSearch(srch);
//         setCurPage(1);
//     }

//     function changeFilterCategory(titles) {
//         setFilterCategory(titles);
//         setCurPage(1);
//     }

//     function changeFilterDateFrom(from) {
//         setFilterDateFrom(from);
//         setCurPage(1);
//     }

//     function changeFilterDateTo(to) {
//         setFilterDateTo(to);
//         setCurPage(1);
//     }

//     function getFilterDate() {
//         let str = '';
//         if (filterDateFrom) {
//             str += filterDateFrom;
//         }
//         str += '...';
//         if (filterDateTo) {
//             str += filterDateTo;
//         }
//         return str;
//     }

//     function resetSettings() {
//         setReset(Math.random());
//     }
// }

export default MainPage;





// req.query.page
// req.query.orderBy == "date"
// req.query.filterStatus //admin:  active, inactive .split(',');
// req.query.search,
// req.query.filterCategory .split(',');
// req.query.filterDate //g...g


// throw new ValidationError("No such page", 400);
// if ((!valid0 && filterDate[0]) || (!valid1 && filterDate[1])) {
//     throw new ValidationError("FilterDate is invalid", 400);
// }

// res.status(200)
// .json({
//     limit,
//     countPosts: countPosts.length,
//     allPosts
// });


// res.status(400)
//     .json({ message: err.errors[0].message });
// }


// res.status(500)
//     .json({ message: err });
// } 

// return ({
//     id: post.id,
//     title: post.title,
//     publishDate: post.publishDate,
//     status: post.status,
//     content: post.content,
//     author: {
//         id: post.postAuthor.id,
//         login: post.postAuthor.login,
//         fullName: post.postAuthor.fullName,
//         email: post.postAuthor.email,
//         role: post.postAuthor.role,
//         profilePicture: post.postAuthor.profilePicture,
//         rating: await post.postAuthor.getRating(),
//         status: post.postAuthor.status
//     },
//     images: post.imageFromPosts.map(image => {
//         return ({
//             id: image.id,
//             image: image.image
//         });
//     }),
//     addToFavoritesUser: !!post.addToFavoritesUser.length,
//     isLiked: (ownlike ? { type: ownlike.type } : false),
//     categories: post.categories.map(category => {
//         return ({
//             id: category.id,
//             title: category.title,
//             description: category.description
//         });
//     }),
//     likesCount: await post.countLikeForPosts( { where: { type: "like" } }),
//     dislikesCount: await post.countLikeForPosts( { where: { type: "dislike" } })
// });




