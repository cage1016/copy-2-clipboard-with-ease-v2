import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import * as asyncInitialState from 'redux-async-initial-state';
import { alias, wrapStore } from 'react-chrome-redux';
import { STATUS_COLOR, AUTO_HIDE_DURATION } from './config'
import { SNACKBAR_OPEN } from './reducers/snackbar'
import { Transform } from './transform'
import { default as copy } from './copy'
import { loadState, saveState } from './storage'
import { throttle } from 'lodash'


// We need outerReducer to replace full state as soon as it loaded
const reducer = asyncInitialState.outerReducer(combineReducers({
    ...reducers,
    // We need innerReducer to store loading state, i.e. for showing loading spinner
    // If you don't need to handle loading state you may skip it
    asyncInitialState: asyncInitialState.innerReducer,
}));


const loadStorage = (getCurrentState) => {
    return new Promise(async (resolve) => {
        const storage = await loadState(getCurrentState)
        resolve(storage)
    })
}

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// update chrome browser badge text and background color
const updateBadge = async (message, color, delay = -1) => {
    chrome.browserAction.setBadgeText({ text: message })
    chrome.browserAction.setBadgeBackgroundColor(color)
    await timeout(delay)
    chrome.browserAction.setBadgeText({ text: '' })
}


const aliases = {
    // this key is the name of the action to proxy, the value is the action
    // creator that gets executed when the proxied action is received in the
    // background
    'user-clicked-alias': ({ payload }) => async (dispatch) => {
        const { tab, pattern } = payload

        updateBadge('...', STATUS_COLOR.ok, AUTO_HIDE_DURATION)

        const [err, text] = await Transform(tab.title, tab.url, pattern)
        if (err) {
            updateBadge('err', STATUS_COLOR.err, AUTO_HIDE_DURATION)
            dispatch({
                type: SNACKBAR_OPEN,
                msg: `"${err}"`,
                targetTabId: tab.id
            })
        } else {
            // copy text to clipboard
            copy(text)

            updateBadge('done', STATUS_COLOR.ok, AUTO_HIDE_DURATION)
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

// On any state change, save the state to localStorage.
// Prevent the saveState function from being called too many times in case that
// state updates vary fast.
store.subscribe(throttle(() => {
    const state = store.getState()
    if (state.asyncInitialState.loaded) {
        saveState(state)
    }
}, 1000)) // At most once this length of time.

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