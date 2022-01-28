import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login';
import ListPosts from './list-posts';
import ListMessages from './list-messages';

const domContainer = document.querySelector('#ORT');
ReactDOM.render( React.createElement(Login , null ), domContainer);