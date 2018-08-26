import { store } from './store'
import { SET_ACTIVE_TAB_ID } from './reducers/activetab'


// update active tab when switch exist tab
chrome.tabs.onActivated.addListener((object) => {
    setActiveTab(object.tabId)
})


// update active tab when new tab created
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete') return
    setActiveTab(tab.id)
})


const setActiveTab = async (tabId) => {
    const activetab = await chrome.tabs.getAsync(tabId).then(activetab => activetab)
    store.dispatch({
        type: SET_ACTIVE_TAB_ID,
        activetab
    })
}

(async () => {
    await chrome.tabs.queryAsync({
        title: 'Extensions'
    }).then(tabs => {
        if (tabs) {
            tabs.forEach(tab => chrome.browserAction.disable(tab.id))
        }
    })
})()
