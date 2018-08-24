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

// function createContextMenu() {
//     chrome.contextMenus.removeAll();


//     chrome.contextMenus.create({
//         title: 'recally A',
//         contexts: ['link'],
//         onclick: (info, tab) => {
//             console.log(info, tab)

//             fetch(`https://is.gd/create.php?format=simple&url=${info.linkUrl}`, {
//                 headers: {
//                     'content-type': 'text/html'
//                 }
//             }).then((r) => {
//                 r.text().then(xx => console.log(xx))
//             })

//         }
//     });

//     chrome.contextMenus.create({
//         title: 'recally B',
//         contexts: ['page'],
//         onclick: (info, tab) => {
//             console.log(info, tab)
//         }
//     });

// }


// createContextMenu()