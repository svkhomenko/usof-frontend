import { SERVER_URL } from "../const";

function deleteCategoryById(categoryId, curUser, deleteUser, successFunc) {
    fetch(SERVER_URL + `/api/categories/${categoryId}`, {
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

export { deleteCategoryById };

