import { combineReducers } from 'redux'
import patterns from './patterns'
import snackbar from './snackbar'


export default combineReducers({
    patterns,
    snackbar,
})