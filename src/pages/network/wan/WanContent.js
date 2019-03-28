import React from 'react';
import { Form, Input, Button, Checkbox,Select,InputNumber } from 'antd';
import axios from '@/axios';
import {confirmToApply} from '@/utils/utils'
import {cgidata} from '@/pages/cgidata'
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'

const { Option } = Select;



/**1 每个页面都应该要点保存，没有点保存的话切换TAB就让它回到原来的模式
 * 2 usb-net没有高级参数
 * 3 高级参数mac：获取到的mac显示为不可修改
 *   点击克隆的时候发送请求获取clonmac，文本框改为可修改状态（实际上也是可修改的）
 *   默认填defmacaddr,点击后填clonmac 并赋值给macaddr，取消复选框后填defmacaddr,修改时为macaddr
 * 4 测试时，wan3为关闭状态
 */
class WanContent extends React.Component{
    state={
        temproto:this.props.wan_content.proto,
        section:this.props.section,
        tabpane:this.props.tabpane,
        wan_content:this.props.wan_content,
        showAdvanced:false,
        cloneCheck:this.props.wan_content.macaddr!==this.props.wan_content.def_macaddr?true:false,
    }
      
    componentWillReceiveProps(nextProps){
        let{ wan_content,showAdvanced,cloneCheck,temproto}= this.state;
        if(this.props!=nextProps){      
            wan_content=nextProps.wan_content;
            if(this.props.tabpane!=nextProps.tabpane){                  
                this.props.form.resetFields();
                showAdvanced=false
            }
            if(nextProps.wan_content.macaddr!==nextProps.wan_content.def_macaddr){
                    cloneCheck=true
            }
            if(this.props.wan_content.proto!==nextProps.wan_content.proto && 
                this.props.tabpane == nextProps.tabpane){
                temproto=nextProps.wan_content.proto
                    this.setState({temproto})
            }
            this.setState({  
                wan_content,                    
                showAdvanced,
                cloneCheck,
            })                
        }
    }
    
    /**获取克隆的MAC地址，只有这组件能用到 */
    getCloneMacInfo=()=>{
        let values ={...cgidata.cgidata16};     
        axios.ajax_post({
          data:values
        }).then((res)=>{
            if(res.restcode == 2000){      
                /**只有点克隆的时候才获取 ，直接将克隆MAC赋值给macaddr */            
                let wan_content = this.state.wan_content;
                wan_content.macaddr = res.result.user_mac;
                this.props.form.resetFields(`macaddr`,[]);//强制清除指定字段输入的数据
                this.setState({
                    wan_content,
                    cloneCheck:true
                    //user_mac:res.result.user_mac,
                })       
            }
        })                  
    }
    
    /**有两个字段  def_macaddr macaddr（相同）
     * 不勾选的时候，MAC地址为只读 --macaddr
     * 勾选的时候，将去获取一个接口"cgid": 16 得到克隆的MAC --user_mac  
     * 此时的MAC地址是可以修改的
     * 当勾选的状态，用户取消勾选时，将def_macaddr赋值给macaddr，同时不可修改
     * */
    handleCloneMac=(e)=>{
        if(e.target.checked === true){
            //克隆mac
            this.getCloneMacInfo()            
        }else{
            /**将defmacaddr赋值给macaddr */            
            let wan_content = this.state.wan_content;
            wan_content.macaddr = wan_content.def_macaddr;
            this.props.form.resetFields(`macaddr`,[]);//强制清除指定字段输入的数据
            this.setState({
                wan_content,
                cloneCheck:false
            })       
        }
    }
    
    handleApplyData=(send)=>{
        confirmToApply(()=>this.handlechangeBaseData(send))
    }

    handlechangeBaseData=(send)=>{
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {section} = this.state
                if(values.dns1 || values.dns2){
                    let dns = [values.dns1,values.dns2]
                    delete values.dns1;
                    delete values.dns2;
                    values = {...values,section,dns}
                }
                else 
                    values = {...values,section}       
                this.props.handlechangeBaseData(values,this.state.tabpane,send);
            }
        });         
    }    

    handleChangeProto=(arg)=>{
        this.setState({
            temproto:arg
        })
    }
    handleShowAdvanced=(e)=>{
        let checked = e.target.checked
        if(checked==true){
            this.setState({
                showAdvanced:true,
            })
        }else{            
            this.setState({
                showAdvanced:false,
            })
        }
    }
    render(){
        const {
            hostname,ipaddr,netmask,gateway,dns,username,password,ac,service,
            def_macaddr,macaddr,mtu,upbandw,downbandw,  
            proto,cc_mtu,ppp_mtu
        } = this.state.wan_content;
        
        const {tabpane,showAdvanced,temproto} = this.state
        
        const {getFieldDecorator} = this.props.form;
        return(
            <div>
                <div>
                    <Form.Item {...formItemLayout} label="上网方式">
                    {
                        getFieldDecorator('proto', {
                            initialValue:temproto,                                
                        })(
                            <Select /*defaultValue={proto}*/
                             onChange={this.handleChangeProto}
                            >
                                {
                                    tabpane==="1"?null:<Option value="disable">关闭</Option>
                                }
                                <Option value="static">静态IP</Option>
                                <Option value="dhcp">DHCP</Option>
                                <Option value="pppoe">PPPoE</Option>
                                {
                                    tabpane==="1"?<Option value="usb-net">USB-NET</Option>:null 
                                }
                            </Select> 
                        )
                    }          
                    </Form.Item>
                    {temproto!='static' /*||!showStatic*/?null:
                        (<div>
                            <Form.Item {...formItemLayout} label="IP地址">
                            {
                                getFieldDecorator('ipaddr', {
                                    rules: [{
                                        required: true, message: 'IP地址不能为空!',
                                      },{
                                        pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                                        message:'IP地址格式不正确！'
                                   }], 
                                    initialValue:ipaddr,                                
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
                                    initialValue:netmask,                                
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
                                    initialValue:gateway,                                
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
                                    initialValue:dns?dns[0]:'',                                
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
                                    initialValue:dns?dns[1]:'',                                
                                })(
                                    <Input />    
                                )
                            }                
                            </Form.Item>
                         </div>)
                     }
                     {
                        temproto!='dhcp'/*|| !showDhcp*/?null:(                            
                            <Form.Item {...formItemLayout} label="主机名">
                            {
                                getFieldDecorator('hostname', {
                                    initialValue: hostname,  
                                })(
                                    <Input />    
                                )
                            }                
                            </Form.Item>
                         )
                     }
                     {
                         temproto!='pppoe' /*||!showPppoe*/?null:(
                            <div>
                            <Form.Item {...formItemLayout} label="账号">
                            {
                                getFieldDecorator('username', {
                                    rules: [{
                                        required: true, message: '账号不能为空!',
                                      }], 
                                    initialValue:username,                                
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
                                    initialValue:password,                                
                                })(
                                    <Input />    
                                )
                            }                
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="AC">
                            {
                                getFieldDecorator('ac', {
                                    initialValue:ac==undefined?"":ac,                                
                                })(
                                    <Input placeholder="AUTO  留空以自动检测"/>
                                )
                            }                
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="服务器">
                            {
                                getFieldDecorator('service', {
                                    initialValue:service==undefined?"":service,                                
                                })(
                                    <Input placeholder="AUTO 留空以自动检测"/>    
                                )
                            }                
                            </Form.Item>
                         </div>
                         )
                     }
                     {/*
                         !showUsbNet?null:null
                     */}
                    {
                        temproto==='disable'||temproto==='usb-net'?null:<Form.Item {...tailFormItemLayout}>
                        <Checkbox checked={showAdvanced}
                        onChange={this.handleShowAdvanced}
                        >
                            显示高级参数
                        </Checkbox>
                        </Form.Item>
                }    
                    <div style={{display:showAdvanced?'block':'none'}}>
                        <Form.Item {...formItemLayout} label="线路带宽">
                        {
                            getFieldDecorator('upbandw', {
                                initialValue:upbandw,                                
                            })(
                                <InputNumber /> 
                            )
                        }                (上行，单位：Mbps）
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>  
                        {
                            getFieldDecorator('downbandw', {
                                initialValue:downbandw,                                
                            })(
                                <InputNumber/>
                            )
                        }                 (下行，单位：Mbps）
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="MTU" style={proto==='pppoe'?{display:"block"}:{display:"none"}}>
                        {
                            getFieldDecorator('ppp_mtu', {
                                rules: [
                                  {
                                    pattern:new RegExp('^(5[7-9][6-9]|[6-9]\\d\\d|1[0-4][0-8]\\d|149[0-2])$'),
                                    message:'MTU只能为576-1496！'
                               }], 
                                initialValue:ppp_mtu,                                
                            })(                    
                                <InputNumber />   
                            )
                        }                       
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="MTU" style={proto==='pppoe'?{display:"none"}:{display:"block"}}>
                        {
                            getFieldDecorator('cc_mtu', {
                                rules: [
                                  {
                                    pattern:new RegExp('^(5[7-9][6-9]|[6-9]\\d\\d|1[0-4]\\d\\d|1500)$'),
                                    message:'MTU只能为576-1500！'
                               }], 
                                initialValue:cc_mtu,                                
                            })(                    
                                <InputNumber />   
                            )
                        }                       
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="MAC地址">
                        {
                            getFieldDecorator('macaddr', {
                                rules: [{
                                    required: true, message: 'MAC地址不能为空!',
                                  },
                                  {
                                    pattern:new RegExp('^[0-9a-fA-F]{2}(:[0-9a-fA-F]{2}){5}$'),
                                    message:'子网掩码格式不正确！'
                               }], 
                                initialValue:macaddr,                                
                            })(                    
                                <Input disabled={!this.state.cloneCheck}/>   
                            )
                        }   
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                        <Checkbox onChange={this.handleCloneMac}
                        checked={this.state.cloneCheck}
                        >
                            克隆MAC地址
                        </Checkbox>
                        </Form.Item>
                    </div>

                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" onClick={()=>this.handlechangeBaseData(false)}>保存</Button>
                        <Button type="primary" style={{marginLeft:20}} onClick={()=>this.handleApplyData(true)}>应用</Button>
                    </Form.Item>
                </div>
            </div>

        )
    }
}


export default Form.create()(WanContent);