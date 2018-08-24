import { REGEX_TITLE, REGEX_URL, REGEX_SURL, PATTERN_SURL } from './config'


async function Transform(title, url, pattern) {
    let text = pattern
    if (pattern.indexOf(PATTERN_SURL) >= 0) {
        const [err, surl] = await to(shortenUrl(url))
        return err ? [err] : [null, text.replace(REGEX_SURL, surl).replace(REGEX_TITLE, title)]
    }else{
        return [null, text.replace(REGEX_URL, url).replace(REGEX_TITLE, title)]
    }
}


async function shortenUrl(longUrl) {
    let response = await fetch(`https://is.gd/create.php?format=simple&url=${longUrl}`, {
        headers: {
            'content-type': 'text/html'
        }
    })
    let text = await response.text()
    if (text.startsWith('Error:')) {
        throw new Error(text)
    } else {
        return text
    }
}

function to(promise) {
    return promise.then(data => {
        return [null, data];
    }).catch(err => [err]);
}

module.exports = {
    Transform: Transform,
}