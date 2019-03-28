import {fromJS} from 'immutable'
import * as ACTIONTYPE from './actionType';

const defaultState = fromJS({
    syslog_enable:false,
    log_size:64,
    syslog:""
})

export default (state = defaultState , action)=>{
    switch(action.type){
        case ACTIONTYPE.CHANGE_LOG_DATA:
            return state.merge({
                log_size:action.log_size,
	            syslog_enable:action.syslog_enable
            })
        case ACTIONTYPE.CHANGE_SYS_LOG:
            return state.set('syslog',action.syslog)
        case ACTIONTYPE.CHANGE_SYS_ENABLE:
        return state.set('syslog_enable',action.syslog_enable)
        case ACTIONTYPE.CHANGE_LOG_SIZE:
            return state.set('log_size',action.log_size)

        default:
            return state;
    }
}