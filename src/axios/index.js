import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd'


const post_url = '/cgi-bin/cgi_vista.cgi';

export default class Axios{
    static ajax_post(options){
        let baseApi = '';
        return new Promise((resolve,reject)=>{
            axios({
                baseApi,
                url:post_url,
                method:'post',
                //timeout:5000,
                data: options.data
            }).then((response)=>{
                if(response.status === 200){
                    //let res = response.data;
                    if(response.data.restcode === 2000||response.data.restcode === '2000'){
                        resolve(response.data);
                    }else if(response.data.restcode === 4006||response.data.restcode === '4006'){
                        //debugger
                        Modal.info({
                            title:"提示",
                            content: '权限被禁止/密码错误'
                        })
                    }else if(response.data.restcode === 4008||response.data.restcode === '4008'){
                        //在内部处理错误
                        resolve(response.data);
                    }
                    else{
                        //debugger
                        Modal.info({
                            title:"提示",
                            content:(response.data.errmsg) || '返回数据错误'
                        })
                    }
                }else{
                    reject(response.data);
                }
            }).catch(() => {
                /*Modal.info({
                    title:"提示",
                    content:post_url+'数据请求错误'
                })    */       
                console.log('数据请求错误') 
            })
        })
    }


    /*将第三方插件再封装 */
    static jsonp(options){
        return new Promise((resolve,reject)=>{
            JsonP(options.url,{
                /*跨域接收，参数为callback */
                param:'callback'
            },function(err,response){
                //debugger;
                if(response.status === 'success'){
                    resolve(response);
                }
                else{
                    reject(response.message);
                }
            })
        })
    }

    static ajax_get(options){
        /*加载Loading  -- isShowLoading=true时加载 */
        let loading;
        if(options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }
        let baseApi = 'https://easy-mock.com/mock/5c3b1896d3b9046e1aedbe56/api';
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:'get',
                baseURL:baseApi,
                timeout:5000,
                params:(options.data && options.data.params) || ''
            }).then((response)=>{
                /*消除Loading*/
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if(response.status === '200'){
                    let res = response.data;
                    if(res.restcode === '2000'){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.errmsg || '返回数据错误'
                        })
                    }
                }else{
                    reject(response);
                }
            })
        })
    }

    
    static ajax_post_loading(options){
        /*加载Loading  -- isShowLoading=true时加载 */
        let loading;
        if(options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }
        let baseApi = '';
        return new Promise((resolve,reject)=>{
            axios({
                url:post_url,
                method:'post',
                baseURL:baseApi,
                timeout:5000,
                data: options.data
            }).then((response)=>{
                /*消除Loading*/
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if(response.status === '200'){
                    let res = response.data;
                    if(res.restcode === '2000'){
                        resolve(res);
                    }else if(res.restcode === '4006'){
                        //debugger
                        Modal.info({
                            title:"提示",
                            content: '权限被禁止/密码错误'
                        })
                    }else if(res.restcode === '4008'){
                        //在内部处理错误
                        resolve(res);
                    }
                    else{
                        //debugger
                        Modal.info({
                            title:"提示",
                            content:(res.errmsg) || '返回数据错误'
                        })
                    }
                }else{
                    reject(response);
                }
            }).catch(() => {
                /*消除Loading*/
                if (loading) {
                    loading.style.display = 'none';
                }
                Modal.info({
                    title:"提示",
                    content:post_url+'数据请求错误'
                })
            
            })
        })
    }
}