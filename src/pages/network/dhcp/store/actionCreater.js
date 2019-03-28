import * as ACTIONTYPE  from './actionType';
import axios from 'axios';
import {cgidata,cgi_url} from '@/pages/cgidata'
import { message } from 'antd';
//import {fromJS} from 'immutable';

export const setLanData = (result,dhcpList)=>({
    type:ACTIONTYPE.DHCP_MSG,
    enable:result.enable,
    minip:result.minip,
    maxip:result.maxip,
    startip:result.startip,
    endip:result.endip,
    leasetime:result.leasetime,
    static_dhcp:result.static_dhcp,
    dhcpList

})

export const setArpList = (arpList)=>({
    type:ACTIONTYPE.ARP_LIST,
    arpList

})


export const setSwitch = (checked)=>({
    type:ACTIONTYPE.DHCP_ENABLE,
    enable:checked

})

export const getDhcpmsg =()=>{    
    let data ={...cgidata.cgidata21};      
    return (dispatch)=>{        
        axios.post(cgi_url, {
            ...data
        })
        .then(function (response) {
            //改变store里面的值
            if(response.data.restcode === 2000){
                let dhcpList = response.data.result.static_dhcp.map((item, index) => {
                    item.key = index;
                    return item;
                });
                dispatch(setLanData(response.data.result,dhcpList))
            }
            else{                
                console.log('未知错误！')
            }
        })
        .catch(function (error) {
            console.log(error);
            //alert('数据请求失败！')
            //dispatch(setWanmsg('[{}]'));
        });
    }
}

export const getArpListmsg =()=>{    
    let data ={...cgidata.cgidata23};      
    return (dispatch)=>{        
        axios.post(cgi_url, {
            ...data
        })
        .then(function (response) {
            //console.log(response);
            //改变store里面的值
            if(response.data.restcode === 2000){
                let arpList = response.data.result.arp_list.map((item, index) => {
                    item.key = index;
                    return item;
                });
                dispatch(setArpList(arpList))
            }
            else{                
                console.log('未知错误！')
            }
        })
        .catch(function (error) {
            console.log(error);
            //alert('数据请求失败！')
            //dispatch(setWanmsg('[{}]'));
        });
    }
}

export const handleSetDhcpMsg =(values)=>{    
    let data ={...cgidata.cgidata22,...values};   
    return (dispatch)=>{        
        axios.post(cgi_url, {
            ...data
        })
        .then(function (response) {
            //改变store里面的值
            if(response.data.restcode === 2000){                
                message.success('设置成功');
            }
            else{                
                console.log('未知错误！')
            }
        })
        .catch(function (error) {
            console.log(error);
            //alert('数据请求失败！')
            //dispatch(setWanmsg('[{}]'));
        });
    }
}

