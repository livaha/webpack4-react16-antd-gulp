/**
 * Created by pca on 2018/03/28.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter } from 'react-router-dom';

import 'antd/dist/antd.css';

import App from './App';

ReactDOM.render(<HashRouter>
   <App/>
</HashRouter>,document.getElementById('content'));