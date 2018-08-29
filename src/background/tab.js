import { store } from './store'
import { SET_ACTIVE_TAB_ID } from './reducers/activetab'
import { INVALID_SCHEMA, PATTERN_SURL, SHOULD_DISABLE_TABS_TITLE } from './config'

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
    setMenu()
}

const setMenu = async () => {
    chrome.contextMenus.removeAll()

    const { default: {
        activetab: {
            tab
        },
        patterns
    } } = store.getState()

    // console.log('current tab → ', tab)
    
    if (!tab.url) {
        await chrome.browserAction.disable(tab.id)
        return
    }

    if (tab && tab.url) {

        let p = patterns
        if (tab.url.match(INVALID_SCHEMA.join('|')))
            p = p.filter(item => item.pattern.indexOf(PATTERN_SURL) === -1)


        p.filter(item => item.isEnable).forEach(item => {
            chrome.contextMenus.create({
                title: `(P) ${item.pattern}`,
                contexts: ['page'],
                onclick: (info, tab) => {
                    store.dispatch({
                        type: 'user-clicked-alias',
                        payload: {
                            pattern: item.pattern,
                            tab
                        }
                    })
                }
            })
        })

        patterns.filter(item => item.isEnable).forEach(item => {
            chrome.contextMenus.create({
                title: `(L) ${item.pattern}`,
                contexts: ['link'],
                onclick: (info, tab) => {
                    store.dispatch({
                        type: 'user-clicked-alias',
                        payload: {
                            pattern,
                            tab: {
                                title: info.selectionText,
                                url: info.linkUrl,
                                id: tab.id,
                            }
                        }
                    })
                }
            })
        })
    }
}

const queryShouldDisableTabs = async () => {
    return chrome.tabs.queryAsync({}).then(tabs => tabs.filter(tab => !tab.url).map(tab => tab.id))
}

(async () => {
    const ids = await queryShouldDisableTabs()
    ids.forEach((id) => {
        chrome.browserAction.disable(id)
    })
})()
