import React from 'react';
import moment from 'moment'; 
import { Modal,message} from 'antd';
const confirm = Modal.confirm;
//{moment(Time).format("YYYY-MM-DD HH:mm:ss")}
/***
 * setTimeout(function, time)，延时一段时间后执行function，只执行一次；
setInterval(function, time)，以time为时间间隔，反复执行function。
function是函数, time以毫秒为单位, 1000毫秒=1秒。
clearInterval(funtion),  取消setInterval中对函数的重复运行设置。

示例：
  componentDidMount() {
    let opacity = this.state.opacity;
    this.timeout = setTimeout(() => {
      this.timeInterval = setInterval(() => {
        opacity -= 0.02;
        if (opacity <= 0) {
          this.setState({ opacity: 0 });
          clearInterval(this.timeInterval);
        } else this.setState({ opacity });
      }, 50);
    }, 1500);
  }
 */

//   /*定时显示时钟 formateDate（参数=时间戳）*/
//   setInterval(()=>{
//       let sysTime = formateDate(new Date().getTime());
//       this.setState({
//           sysTime
//       })
//       
//   },1000)

//   setTimeout(() => {
//       this.setState({
//         visible: false,
//         confirmLoading: false,
//       });
//   }, 2000);

/**只截取'://'后面的内容， 如果最后字符是'/’，则去掉最后的字符 */
export function domainName(url){  
    var sign = "://";  
    var pos = url.indexOf(sign);  
    //如果以协议名开头  
    //如：http://github.com/  
    if(pos >= 0){  
        pos += sign.length;  
        //截取协议名以后的部分  
        //github.com/  
        url = url.slice(pos);
        if(url === "")
            return false
        return url
    }  
    else return false
    /*
    //如果是以3W开头，返回第二部分  
    var array = url.split(".");  
    if(array[0] === "www"){  
        return array[1];  
    }  
    //如果不是以3W开头，则返回第一部分  
    return array[0];  */
}  

/**URL编码解码decode */
export function parseQueryString(url) {    
    //console.log(encodeURIComponent(url))  编码
    //console.log(decodeURIComponent(url))  解码
    url = decodeURIComponent(url)
    var obj = {};
    var keyvalue = [];
    var key = "",
        value = "";
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    for (var i in paraString) {
        keyvalue = paraString[i].split("=");
        key = keyvalue[0];
        value = keyvalue[1];
        obj[key] = value;
    }
    //console.log(obj)
    return obj;
  }

  
/**当前系统时间转换 参数传入时间戳*/
export function dayToFormatTime(time_of_day){
    return moment(new Date(time_of_day*1000)).format('YYYY-MM-DD HH:mm:ss')
}
/**运行时间转换 参数传入秒*/
export function secondsToFormatTime(seconds){
    let text = parseInt(seconds);
    let secondTime = parseInt(seconds);// 秒
    let minuteTime = 0;// 分
    let hourTime = 0;// 小时
    let dayTime = 0;// 天
    if(text<60){
      if(text==0)
        return <span >--:--</span>
      return <span >{secondTime}秒</span>
    }
    else if(text > 60 && text < 3600){//如果秒数大于1分钟，小于1小时，
      minuteTime = parseInt(text / 60);
      secondTime = parseInt(text % 60);
      return <span >{minuteTime}分{secondTime}秒</span>
    }
    else if(text > 3600 && text < 3600*24){//如果秒数大于1小时，小于1天
      secondTime = parseInt(text % 60)
      minuteTime = parseInt(text / 60);
      hourTime = parseInt(minuteTime / 60);
      minuteTime = parseInt(minuteTime %60);            
      return <span >{hourTime}时{minuteTime}分{secondTime}秒</span>
    }
    else{//天
      secondTime = parseInt(text % 60)
      minuteTime = parseInt(text / 60);
      hourTime = parseInt(minuteTime / 60);
      minuteTime = parseInt(minuteTime %60);
      dayTime = parseInt(hourTime / 24);
      hourTime = parseInt(hourTime % 24);
      return <span >{dayTime}天{hourTime}时{minuteTime}分{secondTime}秒</span>
    }
  }
    export function formateDate(time){
        if(!time) return '';
        let date = new Date(time);
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    }

    export function momentTime(Time){
        //console.log('Time',Time)
        return moment(Time).format("YYYY-MM-DD HH:mm:ss")
    }

    /**计算流量 B K M G  参数传递总流量Bytes*/    
    export function totalTrafficByte(value){
        if(value<1024){
            return `${value}Byte`
        }else if(value < (1024*1024)){
            let tem = Math.ceil(value/1024)
            return `${tem}KByte`
        }else if(value < (1024*1024*1024)){
            let tem = Math.ceil(value/1024/1024)
            return `${tem}MByte`
        }else if(value < (1024*1024*1024*1024)){
            let tem = Math.ceil(value/1024/1024/1024)
            return `${tem}GByte`
        }

    }
    /**计算速率 bps Kbps Mbps Gbps 参数传递速率bps*/ 
    export function totalTrafficbps(value){
        if(value<1024){
            return `${value}bps`
        }else if(value < (1024*1024)){
            let tem = Math.ceil(value/1024)
            //let tem = parseFloat(value/1024).toFixed(2)
            return `${tem}Kbps`
        }else if(value < (1024*1024*1024)){
            let tem = Math.ceil(value/1024/1024)
            return `${tem}Mbps`
        }else if(value < (1024*1024*1024*1024)){
            let tem = Math.ceil(value/1024/1024/1024)
            return `${tem}Gbps`
        }
    }
    
    /**判断是否已经存在此IP段     */
    export function ipRangeisExist(arr,startip,endip){
        let intstartip = ipToNumber(startip)
        let intendip = ipToNumber(endip)
        let flag = true;
        if(intstartip>intendip){            
            message.error("起始IP不能大于结束IP")
            return false
        }
        if(arr==''){
            return true
        }else{
            let i = 0
            for(i=0;i<arr.length;i++){                
                let itemstartip = ipToNumber(arr[i].start_ip)
                let itemendip = ipToNumber(arr[i].end_ip)
                
                if((intstartip>=itemstartip&&intstartip<=itemendip)||
                    (intendip>=itemstartip&&intendip<=itemendip) ||
                    /**输入的IP范围比那现有的大 */
                    (intstartip<=itemstartip && intendip>=itemendip)) {
                        message.error("已存在此IP段！")
                        return false;  //返回只是跳出循环
                }
                return true
            }
            //arr.forEach(function(item){
            //    let itemstartip = ipToNumber(item.start_ip)
            //    let itemendip = ipToNumber(item.end_ip)
            //    if((intstartip>=itemstartip&&intstartip<=itemendip)||
            //        (intendip>=itemstartip&&intendip<=itemendip) ||
            //        /**输入的IP范围比那现有的大 */
            //        (intstartip<=itemstartip && intendip>=itemendip)) {
            //            message.error("已存在此IP段！")
            //            flag = false
            //            return false;  //返回只是跳出循环
            //    }
            //})
            return true
        }
    }

    export function ipPoolRange(minip,maxip,startip,endip) {
        let intminip = ipToNumber(minip)
        let intmaxip = ipToNumber(maxip)
        let intstartip = ipToNumber(startip)
        let intendip = ipToNumber(endip)
        if(!minip || !maxip || !startip || !endip){
            message.error('获取数据错误：minip/maxip不正确！')
            return false
        }
        if(intstartip>intendip){
            
            message.error("起始IP不能大于结束IP")
            return false
        }
        if(intminip<=intstartip &&
            intstartip<=intendip &&
            intendip<=intmaxip  ){
                return true
        }
        else{
            message.error(`IP范围只能为${minip+1}-${maxip-1}`)
            return false
        }

    }
    export function ipToNumber(ip) {
        var num = 0;
        if(ip == "") {
            return num;
        }    
        var aNum = ip.split("."); 
        if(aNum.length != 4) {
            return num;
        }   
        num += parseInt(aNum[0]) << 24;
        num += parseInt(aNum[1]) << 16;
        num += parseInt(aNum[2]) << 8;
        num += parseInt(aNum[3]) << 0;
        num = num >>> 0;//这个很关键，不然可能会出现负数的情况
        return num;  
    }    

    export function confirmToApply(dofunction) {
        confirm({
        title: `是否要应用？`,
        content: '注意：点击确定后，系统将进行设置！',
        okText:'确定',
        cancelText:'取消',
        onOk:()=> {
            dofunction()
        },
        onCancel() {},
        });
    }
    
    export function showConfirm(title,dofunction) {
        confirm({
        title: `是否确定要${title}?`,
        content: '注意：点击确定后，系统将会重启！',
        okText:'确定',
        cancelText:'取消',
        onOk:()=> {
            dofunction()
        },
        onCancel() {},
        });
    }
    
    export function countDown_toLogin(secondsToGo,reload){
        let totaltime = secondsToGo;
        let currenttime = secondsToGo;
        const timer = setInterval(() => {
            currenttime -= 1;
            this.setState({
            secondsToGo:currenttime,
            percent:parseInt((totaltime-currenttime)/totaltime*100)
            })
            }, 1000);
            setTimeout(() => {
                if(reload==true){             
                    /**跳转到系统状态页面 */
                    window.location.hash="#/status"
                }
                else{
                    sessionStorage.clear() //清除本地存储，跳转到登陆页
                    window.location.reload(true);
                    //window.location.hash="#/login";//定时时间到后刷新到登陆页面
                }
            clearInterval(timer);
            }, currenttime * 1000);
    }
  
    export function countDown_toIp(secondsToGo,redirIp=""){
        let totaltime = secondsToGo;
        let currenttime = secondsToGo;
        const timer = setInterval(() => {
            currenttime -= 1;
            this.setState({
            secondsToGo:currenttime,
            percent:parseInt((totaltime-currenttime)/totaltime*100)
            })
            }, 1000);
            setTimeout(() => {      
                if(redirIp!=""){       
                    sessionStorage.clear()              
                    window.location.href='http://'+redirIp+'#/login';//定时时间到后刷新页面，应该是退出后刷新到登陆页面
                }
                else{                    
                    window.location.reload(true);
                    //window.location.hash="#/login";//定时时间到后刷新到登陆页面
                }
            clearInterval(timer);
            }, currenttime * 1000);
    }
    
    export function countDown_toLoading(secondsToGo,redirIp=""){
        
        /*加载Loading  -- isShowLoading=true时加载 */
        let loading;
        loading = document.getElementById('ajaxLoading');
        loading.style.display = 'block';

        const timer = setInterval(() => {
            secondsToGo -= 1;            
            }, 1000);
            setTimeout(() => {
                
                /*消除Loading*/
                loading = document.getElementById('ajaxLoading');
                loading.style.display = 'none';

                if(redirIp!=""){                    
                    sessionStorage.clear() 
                    window.location.href='http://'+redirIp+'#/login';//定时时间到后刷新页面，应该是退出后刷新到登陆页面
                }
                else{                    
                    window.location.reload(true);
                    //window.location.hash="#/login";//定时时间到后刷新到登陆页面
                }
            clearInterval(timer);
            }, secondsToGo * 1000);
    }
export default {}