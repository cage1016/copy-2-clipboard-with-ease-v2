import React from 'react';
import ReactDOM from 'react-dom';

const title = 'My Minimal React Webpack Babel Sdddetup';

ReactDOM.render(
  <div>{title}</div>,
  document.getElementById('root')
);

module.hot.accept();