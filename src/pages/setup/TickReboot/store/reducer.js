import {fromJS} from 'immutable'
import * as ACTIONTYPE from './actionType';
import moment from 'moment'

const defaultState = fromJS({   
    /**模式：0关闭，1倒计时，2指定时间重启 */ 
    sche_reboot_mode:0,
    /**定时：毫秒数 */
	rectime:0,
	weeks:	0,
    checkAll: false,
	hour:	0,
    minute:	0,
    show_t1hour:0,
    show_t1minute:10,
    checkedList:null,
    //deadline:0,
    remaining_time:0,
    time_of_day:0,
    show_time:'2019-01-01 00:00:00',
})

export default (state = defaultState , action)=>{ 
    switch(action.type){
        case ACTIONTYPE.TICK_ALL_CHECKED:
            return state.merge({
                checkedList:action.checkedList,
                checkAll:action.checkAll,
                weeks:action.weeks,
            })
        case ACTIONTYPE.TICK_INIT_SCHEDULE_TIME:
            return state.merge({
                weeks:action.weeks,
                sche_reboot_mode:action.sche_reboot_mode,
                hour:action.hour,
                minute:action.minute,
                rectime:action.rectime,
                show_t1hour:action.show_t1hour,
                show_t1minute:action.show_t1minute,
                //deadline:action.deadline,
                remaining_time:action.remaining_time,
                time_of_day:action.time_of_day,
                show_time:action.show_time
            })
        case ACTIONTYPE.TICK_TIME_OF_DAY:
            return state.merge({
                time_of_day:action.time_of_day,
                show_time:moment(new Date(action.time_of_day)).format('YYYY-MM-DD HH:mm:ss'),
            })
        case ACTIONTYPE.TICK_REC_TIME:
            return state.set('rectime',action.rectime)
        case ACTIONTYPE.TICK_SCHE_REBOOT_MODE:
            return state.set('sche_reboot_mode',action.sche_reboot_mode)

        case ACTIONTYPE.SHOW_TICK_H1:
            return state.set('show_t1hour',action.show_t1hour)
        case ACTIONTYPE.SHOW_TICK_M1:
            return state.set('show_t1minute',action.show_t1minute)
        case ACTIONTYPE.TICK_HOUR:
            return state.set('hour',action.hour)
        case ACTIONTYPE.TICK_MINUTE:
            return state.set('minute',action.minute)
        case ACTIONTYPE.TICK_WEEKS:
            return state.set('weeks',action.weeks)
        case ACTIONTYPE.TICK_CHECKED_LIST:
            return state.merge({
                checkedList:action.checkedList,
                checkAll:action.checkAll,
            })

        default:
            return state;
    }
}