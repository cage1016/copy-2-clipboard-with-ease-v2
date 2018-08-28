import { DEFAULT_ACTIONS, SNACKBAR_CONFIG } from './config'

export const loadState = async (getCurrentState) => {

    // chrome.storage.local.clear(function() {
    //     var error = chrome.runtime.lastError;
    //     if (error) {
    //         console.error(error);
    //     }
    // });

    const activetab = await chrome.tabs.queryAsync({
        active: true,
        currentWindow: true,
        status: 'complete'
    }).then(([tab]) => tab)
    
    const state = await chrome.storage.local.getAsync(['state']).then(result => result.state)
    
    if (state) {
        return state
    } else {
        return {
            ...getCurrentState(),
            default: {
                patterns: DEFAULT_ACTIONS.map(pattern => ({ pattern, isEnable: true, type: 'default' })),
                snackbar: SNACKBAR_CONFIG,
                activetab: {
                    tab: activetab,
                }
            }
        }
    }
}

export const saveState = async (state) => {
    await chrome.storage.local.setAsync({ state }).then(() => console.log(`set state to storage`))
}