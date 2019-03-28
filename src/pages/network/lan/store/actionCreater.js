import * as ACTIONTYPE  from './actionType';
import axios from 'axios';
import {cgidata,cgi_url} from '@/pages/cgidata'
import { message } from 'antd';
//import {fromJS} from 'immutable';

export const setLanData = (result)=>({
    type:ACTIONTYPE.LAN_MSG,
    ipaddr:result.ipaddr,
    netmask:result.netmask
})

export const setRedirIp = (locktime,redir_ip)=>({
    type:ACTIONTYPE.LAN_SHOW_PROGRESS,
    showProgress:true,
    locktime,
    redir_ip,
})



export const getLanmsg =()=>{    
    let data ={...cgidata.cgidata19};      
    return (dispatch)=>{        
        axios.post(cgi_url, {
            ...data
        })
        .then(function (response) {
            //改变store里面的值
            if(response.data.restcode === 2000){
                dispatch(setLanData(response.data.result))
            }
            else{                
                console.log('未知错误！');
            }
        })
        .catch(function (error) {
            console.log(error);
            //alert('数据请求失败！')
            //dispatch(setWanmsg('[{}]'));
        });
    }
}


export const setLanmsg =(values)=>{    
    let data ={...cgidata.cgidata20,...values};     
    return (dispatch)=>{        
        axios.post(cgi_url, {
            ...data
        })
        .then(function (response) {
            //改变store里面的值
            if(response.data.restcode === 2000){
                if(response.data.locktime!=0 && response.data.redir==true ){
                    dispatch(setRedirIp(response.data.locktime,response.data.redir_ip))
              }else if(response.data.locktime==0){
                  message.success('设置成功')
              }
            }
            else{
                console.log('未知错误！');
            }
        })
        .catch(function (error) {
            console.log(error);
            //alert('数据请求失败！')
            //dispatch(setWanmsg('[{}]'));
        });
    }
}

