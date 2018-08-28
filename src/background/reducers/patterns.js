export const TOGGLE_DEFAULT_PATTERN = 'pattenrs/TOGGLE_DEFAULT_PATTERN'

const initialState = {}

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