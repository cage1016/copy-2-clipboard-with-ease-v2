function createContextMenu() {
    chrome.contextMenus.removeAll();

    chrome.contextMenus.create({
        title: 'recally A',
        contexts: ['link'],
        onclick: (info, tab) => {
            console.log(info, tab)

            fetch(`https://is.gd/create.php?format=simple&url=${info.linkUrl}`, {
                headers: {
                    'content-type': 'text/html'
                }
            }).then((r) => {
                r.text().then(xx => console.log(xx))
            })

        }
    });

    chrome.contextMenus.create({
        title: 'recally B',
        contexts: ['page'],
        onclick: (info, tab) => {
            console.log(info, tab)
        }
    });
}
