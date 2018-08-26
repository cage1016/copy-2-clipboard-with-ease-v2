const bluebird = require('bluebird');
import { TabIdentifier } from "chrome-tab-identifier";

// global.Promise = bluebird;

function promisifier(method) {
    // return a function
    return function promisified(...args) {
        // which returns a promise
        return new Promise((resolve) => {
            args.push(resolve);
            method.apply(this, args);
        });
    };
}

function promisifyAll(obj, list) {
    list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}

promisifyAll(chrome, [
    'tabs',
    'windows',
    'browserAction',
    'contextMenus'
]);
promisifyAll(chrome.storage, [
    'local',
]);

const tabIdentifier = new TabIdentifier();

require('./store')
require('./inject')
require('./tab')