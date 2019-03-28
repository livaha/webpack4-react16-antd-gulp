import {fromJS} from 'immutable';
import * as ACTIONTYPE from './actionType';

const defaultState = fromJS({
    ipaddr:'',
    netmask:'',
    showProgress:false,
    locktime:0,
    redir_ip:'',
});

export default (state = defaultState , action)=>{
    switch(action.type){
        case ACTIONTYPE.LAN_MSG:
            return state.merge({
                ipaddr:action.ipaddr,
                netmask:action.netmask
            })

        case ACTIONTYPE.LAN_SHOW_PROGRESS:
            return state.merge({
                showProgress:action.showProgress,                
                locktime:action.locktime,
                redir_ip:action.redir_ip,
            })
        default:
            return state;
    }
}