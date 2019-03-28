import * as ACTIONTYPE from './actionType'
import axios from 'axios';
import {cgidata,cgi_url} from '@/pages/cgidata'
import { message } from 'antd';
import moment from 'moment'

export const changeNtpData = (data) => ({
    type: ACTIONTYPE.INIT_NTP_DATA,
    data
});
export const handleSysTime = (time_of_day) => ({
    type: ACTIONTYPE.NTP_TIME_OF_DAY,
    time_of_day
});
export const setTimeZone = (time_zone) => ({
    type: ACTIONTYPE.NTP_TIME_ZONE,
    time_zone
});

export const changeNtpEnable=(ntp_enable)=>({
    type: ACTIONTYPE.NTP_ENABLE,
    ntp_enable    
})

export const changeNtpServre=(ntp_server)=>({
    type: ACTIONTYPE.NTP_SERVER,
    ntp_server    
})

export const handleLocalTime=(browser_time_chuo)=>{
    //接收的是时间戳，要发送时间格式
    let browser_time = moment(browser_time_chuo).format("YYYY-MM-DD HH:mm:ss");
    let values ={...cgidata.cgidata4,browser_time};    
    return (dispatch) => {   
        axios.post(cgi_url, {
            ...values
        }).then((res)=>{
            if(res.data.restcode == 2000){
                //将新的时间戳赋给系统时间，让它继续定时
                dispatch(handleSysTime(browser_time_chuo)); 
                message.success('设置成功');
            }else{                
                message.error(res.data.errmsg);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const initNtpData=()=>{ 
    return (dispatch) => {   
        let values ={...cgidata.cgidata2};  
        axios.post(cgi_url, {
            ...values
        }).then((res)=>{
            if(res.data.restcode == 2000){
                //将接收到的时间转换格式存储，可以到dispatch里面转换                
                dispatch(changeNtpData(res.data.result));
            }else{                
                message.error(res.data.errmsg);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const handleSetNtpData=(ntp_enable,ntp_server,time_zone)=>{
    //需要设置服务器的值，同时还要发送数据给后台
    let values ={...cgidata.cgidata3,ntp_enable,ntp_server,time_zone};  
    return (dispatch) => {   

        dispatch(changeNtpServre(ntp_server));

        axios.post(cgi_url, {
            ...values
        }).then((res)=>{
            if(res.data.restcode == 2000){
                message.success('设置成功');
            }else{                
                message.error(res.data.errmsg);
            }
        })
        .catch(function (error) {
            console.log(error);
        });    
    }
}