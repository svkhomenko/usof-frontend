import { SERVER_URL, LIKE, UPDATE, DELETE } from "../const";

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
                break;
            default:
                window.location.href = '/error';
        }
    });
}

function likeClick(type, action, curPost, curUser, setCurPost, deleteUser) {
    if (action == UPDATE) {
        fetch(SERVER_URL + `/api/posts/${curPost.id}/like`, {
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
                setCurPost({
                    ...curPost,
                    isLiked: {
                        type: type == LIKE ? 'like' : 'dislike'
                    },
                    ...getCount()
                });
            }
        })
        .catch((err) => {
            console.log('err', err, err.body);
            switch(err.status) {
                case 401:
                case 403:
                    deleteUser();
                    window.location.href = '/login';
                    break;
                default:
                    window.location.href = '/error';
            }
        });
    }
    else if (action == DELETE) {
        fetch(SERVER_URL + `/api/posts/${curPost.id}/like`, {
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
                setCurPost({
                    ...curPost,
                    isLiked: false,
                    ...getCount()
                });
            }
        })
        .catch((err) => {
            console.log('err', err, err.body);
            switch(err.status) {
                case 401:
                case 403:
                    deleteUser();
                    window.location.href = '/login';
                    break;
                default:
                    window.location.href = '/error';
            }
        });
    }

    function getCount() {
        let likesCount = curPost.likesCount;
        let dislikesCount = curPost.dislikesCount;

        if (action == UPDATE) {
            if (type == LIKE) {
                likesCount++;
                if (curPost.isLiked) {
                    dislikesCount--;
                }
            }
            else {
                dislikesCount++;
                if (curPost.isLiked) {
                    likesCount--;
                }
            }
        }
        else if (action == DELETE) {
            if (type == LIKE) {
                likesCount--;
            }
            else {
                dislikesCount--;
            }
        }

        return ({
            likesCount,
            dislikesCount
        });
    }
}

function favClick(curPost, curUser, setCurPost, deleteUser) {
    fetch(SERVER_URL + `/api/posts/${curPost.id}/favorites`, {
        method: 'POST',
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
            setCurPost({
                ...curPost,
                addToFavoritesUser: !curPost.addToFavoritesUser
            });
        }
    })
    .catch((err) => {
        console.log('err', err, err.body);
        switch(err.status) {
            case 401:
            case 403:
                deleteUser();
                window.location.href = '/login';
                break;
            default:
                window.location.href = '/error';
        }
    });
}

export { deletePostById, likeClick, favClick };

