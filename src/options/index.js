import React from 'react'
import App from './app'
import { render } from 'react-dom'

import { Store } from 'react-chrome-redux';
import { Provider } from 'react-redux';

const proxyStore = new Store({
  portName: 'copy'
});

proxyStore.ready().then(() => {
  render(
    <Provider store={proxyStore}>
      <App />
    </Provider>
    , document.getElementById('root'));
});