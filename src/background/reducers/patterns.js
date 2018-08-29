import { uniqBy } from 'lodash'

export const TOGGLE_DEFAULT_PATTERN = 'pattenrs/TOGGLE_DEFAULT_PATTERN'
export const ADD_CUSTOM_PATTERN = 'pattenrs/ADD_CUSTOM_PATTERN'
export const REMOVE_CUSTOM_PATTERN = 'pattenrs/REMOVE_CUSTOM_PATTERN'

const initialState = []

export default function patterns(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_DEFAULT_PATTERN:
            const updatedItems = state.map(item => {
                if (item.pattern === action.id) {
                    return { ...item, ...action.payload }
                }
                return item
            })
            return updatedItems
        case ADD_CUSTOM_PATTERN:
            return uniqBy([...state, action.payload], 'pattern')
        case REMOVE_CUSTOM_PATTERN:
            return state.filter(s => action.payload.patterns.indexOf(s.pattern) === -1)
        default:
            return state
    }
}

const action = (type, payload = {}) => ({
    type,
    id: payload.pattern,
    payload: { ...payload }
})

export const ToggleDefaultPattern = ({ pattern, isEnable }) => action(TOGGLE_DEFAULT_PATTERN, {
    pattern,
    isEnable: !isEnable
})

export const AddCustomPattern = ({ pattern, isEnable, type }) => action(ADD_CUSTOM_PATTERN, {
    pattern,
    isEnable,
    type
})

export const RemoveCustomPattern = ({ patterns }) => action(REMOVE_CUSTOM_PATTERN, {
    patterns
})