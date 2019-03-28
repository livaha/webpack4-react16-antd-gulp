import * as ACTIONTYPE from './actionType'
import axios from 'axios';
import {cgidata} from '@/pages/cgidata'
import { Modal } from 'antd';

const changeLogin =(loginState,first_boot)=>({
    type:ACTIONTYPE.CAHNGE_LOGIN,
    loginState,
    first_boot
})

export const logout = ()=>{
    sessionStorage.clear() 
    return {
        type:ACTIONTYPE.LOGOUT,
        value:false
    }
}


export const login = (values)=>{

    let data ={...cgidata.cgidata0,...values};      
    return (dispatch)=>{        
        axios.post('cgi-bin/cgi_vista.cgi', {
            ...data
        })
        .then(function (response) {
            //改变store里面的值
            if(response.data.restcode === 2000){
                //console.log('first_boot',response.data.first_boot)
                dispatch(changeLogin(true,response.data.first_boot))
                sessionStorage.setItem('loginState', '1');
            }
            else if(response.data.restcode === 4001){
                Modal.error({
                    title: '密码错误',
                    content: '请输入正确的密码...',
                  });
            }
            else{                
                Modal.error({
                    title: '未知错误',
                    content: '请检查后台返回的数据是否正确...',
                  });
            }
        })
        .catch(function (error) {
            console.log(error);
            /*alert('登陆失败！')
                Modal.error({
                    title: '登陆--！',
                    content: '测试阶段，需要删掉下一句代码...',
                  });
                dispatch(changeLogin(true,1))*/
        });
        }
}

