import React from 'react'
import App from './app'
import { render } from 'react-dom'
import { Store } from 'react-chrome-redux';
import { Provider } from 'react-redux';

const proxyStore = new Store({
    portName: 'copy'
});

window.addEventListener('load', () => {
    const injectDOM = document.createElement('div');
    injectDOM.className = 'inject-react-example';
    injectDOM.style.textAlign = 'center';
    document.body.appendChild(injectDOM);

    proxyStore.ready().then(() => {
        render(
            <Provider store={proxyStore}>
                <App />
            </Provider>
            , injectDOM);
    });
});