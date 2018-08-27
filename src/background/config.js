/**
 * copy 2 clipboard with ease version
 */
export const CURRENT_VERSION = '2.0.0'

export const PATTERN_TITLE = 'title'
export const PATTERN_URL = 'url'
export const PATTERN_SURL = 'surl'

/**
 * Default Action
 */
export const DEFAULT_ACTIONS = [
    `${PATTERN_TITLE}`,
    `[${PATTERN_TITLE}](${PATTERN_URL})`,
    `${PATTERN_TITLE} - ${PATTERN_URL}`,
    `${PATTERN_URL}`,
    `${PATTERN_SURL}`,
    `${PATTERN_TITLE} - ${PATTERN_SURL}`,
    `[${PATTERN_TITLE}](${PATTERN_SURL})`,
    `<html>[${PATTERN_TITLE}](${PATTERN_URL})</html>`,
    `=HYPERLINK("${PATTERN_URL}","${PATTERN_TITLE}")`,
]

/**
 * text pattern for title
 * @type {String}
 */
export const REGEX_TITLE = /title/gi;

/**
 * text pattern for url
 * @type {String}
 */
export const REGEX_URL = /url/gi;

/**
 * text pattern for shorten url
 * @type {String}
 */
export const REGEX_SURL = /surl/gi;

/**
 * status color
 */
export const STATUS_COLOR = {
    err: {
        color: '#ff4c62'
    },
    ok: {
        color: '#3c763d'
    }
};

export const AUTO_HIDE_DURATION = 1000

/**
 * inalid schema for shorten url
 */
export const INVALID_SCHEMA = ['^http://localhost', '^https://localhost']

export const SNACKBAR_CONFIG = {
    open: false,
    msg: '',
    vertical: 'bottom',
    horizontal: 'left',
    autoHideDuration: AUTO_HIDE_DURATION,
    targetTabId: ''
}

export const SHOULD_DISABLE_TABS_TITLE = ['Extensions', 'History', 'New Tab']