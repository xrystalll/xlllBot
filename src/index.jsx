import React from 'react';
import ReactDOM from 'react-dom';
import 'index.css';
import Root from 'App';
import reportWebVitals from 'reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.querySelector('#root')
);

reportWebVitals();
