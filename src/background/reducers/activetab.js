export const SET_ACTIVE_TAB_ID = 'activetab/SET_ACTIVE_TAB_ID'

const initialState = {}

export default function activetab(state = initialState, action) {
    switch (action.type) {
        case SET_ACTIVE_TAB_ID:    
            return {
                ...state,
                tab: action.activetab
            }
        default:
            return state
    }
}