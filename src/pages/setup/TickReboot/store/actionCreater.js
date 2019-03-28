import * as ACTIONTYPE from './actionType'
import axios from 'axios';
import {cgidata,cgi_url} from '@/pages/cgidata'
import { message } from 'antd';
import moment from 'moment'

export const handleSysTime = (time_of_day) => ({
    type: ACTIONTYPE.TICK_TIME_OF_DAY,
    time_of_day
});

export const show_t1hour = (show_t1hour) => ({
    type: ACTIONTYPE.SHOW_TICK_H1,
    show_t1hour
});

export const show_t1minute = (show_t1minute) => ({
    type: ACTIONTYPE.SHOW_TICK_M1,
    show_t1minute
});

export const show_t2hour = (hour) => ({
    type: ACTIONTYPE.TICK_HOUR,
    hour
});

export const show_t2minute = (minute) => ({
    type: ACTIONTYPE.TICK_MINUTE,
    minute
});

export const changeWeeks = (weeks) => ({
    type: ACTIONTYPE.TICK_WEEKS,
    weeks
});


export const changeRebootMode = (sche_reboot_mode) => ({
    type: ACTIONTYPE.TICK_SCHE_REBOOT_MODE,
    sche_reboot_mode:parseInt(sche_reboot_mode)
});

export const handleRectime = (rectime) => ({
    type: ACTIONTYPE.TICK_REC_TIME,
    rectime
});

export const changeCheckedData = (checkAll,checkedList,weeks) => ({
    type: ACTIONTYPE.TICK_ALL_CHECKED,
    checkAll,
    checkedList,
    weeks    
});

export const initScheduledTime = (result) => {
    return ({
    type: ACTIONTYPE.TICK_INIT_SCHEDULE_TIME,
    sche_reboot_mode:result.sche_reboot_mode,
    hour:result.hour,
    minute:result.minute,
	rectime:result.rectime,
    weeks:result.weeks,
    show_t1hour:Math.floor(result.rectime/3600),
    show_t1minute:Math.floor((result.rectime- (Math.floor(result.rectime/3600))*3600)/60),    
    //deadline:Date.now() + 1000 *60 * result.rectime,
    remaining_time:Date.now() + 1000 *result.remaining_time,
    time_of_day:result.time_of_day*1000,
    show_time:moment(new Date(result.time_of_day*1000)).format('YYYY-MM-DD HH:mm:ss'),
    

})};
export const changeScheduledTime = (sche_reboot_mode,rectime,weeks,hour,minute) => ({
    type: ACTIONTYPE.TICK_INIT_SCHEDULE_TIME,
    sche_reboot_mode,
    hour,
    minute,
	rectime,
	weeks,
    show_t1hour:0,
    show_t1minute:0,    
    //deadline:0,
    remaining_time:0
});

export const changeCheckedList = (checkedList,checkAll) => ({
    type: ACTIONTYPE.TICK_CHECKED_LIST,
    checkedList,
    checkAll
});

const changeCheckList = (dispatch,weeks) => {
    if(weeks == 255){     
    //if(weeks == 127){     
        let arr = [1,2,4,8,16,32,64]   
        dispatch(changeCheckedList(arr,true));
    }else if(weeks == 0){         
        dispatch(changeCheckedList([],false));
    }else{
        let weeksTo2 =weeks.toString(2).split(''); 
        let wlen = weeksTo2.length;
        let i=wlen-1,j=0,arr=[];
        for(i=wlen-1;i>=0;i--){
            if(weeksTo2[i]=='1'){
                arr.push(Math.pow(2,j));
            }
            j++;
        }
        dispatch(changeCheckedList(arr,false));
    }
}

export const handleRebootMode = (sche_reboot_mode) => {
    return (dispatch) => {   
        dispatch(changeRebootMode(sche_reboot_mode));
        sche_reboot_mode = parseInt(sche_reboot_mode);
        //console.log(sche_reboot_mode)
        let values ={...cgidata.cgidata10,sche_reboot_mode};    
        if(sche_reboot_mode==0){
            //直接发送关闭请求
            axios.post(cgi_url, {
                ...values
            }).then((res)=>{
                if(res.data.restcode == 2000){
                    //将新的时间戳赋给系统时间，让它继续定时
                    //console.log('关闭')
                    message.success('设置成功')
                }else{                
                    message.error(res.data.errmsg);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
};

export const initTickData=()=>{    
    let values ={...cgidata.cgidata9};    
    return (dispatch) => {   
        axios.post(cgi_url, {
            ...values
        }).then((res)=>{
            if(res.data.restcode == 2000){
                //将新的时间戳赋给系统时间，让它继续定时
                dispatch(initScheduledTime(res.data.result));
                changeCheckList(dispatch,res.data.result.weeks)
            }else{                
                message.error(res.data.errmsg);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const handleSendMode1Data=(sche_reboot_mode,rectime)=>{    
    let init_data={
        sche_reboot_mode,rectime
    }
    let values ={...cgidata.cgidata10,...init_data};    
    return (dispatch) => {   
        //需要将rectime保存到store中        
        dispatch(handleRectime(rectime));
        axios.post(cgi_url, {
            ...values
        }).then((res)=>{
            if(res.data.restcode == 2000){
                //将新的时间戳赋给系统时间，让它继续定时
                //message.success("设置成功");
                window.location.reload(true);
            }else{                
                message.error(res.data.errmsg);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const handleSendMode2Data=(sche_reboot_mode,rectime,weeks,hour,minute)=>{    
    let init_data={
        sche_reboot_mode,rectime,weeks,hour,minute
    }
    let values ={...cgidata.cgidata10,...init_data};    
    return (dispatch) => {   
        dispatch(changeScheduledTime(sche_reboot_mode,rectime,weeks,hour,minute));
        changeCheckList(dispatch,weeks)
        axios.post(cgi_url, {
            ...values
        }).then((res)=>{
            if(res.data.restcode == 2000){
                //将新的时间戳赋给系统时间，让它继续定时
                //message.success("设置成功");
                window.location.reload(true);
            }else{                
                message.error(res.data.errmsg);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}
