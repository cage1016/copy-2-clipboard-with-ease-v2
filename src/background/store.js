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
    return new Promise(resolve => {
        chrome.storage.local.get('state', items => {
            resolve(items.state ? JSON.parse(items.state) : {
                ...getCurrentState(),
                default: {
                    patterns: DEFAULT_ACTIONS,
                    snackbar: SNACKBAR_CONFIG
                }
            })
        })
    })
}


const aliases = {
    // this key is the name of the action to proxy, the value is the action
    // creator that gets executed when the proxied action is received in the
    // background
    'user-clicked-alias': ({ pattern }) => async (dispatch) => {
        // get current tab
        const tab = await chrome.tabs.queryAsync({
            active: true,
            currentWindow: true
        }).then(tabs => tabs[0])

        // trnasform copy pattern
        const [err, text] = await Transform(tab.title, tab.url, pattern)
        if (err) {
            dispatch({
                type: SNACKBAR_OPEN,
                msg: `"${err}"`, tabId: tab.id
            })
        }else{
            // copy text to clipboard
            copy(text)

            dispatch({
                type: SNACKBAR_OPEN,
                msg: `"${text}" copied`, tabId: tab.id
            })
        }
    }
}

const store = createStore(
    reducer,
    compose(applyMiddleware(asyncInitialState.middleware(loadStorage), alias(aliases), thunk))
)

wrapStore(store, {
    portName: 'copy'
});

store.dispatch({
    type: 'MANUAL_INIT',
})

