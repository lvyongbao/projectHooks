import React from 'react';
import ReactDOM from 'react-dom';
import signOn from '@/signOn';
import App from './App';

signOn(() => {
  // eslint-disable-next-line react/jsx-filename-extension
  ReactDOM.render(<App />, document.querySelector('#root'));
});
