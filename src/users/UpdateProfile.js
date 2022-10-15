import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, removeUser } from '../store/slices/userSlice';
import { resetPage, setCategories } from '../store/slices/searchParametersSlice';
import { Buffer } from "buffer";
import { SERVER_URL, CLIENT_URL } from "../const";
import { validateLogin, validateFullName } from "../tools/dataValidation";

function UpdateProfile({ setIsUpdating }) {
    const dispatch = useDispatch();
    const curUser = useSelector((state) => state.user);

    const [login, setLogin] = useState(curUser.login);
    const [email, setEmail] = useState(curUser.email);
    const [fullName, setFullName] = useState(curUser.fullName);
    const [curAvatar, setCurAvatar] = useState(curUser.profilePicture);
    const [profilePicture, setProfilePicture] = useState(null);
    const [role, setRole] = useState(curUser.role);

    const [loginMessage, setLoginMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [fullNameMessage, setFullNameMessage] = useState('');
    const [profilePictureMessage, setProfilePictureMessage] = useState('');

    return (
        <> 
            <h1>Update profile</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Login:
                    <p>{loginMessage}</p>
                    <input type="text" value={login} onChange={handleChangeLogin} required />
                </label>
                <label>
                    Email:
                    <p>{emailMessage}</p>
                    <input type="email" value={email} onChange={handleChangeEmail} required />
                </label>
                <label>
                    Full name:
                    <p>{fullNameMessage}</p>
                    <input type="text" value={fullName} onChange={handleChangeFullName} required />
                </label>
                {
                    curUser.role == 'admin'
                    && <>
                        <label>
                            Role:
                            <select value={role} onChange={handleChangeRole}>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </label>
                    </>
                }
                <label>
                    Avatar:
                    {
                        curAvatar 
                        && <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "50px",
                                height: "50px",
                                overflow: "hidden"
                        }}>
                            <span onClick={handleChangeDeleteAvatar}>Delete</span>
                            <img src={'data:image/png;base64,' + Buffer.from(curAvatar, "binary").toString("base64")} 
                                    alt="avatar" style={{width: "auto",
                                                        height: "100%"}} />
                        </div>
                    }
                    <p>{profilePictureMessage}</p>
                    <input type="file" onChange={handleChangeProfilePicture} />
                    {
                        profilePicture
                        && <div>
                            {profilePicture.name}{' '}{profilePicture.size}
                        </div>
                    }
                </label>

                <input type="submit" value="Update profile" />
            </form>
        </>
    );

    function handleChangeLogin(event) {
        setLogin(event.target.value);
    }

    function handleChangeEmail(event) {
        setEmail(event.target.value);
    }

    function handleChangeFullName(event) {
        setFullName(event.target.value);
    }

    function handleChangeRole(event) {
        setRole(event.target.value);
    }

    function handleChangeProfilePicture(event) {
        setProfilePicture(event.target.files);
    }
    
    function handleChangeDeleteAvatar(event) {
        event.preventDefault();
        setCurAvatar(false);
    }
    
    function handleSubmit(event) {
        event.preventDefault();

        setLoginMessage('');
        setEmailMessage('');
        setFullNameMessage('');
        setProfilePictureMessage('');

        // | **PATCH** | `/api/users/:user_id` | Update user data | email, login, fullName, role, 
        // avatar, deleteAvatar (boolean), link (for client confirmation page, replace 'dot' with '.') |

        if (isDataValid()) {
            let isEmailChanged = email !== curUser.email;

            let formData = new FormData();

            formData.append("login", login);
            formData.append("email", email);
            formData.append("fullName", fullName);
            formData.append("role", role);
            if (!curAvatar) {
                formData.append("deleteAvatar", true);
            }
            if (profilePicture && profilePicture[0]) {
                formData.append("avatar", profilePicture[0]);
            }
            formData.append("link", CLIENT_URL + '/email-confirmation');
            
            fetch(SERVER_URL + `/api/users/${curUser.id}`, {
                method: 'PATCH',
                headers: {
                    'authorization': curUser.token
                },
                body: formData
            })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                else {
                    if (isEmailChanged) {
                        console.log('change email');
                        dispatch(removeUser());
                        // window.location.href = '/login';
                    }
                    else {
                        return response.json();
                    }
                }
            })
            .then((data) => {
                dispatch(setUser({
                    id: data.id,
                    login: data.login,
                    email: data.email,
                    fullName: data.fullName,
                    profilePicture: data.profilePicture,
                    role: data.role,
                    status: data.status,
                    rating: data.rating,
                    token: curUser.token
                }));
                setIsUpdating(false);
            })
            .catch((err) => {
                console.log('err', err, err.body);
                switch(err.status) {
                    case 400:
                        return err.json();
                    case 401:
                    case 403:
                    case 404:
                        dispatch(removeUser());
                        // window.location.href = '/login';
                        break;
                    default:
                        // window.location.href = '/error';
                }
            })
            .then((err) => {
                if (err && err.message) {
                    console.log(err.message);
                    if (err.message.includes('email')) {
                        setEmailMessage(err.message);
                    }
                    else if (err.message.includes('Full name')) {
                        setFullNameMessage(err.message);
                    }
                    else if (/login/i.test(err.message)) {
                        setLoginMessage(err.message);
                    }
                    else {
                        // window.location.href = '/error';
                    }
                }
            });
        }
    }

    function isDataValid() {
        let validData = true;

        validData = validateLogin(login, setLoginMessage) && validData;
        validData = validateFullName(fullName, setFullNameMessage) && validData;

        if (profilePicture && profilePicture[0] && !profilePicture[0].type.startsWith("image")) {
            setProfilePictureMessage("Upload files in an image format");
            validData = false;
        }

        return validData;
    }
}

export default UpdateProfile;

