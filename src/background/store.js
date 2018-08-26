import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import * as asyncInitialState from 'redux-async-initial-state';
import { alias, wrapStore } from 'react-chrome-redux';
import { DEFAULT_ACTIONS, SNACKBAR_CONFIG } from './config'
import { SNACKBAR_OPEN } from './reducers/snackbar'
import { Transform } from './transform'
import { default as copy } from './copy'


// We need outerReducer to replace full state as soon as it loaded
const reducer = asyncInitialState.outerReducer(combineReducers({
    ...reducers,
    // We need innerReducer to store loading state, i.e. for showing loading spinner
    // If you don't need to handle loading state you may skip it
    asyncInitialState: asyncInitialState.innerReducer,
}));


const loadStorage = (getCurrentState) => {
    return new Promise(async (resolve) => {

        const activetab = await chrome.tabs.queryAsync({
            active: true,
            currentWindow: true,
            status: 'complete'
        }).then(([tab]) => tab)

        chrome.storage.local.get('state', items => {
            resolve(items.state ? JSON.parse(items.state) : {
                ...getCurrentState(),
                default: {
                    patterns: DEFAULT_ACTIONS,
                    snackbar: SNACKBAR_CONFIG,
                    activetab: {
                        tab: activetab,
                    }
                }
            })
        })
    })
}


const aliases = {
    // this key is the name of the action to proxy, the value is the action
    // creator that gets executed when the proxied action is received in the
    // background
    'user-clicked-alias': ({ payload }) => async (dispatch) => {
        const { tab, pattern } = payload
        const [err, text] = await Transform(tab.title, tab.url, pattern)
        if (err) {
            dispatch({
                type: SNACKBAR_OPEN,
                msg: `"${err}"`,
                targetTabId: tab.id
            })
        } else {
            // copy text to clipboard
            copy(text)

            dispatch({
                type: SNACKBAR_OPEN,
                msg: `"${text}" copied`,
                targetTabId: tab.id
            })
        }
    },
    'get-current-tab': () => async (dispatch) => {
        const tab = await chrome.tabs.queryAsync({
            active: true,
            currentWindow: true
        }).then(tabs => tabs[0])

        return {
            type: `ACTION_GET_SESSION`,
            tab
        }
    }
}


const store = createStore(
    reducer,
    compose(applyMiddleware(alias(aliases), thunk, asyncInitialState.middleware(loadStorage)))
)


const reduxPromiseResponder = (dispatchResult, send) => {
    return Promise
        .resolve(dispatchResult)
        .then(res => {
            // resolve(value && value.payload); is used by the promise in the content script store dispatch
            return send({ error: null, value: { payload: res } });
        })
        .catch(error => send({ error, value: null }))
};


wrapStore(store, {
    portName: 'copy',
    dispatchResponder: reduxPromiseResponder
});


store.dispatch({
    type: 'MANUAL_INIT',
})


module.exports = {
    store: store
}