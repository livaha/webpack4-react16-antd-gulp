
import React, { PureComponent } from 'react';
import {  Button } from 'antd';
import {cgidata} from '@/pages/cgidata'
import axios from '@/axios';
import {parseQueryString} from '@/utils/utils'

const bg = {  
  position:'fixed',
  top:'0px',
  left:'0px',
  right:'0px',
  bottom:'0px',
  height:'100%',
  width:'100%',
  color: 'red',
  background: `url("/assets/bg.png")`,
  backgroundSize:'100% 100%',
}
const content = {
  marginTop:'25%',
  textAlign:'center'

}

export default class Example extends PureComponent {
  handleOnNet=()=>{
    let obj = parseQueryString(window.location.href)
    if(obj!=undefined){
      this.sendMacToOnNet(obj.mac,obj.url)
    }
  }
  sendMacToOnNet=(mac,url)=>{
    let data ={...cgidata.cgidata105,mac};  
    axios.ajax_post({
      data:data
    }).then((res)=>{
        if(res.restcode == 2000){
          window.location.href=url
        }
    })                  
  }
  render() {
    return (
      <div style={bg}>
        <div style={content}>
          
          <Button onClick={this.handleOnNet} style={{width:180}}>点击上网</Button>
        </div>
                        
      </div>)
  }
}

/**
 * .background-img{
    position:fixed;
    top:0px;
    left:0px;
    right:0px;
    bottom:0px;
    height:100%;
    width:100%;
    color: red;
    background: url("/assets/1.jpg");
    background-size:100% 100%;

}
 */