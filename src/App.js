import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from './store/slices/userSlice';
import { SERVER_URL } from "./const";
import "./styles/main.css";

import Login from "./auth/Login";
import Register from "./auth/Register";
import EmailConfirmation from "./auth/EmailConfirmation";
import SendPasswordConfirmation from "./auth/SendPasswordConfirmation";
import PasswordConfirmation from "./auth/PasswordConfirmation";

import Header from "./tools/Header";

import AllUsersPage from "./users/AllUsersPage";
import ProfilePage from "./users/ProfilePage";
import UserPage from "./users/UserPage";
import CreateUser from "./users/CreateUser";

import MainPage from "./posts/MainPage";
import PostPage from "./posts/PostPage";
import CreatePost from "./posts/CreatePost";

import AllCategoriesPage from "./categories/AllCategoriesPage";
import CategoryPage from "./categories/CategoryPage";
import CreateCategory from "./categories/CreateCategory";

import NotFound from "./tools/NotFound";
import ErrorPage from "./tools/ErrorPage";

function App() {
    const curUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        // if (curUser.id) {
        //     fetch(SERVER_URL + `/api/users/${curUser.id}`, 
        //     {
        //         method: 'GET',
        //         headers: {
        //             'authorization': curUser.token
        //         }
        //     })
        //     .then((response) => {
        //         if (!response.ok) {
        //             dispatch(removeUser());
        //             throw response;
        //         }
        //     })
        //     .catch((err) => {
        //         console.log('err', err, err.body);
        //         window.location.href = '/error';
        //     });
        // }

        if (curUser.id) {
            fetch(SERVER_URL + `/api/posts/favorites`, 
            {
                method: 'GET',
                headers: {
                    'authorization': curUser.token
                }
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(removeUser());
                    // throw response;
                }
            })
            // .catch((err) => {
            //     console.log('err', err, err.body);
            //     window.location.href = '/error';
            // });
        }
    }, []);

    return (
        <Router>
            <Header />
            
            <Routes>
                <Route path="/login" element={curUser.id ? <Navigate to="/" /> : <Login />} />
                <Route path="/register" element={curUser.id ? <Navigate to="/" /> : <Register />} />
                <Route path="/email-confirmation/:token" element={<EmailConfirmation />} />
                <Route path="/password-reset" element={<SendPasswordConfirmation />} />
                <Route path="/password-reset/:token" element={<PasswordConfirmation />} />

                <Route path="/profile" element={curUser.id ? <ProfilePage /> : <Navigate to="/" />} />
                <Route path="/users" element={<AllUsersPage />} />
                <Route path="/users/:id" element={<UserPage />} />
                <Route path="/create-user" element={curUser.role === "admin" ? <CreateUser /> : <Navigate to="/users" />} />

                <Route path="/" element={<MainPage />} />
                <Route path="/posts/:id" element={<PostPage />} />
                <Route path="/create-post" element={curUser.id ? <CreatePost /> : <Navigate to="/login" />} />

                <Route path="/categories" element={<AllCategoriesPage />} />
                <Route path="/categories/:id" element={<CategoryPage />} />
                <Route path="/create-category" element={curUser.role === "admin" ? <CreateCategory /> : <Navigate to="/categories" />} />
               
                <Route path="/error" element={<ErrorPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;

