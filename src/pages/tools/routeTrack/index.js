
import React from 'react';
import { Card,Form,Input,Button,Spin,Col } from 'antd';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'

const { TextArea } = Input;

class RouteTrack extends React.Component{    
 
  state={
    stopping:false,
		action_result:	""
  }
  componentDidMount(){
    this.getResultStatus()
  }
  
  /**这是取结果的，里面置有定时器 */
  getResultStatus=()=>{    
    let data ={...cgidata.cgidata64};  
    axios.ajax_post({
      data
    }).then((res)=>{
        if(res.restcode == 2000){       
          if(res.result.tracert_detect==1){        
            clearInterval(this.timeInterval);
            this.setState({        
              stopping:true,
              action_result:res.result.action_result
            })          
            this.timeInterval = setInterval(() => {
              this.getResultStatus()          
              this.setState({
                action_result:res.result.action_result
              })          
            }, 5000);
          }
          else if(res.result.tracert_detect==2 ||res.result.tracert_detect==0){
            clearInterval(this.timeInterval);
            this.setState({
              action_result:res.result.action_result,          
              stopping:false
            })
          }           
        }
    })

  }

  handleStartTracert=()=>{
    this.props.form.validateFields((err,values)=>{      
      if (!err) { 
        this.setState({
          stopping:true,
          action_result:	""
        })
        let data ={...cgidata.cgidata65,...values}
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
  
  handleStopTracert=()=>{
    this.setState({
      stopping:false
    })    
    let values ={...cgidata.cgidata66};     
    axios.ajax_post({
      data:values
    })
  }
  render() {   
    const { getFieldDecorator } = this.props.form;
    let {stopping} = this.state
    return (
          <Card title="路由跟踪">
            
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
                  <Form.Item {...formItemLayout} label="最大路由跳数">
                  {getFieldDecorator('max_hops', {
                      rules: [
                        { required: true, message: '最大路由跳数不能为空!' },
                          {                             
                            pattern:new RegExp('^([1-9]|[1]\\d|20)$'),
                            message:'最大路由跳数只能为1-20！'
                       }],
                          initialValue:''
                  })(                        
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="超时等待时间">
                  {getFieldDecorator('time_out', {
                      rules: [
                          { required: true, message: '超时等待时间不能为空!' },
                          {                             
                            pattern:new RegExp('^([1-9]|10)$'),
                            message:'超时等待时间只能为：1–10！'
                       }],
                      initialValue:''
                  })(
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...tailFormItemLayout}>
                  {
                    stopping==false?
                    <Button type="primary" onClick={this.handleStartTracert} >
                        开始检测
                    </Button>
                  :
                  <div>
                    <Button type="primary" style={{backgroundColor:'red',borderColor:'red',color: '#fff',marginRight:20}} 
                    onClick={this.handleStopTracert} >
                        停止检测
                    </Button>
                    <Spin />

                  </div>
                  }
                  </Form.Item>
                  <Col span={5}></Col>
                  <Col span={14}>                  
                    <TextArea 
                      placeholder="本文本框显示路由跟踪结果！"
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

export default Form.create()(RouteTrack)