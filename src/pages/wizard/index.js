
import React, { PureComponent } from 'react';
import Header from '@/components/Header';
import { Select,Switch,Input,Form, Card,Button,Spin, Modal, Progress, Icon ,Divider, message,Checkbox } from 'antd';
import {countDown_toLogin} from '@/utils/utils'
import {formItemLayout} from '@/config/input_layout'
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import './index.less'
// <img src="/assets/wizard.jpg" style={{position:"fixed"}} alt="totolink logo"/>
const Option = Select.Option;
export default class Example extends PureComponent {
  state={
    ssid2to1Enable:false,
    secondsToGo:"",
    percent:0,
    loading:false,
    step1 : true,
    ssid_config:	{
			"wid":	"1",
			"gid":	"1",
			"ssid_2g":	"default_5G",
			"hide_2g":	"0",
			"isolate_2g":	"0",
			"encry_2g":	"0",
			"passphrase_2g":	"",
			"maxsta_2g":	"32",
			"vlanid_2g":	"0",
			"ssid_5g":	"default_5G",
			"hide_5g":	"0",
			"isolate_5g":	"0",
			"encry_5g":	"0",
			"passphrase_5g":	"",
			"maxsta_5g":	"32",
			"vlanid_5g":	"0"
    },
    wanmsg:{/**默认写了DHCP的数据，它里面的字段会随着wan_proto的改变而改变 */      
      hostname:	"Vista",
    },
		link:	0,
		speed:	1000,
		proto:	"dhcp",
    hostname:	"Vista",
    wan_proto:2,//重新检测wan口类型
  }

  
  componentDidMount(){    
    this.getQuickSettingConfig()
    
    this.checkedSsidEnable(this.state.ssid_config)
  }
  /**获取快速设置配置 */
  getQuickSettingConfig=()=>{

    let data ={...cgidata.cgidata86};      
      axios.ajax_post({
        data:data
      }).then((res)=>{
        if(res.restcode == 2000){ 
          this.checkedSsidEnable(res.result.ssid_config)
          let wanmsg={}
          let wan_proto
          if(res.result.wan_proto ==  0){
            wanmsg = {              
              ipaddr:res.result.ipaddr,
              netmask:res.result.netmask,
              gateway:res.result.gateway,
              dns:res.result.dns,
            }
          }
          if(res.result.wan_proto ==  1){
            wanmsg = {
              username:res.result.username,
              password:res.result.password,
              ac:res.result.ac,
              service:res.result.service,
            }
          }
          if(res.result.wan_proto ==  2){
            wanmsg = {hostname:res.result.hostname}
          }
          if(res.result.link == 0 ){     
            wan_proto=2
          }else{
            wan_proto=res.result.wan_proto
          }
          this.setState({
            ssid_config:res.result.ssid_config,
            link:	res.result.link,
            speed:	res.result.speed,
            wan_proto,
            proto:	res.result.proto,
            //hostname:	res.result.hostname,
            wanmsg:wanmsg
          })
        }
      })
  }
  /**重新检测wan口类型 */
  doWanProtoDetect=()=>{
    this.setState({loading:true})
    let data ={...cgidata.cgidata87};      
      axios.ajax_post({
        data:data
      }).then((res)=>{
        if(res.restcode == 2000){           
          let wan_proto
          if(res.result.link == 0 ){     
            wan_proto=2
          }else{
            wan_proto=res.result.wan_proto
          }
         this.setState({
           wan_proto,
           link:res.result.link,
           speed:res.result.speed,
           loading:false
          })
        }
      })
  }
  /**快速设置配置 */
  setQuickSettingConfig=(ssid_config)=>{
    let wanmsg  = this.state.wanmsg
    let proto = this.state.wan_proto=="0"?"static":this.state.wan_proto=="1"?"pppoe":"dhcp"
    let data ={...cgidata.cgidata88,...ssid_config,...wanmsg,proto};   

    axios.ajax_post({
      data:data
    }).then((res)=>{
      if(res.restcode == 2000){ 
        //message.success('设置成功')
        
        this.setState({
          secondsToGo:res.locktime,
          visible:true
        })
        countDown_toLogin.bind(this)(res.locktime,true);
      }
    })
  }
  
  changeWanType=(value)=>{
    this.setState({wan_proto:value})
  }
  handleNextStep=()=>{
    /**保存数据 */
    //TODO
    let errflag = true;
    this.stepOneRef.props.form.validateFields((err, values) => {
      if (!err) {
        errflag = false
        
        if(values.dns1 || values.dns2){
          let dns = [values.dns1,values.dns2]
          delete values.dns1;
          delete values.dns2;
          values = {...values,dns}
        }
        this.setState({wanmsg:values,step1:false})

      }else{
        errflag = true
      }
    })
    if(errflag) return false;

    //this.setState({step1:false})
  }
  handleLastStep=()=>{
    this.setState({step1:true})
  }
  
  handleFinish=()=>{
    this.handleSetSSIDmsg(this.state.ssid_config)
    /**保存数据 并发送数据 */
    //TODO

    
  }
  handleToHome=()=>{
    window.location.hash="#/status"
  }
  handleSetSSIDmsg=(ssid_config)=>{      
    this.ssidSettingForm.props.form.validateFields((err, values) => {
      if (!err) {
        if(this.state.ssid2to1Enable){
          ssid_config.maxsta_2g = values.maxsta_2g
          ssid_config.maxsta_5g = values.maxsta_2g
          ssid_config.passphrase_2g = ssid_config.encry_2g=="0"?"":values.passphrase_2g
          ssid_config.passphrase_5g = ssid_config.encry_2g=="0"?"":values.passphrase_2g
          ssid_config.ssid_2g = values.ssid_2g
          ssid_config.ssid_5g = values.ssid_2g
          
          ssid_config.hide_5g = ssid_config.hide_2g
          ssid_config.isolate_5g = ssid_config.isolate_2g
          ssid_config.encry_5g = ssid_config.encry_2g
        }
        else{
          ssid_config.maxsta_2g = values.maxsta_2g
          ssid_config.maxsta_5g = values.maxsta_5g
          ssid_config.passphrase_2g = ssid_config.encry_2g=="0"?"":values.passphrase_2g
          ssid_config.passphrase_5g = ssid_config.encry_5g=="0"?"":values.passphrase_5g
          ssid_config.ssid_2g = values.ssid_2g
          ssid_config.ssid_5g = values.ssid_5g
        }
      }
      else{
        return false
      }
    });   
    this.setQuickSettingConfig(ssid_config)
  }
  
  changeSsid2to1Enable=(value)=>{
    /**value可以是true,false */
    this.setState({ssid2to1Enable:value})
  }
  checkedSsidEnable=(ssid_config)=>{
      if(/*this.state.ssid2to1Enable == false &&*/
        ssid_config.ssid_2g == ssid_config.ssid_5g &&
        ssid_config.hide_2g == ssid_config.hide_5g &&
        ssid_config.isolate_2g == ssid_config.isolate_5g &&
        ssid_config.encry_2g == ssid_config.encry_5g &&
        ssid_config.passphrase_2g == ssid_config.passphrase_5g &&
        ssid_config.maxsta_2g == ssid_config.maxsta_5g 
        ){
          this.setState({
            ssid2to1Enable:true
          })
        }else{
          this.setState({
            ssid2to1Enable:false
          })
        }
  }
  setSsidConfig=(ssid_config)=>{
    this.setState({ssid_config})
  }
  render() {
    const {step1} = this.state
    return (
      <div  className="wizard">
        <div><Header /></div>
        <div className="wizard-content">
        <Spin tip="检测中..." spinning={this.state.loading}>
          <Card bordered={false}>            
            <Divider><h3>设置向导</h3></Divider>
            {
              step1==true?
              <div>                
                <StepOne
                    link={this.state.link}
                    speed={this.state.speed}
                    wan_proto={this.state.wan_proto}
                    loading={this.state.loading}
                    doWanProtoDetect={this.doWanProtoDetect}
                    changeWanType={this.changeWanType}
                    //wanmsg={this.state.wanmsg}
                    wrappedComponentRef={(inst)=>{this.stepOneRef = inst;}}/>

                <div style={{textAlign:"center"}}>
                <Button style={{marginRight:20,marginTop:20,marginBottom:60}}  
                    type="primary"
                    onClick={this.handleToHome}                            
                >跳过</Button>
                <Button style={{marginRight:20}}
                    type="primary"  
                    onClick={this.handleNextStep}                            
                >下一步<Icon type="right" /></Button>
                </div>
              </div>
              :
              <div>                
                  <GroupSSIDSetting
                    ssid2to1Enable={this.state.ssid2to1Enable}
                    changeSsid2to1Enable={this.changeSsid2to1Enable}
                    ssid_config={this.state.ssid_config}
                    setSsidConfig = {this.setSsidConfig}
                    //handleSetSSIDmsg={this.handleSetSSIDmsg.bind(this)}
                    wrappedComponentRef={(inst)=>{this.ssidSettingForm = inst;}}
                    />
                <div style={{textAlign:"center"}}>
                  <Button style={{marginRight:20,marginTop:20,marginBottom:60}} 
                      type="primary" 
                      onClick={this.handleToHome}                            
                  >跳过</Button>
                  <Button style={{marginRight:20}}
                      type="primary"  
                      onClick={this.handleLastStep}                            
                  ><Icon type="left" />上一步</Button>
                  <Button style={{marginRight:20}}
                      type="primary"  
                      onClick={this.handleFinish}                            
                  >完成</Button>
                  </div>
              </div>
            }
          </Card>  
          
      </Spin>
        </div>
        
        <Modal
        style={{marginTop:30}}
        closable={false}
        footer={null}
        visible={this.state.visible}
      >
        <p>设置中，{this.state.secondsToGo}秒后设置完成...</p>
        <Progress  percent={this.state.percent} 
            status="active"
            strokeWidth={10}
        />
      </Modal>
      </div>)
  }
}



class StepOne extends React.Component{
  state={
    link :this.props.link,
    speed:this.props.speed,
    wan_proto:this.props.wan_proto,
    //wanmsg:this.props.wanmsg,
    loading:this.props.loading
  }
  
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.wan_proto !== this.props.wan_proto||
      nextProps.link !== this.props.link||
      nextProps.speed !== this.props.speed||
      nextProps.loading !== this.props.loading) {
      /*if(nextProps.link == 0 ){     
        this.setState({
          wan_proto:2,
          //wanmsg:nextProps.wanmsg,
          link:nextProps.link,
          speed:nextProps.speed,
          loading:nextProps.loading
        })
      }
      else{ */
        this.setState({
          wan_proto:nextProps.wan_proto,
          //wanmsg:nextProps.wanmsg,
          link:nextProps.link,
          speed:nextProps.speed,
          loading:nextProps.loading
        })

     //}
    
    }
  }
  changeWanType=(value)=>{
    this.setState({wan_proto:value})
    this.props.changeWanType(value)
  }
 //doWanProtoDetect=()=>{
 //  this.setState({loading:true})
 //  this.props.doWanProtoDetect()
 //}

  render(){
    const {getFieldDecorator} = this.props.form;
      return (
          <Form>
                  <Form.Item {...formItemLayout} label="网络设置">
                    <div>
                      <Select value={this.state.wan_proto}
                        onChange={this.changeWanType} >
                        <Option value={0}>静态IP</Option>
                        <Option value={1}>PPPOE拨号</Option>
                        <Option value={2}>DHCP</Option>
                      </Select>  
                      {
                        this.state.link==0?
                        <div>
                          <i>WAN口没有接网线</i>                          
                          <Button style={{marginLeft:10}} 
                              type="primary"
                              disabled                           
                          >重新检测</Button>
                          </div>  
                        : 
                        <div>
                          <i>推荐使用方式为：{this.state.wan_proto==0?"静态IP":this.state.wan_proto==1?"PPPOE拨号":"DHCP"} </i>
                          <span>; 速率为{this.state.speed}Mbps</span> <br/>
                                
                          <Button style={{marginLeft:0}} 
                              type="primary"
                              loading={this.props.loading}
                              onClick={this.props.doWanProtoDetect}
                              //onClick={this.doWanProtoDetect}   
                          >重新检测</Button>      
                        </div>        
                      }
                      </div>
                  
                 
                  </Form.Item>
                  {this.state.wan_proto==1?//PPPOE模式
                  <div>
                      <Form.Item {...formItemLayout} label="账号">
                      {
                          getFieldDecorator('username', {
                              rules: [{
                                  required: true, message: '账号不能为空!',
                                }], 
                              initialValue:''//wanmsg.username, 
                          })(
                              <Input />    
                          )
                      }                
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="密码">
                      {
                          getFieldDecorator('password', {
                              rules: [{
                                  required: true, message: '密码不能为空!',
                                }], 
                                initialValue:''//wanmsg.password,                          
                          })(
                              <Input />    
                          )
                      }                
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="AC">
                      {
                          getFieldDecorator('ac', {
                            initialValue:''//wanmsg.ac,                               
                          })(
                              <Input placeholder="AUTO  留空以自动检测"/>
                          )
                      }                
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="服务器">
                      {
                          getFieldDecorator('service', {
                            initialValue:''//wanmsg.service,                                
                          })(
                              <Input placeholder="AUTO 留空以自动检测"/>    
                          )
                      }                
                      </Form.Item>
                  </div>
                  :
                  this.state.wan_proto==2?//DHCP模式
                  <div>                
                      <Form.Item {...formItemLayout} label="主机名">
                      {
                          getFieldDecorator('hostname', {
                            initialValue:''//wanmsg.hostname, 
                          })(
                              <Input />    
                          )
                      }                
                      </Form.Item>
                  </div>
                  ://静态IP模式
                  <div>
                        <Form.Item {...formItemLayout} label="IP地址">
                      {
                          getFieldDecorator('ipaddr', {
                              rules: [{
                                  required: true, message: 'IP地址不能为空!',
                                },{
                                  pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                                  message:'IP地址格式不正确！'
                              }], 
                              initialValue:''//wanmsg.ipaddr,                     
                          })(
                              <Input />    
                          )
                      }          
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="子网掩码">
                      {
                          getFieldDecorator('netmask', {
                              rules: [{
                                  required: true, message: '子网掩码不能为空!',
                                },
                                {
                                  pattern:new RegExp('^(254|252|248|240|224|192|128|0)\\.0\\.0\\.0$|^(255\\.(254|252|248|240|224|192|128|0)\\.0\\.0)$|^(255\\.255\\.(254|252|248|240|224|192|128|0)\\.0)$|^(255\\.255\\.255\\.(254|252|248|240|224|192|128|0))$'),
                                  message:'子网掩码格式不正确！'
                              }], 
                              initialValue:''//wanmsg.netmask,                          
                          })(
                              <Input />    
                          )
                      }                
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="默认网关">
                      {
                          getFieldDecorator('gateway', {
                              rules: [{
                                  required: true, message: '默认网关不能为空!',
                                },{
                                  pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                                  message:'网关地址格式不正确！'
                              }], 
                              initialValue:''//wanmsg.gateway,                          
                          })(
                              <Input />    
                          )
                      }                
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="首选DNS">
                      {
                          getFieldDecorator('dns1', {
                              rules: [{
                                  required: true, message: '首选DNS不能为空!',
                                },{
                                  pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                                  message:'DNS格式不正确！'
                              }], 
                              initialValue:''//wanmsg.dns,                              
                          })(
                              <Input />    
                          )
                      }                
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="备选DNS">
                      {
                          getFieldDecorator('dns2', {
                              rules: [{
                                  required: true, message: '备选DNS不能为空!',
                                },{
                                  pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                                  message:'DNS格式不正确！'
                              }], 
                              initialValue:''//wanmsg.dns,                             
                          })(
                              <Input />    
                          )
                      }                
                      </Form.Item>
                  </div>
                  }
              </Form>
      )
  }

}

StepOne = Form.create({})(StepOne);


class GroupSSIDSetting extends React.Component{
  state={
    ssid_config:this.props.ssid_config,
    ssid2to1Enable : this.props.ssid2to1Enable
  }


  componentWillReceiveProps(nextProps) {
    
    if (nextProps !== this.props ) {
      if(this.props.ssid_config!=nextProps.ssid_config){
          
        this.setState({
          ssid_config:nextProps.ssid_config,
          ssid2to1Enable:nextProps.ssid2to1Enable
        })
      }
    }
  }
  onChangeHide2g=(value)=>{
    value = value.target.checked
    let ssid_config = this.state.ssid_config
    if(value==true){
      ssid_config.hide_2g = "1"
    }else{        
      ssid_config.hide_2g = "0"
    }
    this.props.setSsidConfig(ssid_config)
    this.setState({
      ssid_config
    })
  }

  handleEncry2g=(value)=>{
    //console.log(value)
    let ssid_config = this.state.ssid_config
    if(value==1){
      ssid_config.encry_2g = "1"
    }else{        
      ssid_config.encry_2g = "0"
    }
    this.props.setSsidConfig(ssid_config)
    this.setState({
      ssid_config
    })
  }

  onChangeIsolate2g=(value)=>{
    value = value.target.checked
    //console.log(value)
    let ssid_config = this.state.ssid_config
    if(value==true){
      ssid_config.isolate_2g = "1"
    }else{        
      ssid_config.isolate_2g = "0"
    }
    this.props.setSsidConfig(ssid_config)
    this.setState({
      ssid_config
    })

  }


  onChangeHide5g=(value)=>{
    value = value.target.checked
    let ssid_config = this.state.ssid_config
    if(value==true){
      ssid_config.hide_5g = "1"
    }else{        
      ssid_config.hide_5g = "0"
    }
    this.props.setSsidConfig(ssid_config)
    this.setState({
      ssid_config
    })
  }

  handleEncry5g=(value)=>{
    //console.log(value)
    let ssid_config = this.state.ssid_config
    if(value==1){
      ssid_config.encry_5g = "1"
    }else{        
      ssid_config.encry_5g = "0"
    }
    this.props.setSsidConfig(ssid_config)
    this.setState({
      ssid_config
    })
  }

  onChangeIsolate5g=(value)=>{
    value = value.target.checked
    //console.log(value)
    let ssid_config = this.state.ssid_config
    if(value==true){
      ssid_config.isolate_5g = "1"
    }else{        
      ssid_config.isolate_5g = "0"
    }
    this.props.setSsidConfig(ssid_config)
    this.setState({
      ssid_config
    })

  }

  handleMultiFrequencyUnify=(value)=>{
    //console.log(value)    
    this.props.changeSsid2to1Enable(value)
    this.setState({
      ssid2to1Enable : value
    })
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const {ssid_config}=this.state
    
    return(
      <div>     
        
        <Form>
            <Form.Item {...formItemLayout} label="多频合一">
              <Switch
                  checkedChildren="开" 
                  unCheckedChildren="关" 
                  checked={this.state.ssid2to1Enable}
                  onChange={this.handleMultiFrequencyUnify}
                />   
            </Form.Item>
            
          {
            this.state.ssid2to1Enable?

            <div>                
                <Form.Item {...formItemLayout} label="SSID">
                {getFieldDecorator('ssid_2g', {    
                    rules: [{ required: true, message: '请输入SSID名称!' }],              
                    initialValue:ssid_config.ssid_2g
                })(
                    <Input />
                )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="隐藏SSID">
                    <Checkbox checked={ssid_config.hide_2g=="0"?false:true} 
                      onChange={this.onChangeHide2g}
                    />
                </Form.Item>
                <Form.Item {...formItemLayout} label="加密方式">
                  <Select value={ssid_config.encry_2g=="0"?"不加密":"加密"} 
                    onChange={this.handleEncry2g}>
                    <Option value="0">不加密</Option>
                    <Option value="1">加密</Option>
                  </Select>      
                </Form.Item>
                {
                  ssid_config.encry_2g=="0"?null:
                  <Form.Item {...formItemLayout} label="密码">
                  {getFieldDecorator('passphrase_2g', {         
                      rules: [{ required: true, message: '请输入密码!' }],             
                      initialValue:ssid_config.passphrase_5g
                  })(
                      <Input.Password placeholder="请输入密码" />
                  )}
                  </Form.Item>
                }
                <Form.Item {...formItemLayout} label="二层隔离">
                    <Checkbox checked={ssid_config.isolate_2g=="0"?false:true} 
                      onChange={this.onChangeIsolate2g} 
                    />
                </Form.Item>
                <Form.Item {...formItemLayout} label="最大用户数">
                {getFieldDecorator('maxsta_2g', {          
                    rules: [
                        { required: true, message: '请输入最大用户数!' },
                        {                             
                          pattern:new RegExp('^(\\d|\\d\\d|[1][0-1]\\d|12[0-8])$'),
                          message:'最大用户数只能为0-128！'
                     }],        
                    initialValue:ssid_config.maxsta_2g  //0-128
                })(
                    <Input />
                )}
                </Form.Item>
            </div>
          :
            <div>
              <Form.Item {...formItemLayout} label="2G SSID">
              {getFieldDecorator('ssid_2g', {         
                  rules: [{ required: true, message: '请输入SSID名称!' }],          
                  initialValue:ssid_config.ssid_2g
              })(
                  <Input />
              )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="2G 隐藏SSID">
                  <Checkbox checked={ssid_config.hide_2g=="0"?false:true} 
                    onChange={this.onChangeHide2g}
                  />
              </Form.Item>
              <Form.Item {...formItemLayout} label="2G 加密方式">
                <Select value={ssid_config.encry_2g=="0"?"不加密":"加密"} 
                  onChange={this.handleEncry2g}>
                  <Option value="0">不加密</Option>
                  <Option value="1">加密</Option>
                </Select>      
              </Form.Item>
              {
                ssid_config.encry_2g=="0"?null:
                <Form.Item {...formItemLayout} label="2G 密码">
                {getFieldDecorator('passphrase_2g', {         
                    rules: [{ required: true, message: '请输入密码!' }],           
                    initialValue:ssid_config.passphrase_5g
                })(
                    <Input.Password placeholder="请输入密码" />
                )}
                </Form.Item>
              }
              <Form.Item {...formItemLayout} label="2G 二层隔离">
                  <Checkbox checked={ssid_config.isolate_2g=="0"?false:true} 
                    onChange={this.onChangeIsolate2g} 
                  />
              </Form.Item>
              <Form.Item {...formItemLayout} label="2G 最大用户数">
              {getFieldDecorator('maxsta_2g', {                  
                  rules: [
                      { required: true, message: '请输入最大用户数!' },
                      {                             
                        pattern:new RegExp('^(\\d|\\d\\d|[1][0-1]\\d|12[0-8])$'),
                        message:'最大用户数只能为0-128！'
                    }],        
                  initialValue:ssid_config.maxsta_2g  //0-128
              })(
                  <Input />
              )}
              </Form.Item>              

              <Form.Item {...formItemLayout} label="5G SSID">
                {getFieldDecorator('ssid_5g', {        
                    rules: [{ required: true, message: '请输入SSID名称!' }],                    
                    initialValue:ssid_config.ssid_5g
                })(
                    <Input />
                )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="5G 隐藏SSID">
                    <Checkbox checked={ssid_config.hide_5g=="0"?false:true} 
                    onChange={this.onChangeHide5g}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="5G 加密方式">
                  <Select defaultValue={ssid_config.encry_5g=="0"?"不加密":"加密"}  
                    onChange={this.handleEncry5g}>
                    <Option value="0">不加密</Option>
                    <Option value="1">加密</Option>
                  </Select>   
                </Form.Item>
                {
                  ssid_config.encry_5g=="0"?null:
                  <Form.Item {...formItemLayout} label="5G 密码">
                  {getFieldDecorator('passphrase_5g', {          
                      rules: [{ required: true, message: '请输入密码!' }],         
                      initialValue:ssid_config.passphrase_5g
                  })(
                      <Input.Password placeholder="请输入密码" />
                  )}
                  </Form.Item>
                }
                <Form.Item {...formItemLayout} label="5G 二层隔离">
                    <Checkbox checked={ssid_config.isolate_5g=="0"?false:true} 
                    onChange={this.onChangeIsolate5g}  />
                </Form.Item>
                <Form.Item {...formItemLayout} label="5G 最大用户数">
                {getFieldDecorator('maxsta_5g', {                 
                    rules: [
                        { required: true, message: '请输入最大用户数!' },
                        {                             
                          pattern:new RegExp('^(\\d|\\d\\d|[1][0-1]\\d|12[0-8])$'),
                          message:'最大用户数只能为0-128！'
                     }],         
                    initialValue:ssid_config.maxsta_5g  //0-128
                })(
                    <Input />
                )}
                </Form.Item>
            </div>
            }
            </Form>

      </div>
    )
  }

}

GroupSSIDSetting = Form.create()(GroupSSIDSetting);

