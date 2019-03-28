
import React from 'react';
import { Card,Form,Input,Button,Spin,message,Col } from 'antd';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'

const { TextArea } = Input;

class Ping extends React.Component{    
  state={
    stopping:false,    
		//ping_detct:	0,//检测状态：0 未检测，1 正在检测 ，2 检测完成
		action_result:	""
  }
  componentDidMount(){
    this.getResultStatus()
  }
//这是先取结果 ，5s后再定时取结果的
//  /**返回promise函数先获取ping_detct值 */
//  test=()=>{
//    return new Promise(function (resolve, reject) {
//    let values ={...cgidata.cgidata61};  
//      resolve(
//        axios.ajax_post({
//          data:values
//        }))
//    })
//  }
//  /**递归 */
//  getResultStatus=()=>{
//    this.test().then(res=>{
//      console.log(res)
//      if(res.result.ping_detct==1){        
//        clearInterval(this.timeInterval);
//        this.timeInterval = setInterval(() => {
//          this.getResultStatus()          
//          console.log(this.state.action_result)
//          this.setState({
//            action_result:res.result.action_result
//          })          
//        }, 5000);
//      }
//      else if(res.result.ping_detct==2 ||res.result.ping_detct==0){
//        clearInterval(this.timeInterval);
//        console.log(this.state.action_result)
//        this.setState({
//          action_result:res.result.action_result,          
//          stopping:false
//        })
//      }
//    })
//  }
//  

  /**这是取结果的，里面置有定时器 */
  getResultStatus=()=>{    
    let data ={...cgidata.cgidata61};  
    axios.ajax_post({
      data
    }).then((res)=>{
        if(res.restcode == 2000){       
          if(res.result.ping_detct==1){        
            clearInterval(this.timeInterval);
            this.setState({        
              stopping:true,
              action_result:res.result.action_result
            })          
            this.timeInterval = setInterval(() => {
              this.getResultStatus()          
              //console.log(this.state.action_result)
              this.setState({
                action_result:res.result.action_result
              })          
            }, 5000);
          }
          else if(res.result.ping_detct==2 ||res.result.ping_detct==0){
            clearInterval(this.timeInterval);
            //console.log(this.state.action_result)
            this.setState({
              action_result:res.result.action_result,          
              stopping:false
            })
          }           
        }
    })

  }

  handleStartPing=()=>{
    this.props.form.validateFields((err,values)=>{      
      if (!err) { 
        this.setState({
          stopping:true,
          action_result:	""
        })
        //console.log('Received values of form: ', values);
        let data ={...cgidata.cgidata62,...values}
        axios.ajax_post({
          data
        }).then((res)=>{
            if(res.restcode == 2000){       
              //message.success('设置成功！')              
            }
        }).then((res)=>{          
            setTimeout(() => {
              this.getResultStatus()
            }, 5000);
          
        })
      }
    })
  }

  handleStopPing=()=>{
    this.setState({
      stopping:false
    })
    
    let values ={...cgidata.cgidata63};     
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){       
          //message.success('设置成功！')              
        }
    })    
  }

  render() {   
    const { getFieldDecorator } = this.props.form;
    let {stopping} = this.state
    return (
          <Card title="ping测试">
            
            <Form>
                  <Form.Item {...formItemLayout} label="IP地址或域名">
                  {getFieldDecorator('dest_host', {
                      rules: [
                          { required: true, message: 'IP地址或域名不能为空!' },
                          {                             
                            pattern:new RegExp('^.{0,64}$'),
                            message:'单个域名长度不能超过64个字符！'
                       }],
                      initialValue:''
                  })(
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="指定源地址Ping">
                  {getFieldDecorator('start_host', {
                      rules: [
                          {                             
                            pattern:new RegExp('^.{0,64}$'),
                            message:'单个域名长度不能超过64个字符！'
                       }],
                          initialValue:''
                  })(                        
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="Ping包次数">
                  {getFieldDecorator('ping_counter', {
                      rules: [
                          { required: true, message: 'Ping包次数不能为空!' },
                          {                             
                            pattern:new RegExp('^([1-9]|\\d\\d|100)$'),
                            message:'Ping包次数只能为1-100！'
                       }],
                      initialValue:'10'
                  })(
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...tailFormItemLayout}>
                  {
                    stopping==false?
                    <Button type="primary" onClick={this.handleStartPing} >
                        开始检测
                    </Button>
                  :
                  <div>
                    <Button type="primary" style={{backgroundColor:'red',borderColor:'red',color: '#fff',marginRight:20}} 
                    onClick={this.handleStopPing} >
                        停止检测
                    </Button>
                    <Spin />

                  </div>
                  }
                  </Form.Item>
                  <Col span={5}></Col>
                  <Col span={14}>                  
                    <TextArea 
                      placeholder="本文本框显示ping检测结果！"
                      value = {this.state.action_result}
                      autosize={{ minRows: 12, maxRows: 22 }} 
                    />
                  </Col>
                  <Col span={5}></Col>
              </Form>
          </Card>
    )
  }
}

export default Form.create()(Ping)