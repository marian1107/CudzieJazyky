import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import config from './firebase';
import Firebase from 'firebase';
import base from 're-base';

const app = Firebase.initializeApp(config);
let db = Firebase.firestore(app);
const settings = { };
db.settings(settings);
export let rebase = base.createClass(db);
export let firebase = db;

console.log(firebase);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
