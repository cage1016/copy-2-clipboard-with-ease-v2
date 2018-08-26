import { combineReducers } from 'redux'
import patterns from './patterns'
import snackbar from './snackbar'
import activetab from './activetab'


export default combineReducers({
    patterns,
    snackbar,
    activetab
})