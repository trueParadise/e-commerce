import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {persistor} from './redux/store';
import configStore from './redux/store';
import App from './App';
import 'antd/dist/antd.css';

ReactDOM.render(
<Provider store={configStore}>
    <PersistGate loading={null} persistor={persistor}>
        <App/>
    </PersistGate>
</Provider>,
document.getElementById('root'));

