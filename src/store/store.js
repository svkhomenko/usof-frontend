// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from './slices/userSlice';
// import searchParametersReducer from './slices/searchParametersSlice';

// export default configureStore({
//     reducer: {
//         user: userReducer,
//         searchParameters: searchParametersReducer
//     },
// });


import { configureStore, combineReducers, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice';
import searchParametersReducer from './slices/searchParametersSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, combineReducers({ user: userReducer, searchParameters: searchParametersReducer }));

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: { warnAfter: 128 }
        }),
});

export const persistor = persistStore(store);

