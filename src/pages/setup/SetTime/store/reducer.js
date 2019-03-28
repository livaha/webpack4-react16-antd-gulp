import {fromJS} from 'immutable'
import * as ACTIONTYPE from './actionType';
import moment from 'moment'

const defaultState = fromJS({
    time_of_day:0,
    show_time:'2019-01-01 00:00:00',
    time_zone:'CST-8',
    ntp_enable:false,
    ntp_server:[]
})

export default (state = defaultState , action)=>{ 
    switch(action.type){
        case ACTIONTYPE.INIT_NTP_DATA:
            return state.merge({
                time_of_day:action.data.time_of_day*1000,
                show_time:moment(new Date(action.data.time_of_day*1000)).format('YYYY-MM-DD HH:mm:ss'),
                time_zone:action.data.time_zone,
                ntp_enable:action.data.ntp_enable,
                ntp_server:action.data.ntp_server
            })
        case ACTIONTYPE.NTP_SERVER:
            return state.set('ntp_server',action.ntp_server)
        case ACTIONTYPE.NTP_TIME_OF_DAY:
            return state.merge({
                time_of_day:action.time_of_day,
                show_time:moment(new Date(action.time_of_day)).format('YYYY-MM-DD HH:mm:ss'),
            })
        case ACTIONTYPE.NTP_TIME_ZONE:
            return state.set('time_zone',action.time_zone)
        case ACTIONTYPE.NTP_ENABLE:
            return state.set('ntp_enable',action.ntp_enable)
        default:
            return state;
    }
}