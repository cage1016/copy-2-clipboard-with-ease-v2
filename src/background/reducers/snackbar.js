import { debug } from "util";

export const SNACKBAR_OPEN = 'snackbar/SNACKBAR_OPEN'
export const SNACKBAR_CLOSE = 'snackbar/SNACKBAR_CLOSE'

const initialState = {}

export default function snackbar(state = initialState, action) {
    switch (action.type) {
        case SNACKBAR_OPEN:
            return {
                ...state,
                open: true,
                msg: action.msg,
                tabId: action.tabId
            }
        case SNACKBAR_CLOSE:
            return {
                ...state,
                open: false,
                msg: '',
                tabId: ''
            }
        default:
            return state
    }
}

const action = (type, payload = {}) => ({
    type,
    ...payload
})

export const CloseSnackbar = () => action(SNACKBAR_CLOSE)

export const OpenSnackbar = (msg) => action(SNACKBAR_OPEN, { msg, tabId: '' })