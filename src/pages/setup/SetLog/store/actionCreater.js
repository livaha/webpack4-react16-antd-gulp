import * as ACTIONTYPE from './actionType'
import axios from 'axios';
import {cgidata,cgi_url} from '@/pages/cgidata'
import { message } from 'antd';

export const changeLogData = (result) => ({
	type: ACTIONTYPE.CHANGE_LOG_DATA,
	log_size:result.log_size,
	syslog_enable:result.syslog_enable
});
const changeSysLog = (syslog) => ({
	type: ACTIONTYPE.CHANGE_SYS_LOG,
	syslog
});

const changeSysEnable = (syslog_enable) => ({
	type: ACTIONTYPE.CHANGE_SYS_ENABLE,
	syslog_enable
});
export const changeLogSize = (log_size) => ({
	type: ACTIONTYPE.CHANGE_LOG_SIZE,
	log_size
});

/**改变开关状态 */
export const  switchChange=(syslog_enable,log_size)=>{   
    return (dispatch) => {  
        dispatch(changeSysEnable(syslog_enable));
        let values = {syslog_enable,log_size}
        setLogCfg(dispatch,values);
    }
}

//获取系统日志配置 5
export const initLogData = () => {
	return (dispatch) => {            
        let values ={...cgidata.cgidata5};
        axios.post(cgi_url, {
            ...values
        }).then((res)=>{
            if(res.data.restcode == 2000){
                dispatch(changeLogData(res.data.result));
                //无论开关是否开启，都发送刷新请求，以备初始化store的值
                refreshLog(dispatch);  
            }else{                
                message.error(res.data.errmsg);
            }
        })
        .catch(function (error) {
            console.log(error);
            //alert('获取系统日志配置失败')
        });
	}
}


//设置系统日志配置  6
//接收参数为开关状态和日志大小
export const setLogCfg=(dispatch,values)=>{  
    values ={...cgidata.cgidata6,...values};     
    axios.post(cgi_url, {
        ...values
    }).then((res)=>{
        if(res.data.restcode == 2000){   
            //如果成功了，发送刷新请求
            refreshLog(dispatch);
            message.success('设置成功')

        }else{                
        message.error(res.data.errmsg);
    }
    })
    .catch(function (error) {
        console.log(error);
        //alert('设置系统日志配置失败')
    });
}
  
//设置系统日志配置  6
export const setSize = (values)=>{
	return (dispatch) => {       
        setLogCfg(dispatch,values)
	}
}

//刷新（显示）系统日志  7
//注意参数dispatch，从外面传进来
const  refreshLog=(dispatch)=>{   
    let value ={...cgidata.cgidata7};
    axios.post(cgi_url, {
        ...value
    }).then((res)=>{
        if(res.data.restcode == 2000){
            dispatch(changeSysLog(res.data.result.syslog));
        }else{                
            message.error(res.data.errmsg);
        }
    })
    .catch(function (error) {
        console.log(error);
        //alert('刷新（显示）系统日志 失败！')
    });
}

//刷新（显示）系统日志  7
export const handleRefreshLog =()=>{
	return (dispatch) => {
        dispatch(changeSysLog(''));
        refreshLog(dispatch)
	}
}

//清除系统日志  8
export const clearLog=()=>{   
    return (dispatch) => {       
        let values ={...cgidata.cgidata8};
        axios.post(cgi_url, {
            ...values
        }).then((res)=>{
            if(res.data.restcode == 2000){
                //如果成功了，发送刷新请求
                dispatch(changeSysLog(''));
                refreshLog(dispatch);  
            }else{                
                message.error(res.data.errmsg);
            }
        })
        .catch(function (error) {
            console.log(error);
            //alert('清除系统日志失败！')
        });
    }
}