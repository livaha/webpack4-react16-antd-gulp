
import React from 'react';
import { Select,Switch,Input,Form, Card,Button, message } from 'antd';
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
const { Option } = Select;

export default class DDNS extends React.Component{ 
  state={    
		ddns_enable:	false,
		provider:	"3322.org",
		domain_name:	"19901002yun.f3322.org",
		username:	"yun19901002",
		password:	"43291717yun",
		ddns_ip:	"192.168.5.112",
    ddns_state:	1,
    ddns_register:"http://www.pubyun.com/accounts/signup/"
  }      
  handleSwitchChange=(checked)=>{
    this.setState({
      ddns_enable:checked
    })
    if(this.state.ddns_enable_src==true){
      let {provider,domain_name,username,password,ddns_ip,ddns_state} = this.state
      let data = {ddns_enable:checked,provider,domain_name,username,password,ddns_ip,ddns_state}
      this.setDdnsConfig(data)
    }
  }


  componentDidMount(){
    this.getDdnsConfig()
  }


  getDdnsConfig=()=>{    
    let values ={...cgidata.cgidata84};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){     
            let {ddns_enable,provider,domain_name,username,password,ddns_ip,ddns_state} = res.result
            this.setState({
              ddns_enable,provider,domain_name,username,password,ddns_ip,ddns_state,ddns_enable_src:ddns_enable           
            })
          }
      })
  }

  setDdnsConfig=(values)=>{    
    let data ={...cgidata.cgidata85,...values};      
      axios.ajax_post({
        data:data
      }).then((res)=>{
          if(res.restcode == 2000){     
            message.success('设置成功！')
          }
      }).then((res)=>{        
        this.getDdnsConfig()
      })
  }

  handleSetDdnsConfig=()=>{
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({          
		      provider:	values.provider,
		      domain_name:values.domain_name,
		      username:values.username,
		      password:values.password
        })
        let data ={...values,ddns_enable:this.state.ddns_enable};    
        this.setDdnsConfig(data)
      }else{
      }
    });   
  }
  changeProvider=(value)=>{
    if(value=="3322.org"){
      this.setState({ddns_register:'http://www.pubyun.com/accounts/signup/'})
    }
    else if(value=="oray.com"){      
      this.setState({ddns_register:'https://console.oray.com/passport/register.html'})
    }
    else if(value=="dyndns.org"){      
      this.setState({ddns_register:'https://dyn.com/dns/'})
    }
    else if(value=="no-ip.com"){      
      this.setState({ddns_register:'https://www.no-ip.com/newUser.php/'})
    }
  }

  render() {   
    const { getFieldDecorator }  =this.props.form;
    return (
          <Card title="DDNS设置">
          <Form>
            <Form.Item {...formItemLayout} label="DDNS设置">
          
            <Switch 
                style={{marginBottom:20}}
                checkedChildren="开" 
                unCheckedChildren="关" 
                defaultChecked
                checked={this.state.ddns_enable}
                onChange={this.handleSwitchChange}
            />
            </Form.Item>

            {
              this.state.ddns_enable==false?null:
              <div>

                <Form.Item {...formItemLayout} label="服务商">
                      {getFieldDecorator('provider', {
                          initialValue:this.state.provider
                      })(
                        <Select /*defaultValue={1} */ onChange={this.changeProvider} >
                          <Option value="3322.org">www.3322.org</Option>
                          <Option value="oray.com">www.oray.com</Option>
                          <Option value="dyndns.org">dyndns</Option>
                          <Option value="no-ip.com">no-ip</Option>
                        </Select>      
                      )}
                      <a href={this.state.ddns_register} target="_blank">去注册</a>
                </Form.Item>
                <Form.Item {...formItemLayout} label="域名">
                {getFieldDecorator('domain_name', {
                    rules: [
                        { required: true, message: '请输入域名!' },
                        {                             
                          pattern:new RegExp('^(.{1,50})$'),
                          message:'域名长度不能超过50！'
                    }],
                    initialValue:this.state.domain_name
                })(
                    <Input/>
                )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="用户名">
                {getFieldDecorator('username', {
                    rules: [
                        { required: true, message: '请输入用户名!' },
                        {                             
                          pattern:new RegExp('^(.{1,50})$'),
                          message:'用户名长度不能超过50！'
                    }],
                    initialValue:this.state.username
                })(
                    <Input/>
                )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="密码">
                {getFieldDecorator('password', {
                    rules: [
                        { required: true, message: '请输入密码!' },
                        {                             
                          pattern:new RegExp('^(.{1,50})$'),
                          message:'密码长度不能超过50！'
                    }],
                    initialValue:this.state.password
                })(
                    <Input.Password/>
                )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="DDNS连接状态">
                  <span>{this.state.ddns_state==0?"DDNS未连接":
                this.state.ddns_state==1?"DDNS连接成功":"DDNS连接失败"}</span>
                </Form.Item>
                <Form.Item {...formItemLayout} label="DDNS连接信息">
                  <span>域名绑定的IP是{this.state.ddns_ip!=""?this.state.ddns_ip:"0.0.0.0"}</span>
                </Form.Item>
                <Form.Item {...tailFormItemLayout} >
                    <Button type="primary" onClick={this.handleSetDdnsConfig}>应用</Button>
                </Form.Item>
                  </div>
            }
            </Form>
          </Card>
    )
  }
}

DDNS = Form.create({})(DDNS);