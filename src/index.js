// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// import store from './store/store';
// import { Provider } from 'react-redux';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <Provider store={store}>
//         <App />
//     </Provider>
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { persistor, store } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
);

