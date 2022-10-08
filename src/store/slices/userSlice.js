import { buildExternalHelpers } from '@babel/core';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: null,
    login: null,
    email: null,
    fullName: null,
    profilePicture: null,
    role: null,
    status: null,
    rating: null,
    token: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.id = action.payload.id;
            state.login = action.payload.login;
            state.email = action.payload.email;
            state.fullName = action.payload.fullName;
            state.profilePicture = action.payload.profilePicture;
            state.role = action.payload.role;
            state.status = action.payload.status;
            state.rating = action.payload.rating;
            state.token = action.payload.token;
        },
        removeUser(state) {
            state.id = null;
            state.login = null;
            state.email = null;
            state.fullName = null;
            state.profilePicture = null;
            state.role = null;
            state.status = null;
            state.rating = null;
            state.token = null;
        }
    }
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

