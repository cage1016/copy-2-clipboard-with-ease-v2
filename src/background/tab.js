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


    if (SHOULD_DISABLE_TABS_TITLE.indexOf(tab.title) > -1) {
        await chrome.browserAction.disable(tab.id)
        return
    }

    console.log(tab.title)

    let p = patterns
    if (tab.url.match(INVALID_SCHEMA.join('|')))
        p = p.filter(pattern => pattern.indexOf(PATTERN_SURL) === -1)

    p.forEach(pattern => {
        chrome.contextMenus.create({
            title: `(P) ${pattern}`,
            contexts: ['page'],
            onclick: (info, tab) => {
                store.dispatch({
                    type: 'user-clicked-alias',
                    payload: {
                        pattern,
                        tab
                    }
                })
            }
        })
    })

    patterns.forEach(pattern => {
        chrome.contextMenus.create({
            title: `(L) ${pattern}`,
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

const queryShouldDisableTabs = async (title) => {
    return chrome.tabs.queryAsync({
        title: title
    }).then(([tab]) => tab ? tab.id : null)
}

(async () => {
    const ids = await Promise.all(SHOULD_DISABLE_TABS_TITLE.map(async (title) => await queryShouldDisableTabs(title)))
    ids.filter(id => id).forEach((id) => {
        chrome.browserAction.disable(id)
    })
})()
