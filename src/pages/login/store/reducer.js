import {fromJS} from 'immutable'
import * as ACTIONTYPE from './actionType';
import * as actionCreater from './actionCreater'

const defaultState = fromJS({
    loginState :(sessionStorage.getItem('loginState') === '1')?true:false,
    first_boot:1
})

export default (state = defaultState , action)=>{
    switch(action.type){
        case ACTIONTYPE.CAHNGE_LOGIN:
        return state.merge({
            loginState:action.loginState,
            first_boot:action.first_boot
        })
            //return state.set('loginState',action.value)
        case ACTIONTYPE.LOGOUT:
            return state.set('loginState',action.value)
        default:
            return state;
    }
}