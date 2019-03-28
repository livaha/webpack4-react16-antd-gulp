import React from 'react';
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'
import { Switch, Form, Button, Input, Select } from 'antd';

const { Option } = Select;

class ApRadio extends React.Component{
    state={
      showRadio0:this.props.showRadio0,
      radio_config:this.props.radio_config,
    }
    componentWillReceiveProps(nextProps) {
      if (nextProps !== this.props ) {
        if(nextProps.radio_config!=this.props.radio_config){
            this.props.form.resetFields();
            
            this.setState({
                showRadio0: nextProps.showRadio0,
                radio_config:nextProps.radio_config
            })
        }
      }
    }
    changeWirelessmode=(value)=>{
      let radio_config = this.state.radio_config;
      radio_config.wirelessmode=value
      this.setState({radio_config:radio_config})
      if(value=="1"||value=="2"||value=="4")
        this.changeHtmode("0")
    }
  
    changeHtmode=(value)=>{
      let radio_config = this.state.radio_config;
      radio_config.htmode=value
      this.setState({radio_config:radio_config})
    }
  
    changeChannel=(value)=>{
      let radio_config = this.state.radio_config;
      radio_config.channel=value
      this.setState({radio_config:radio_config})
    }
    changeTxpower=(value)=>{
      let radio_config = this.state.radio_config;
      radio_config.txpower=value
      this.setState({radio_config:radio_config})
    }
  
    changeIfadmin=(value)=>{
      if(value==true) value="1"
      else value="0"
      let radio_config = this.state.radio_config;
      radio_config.if_admin=value
      this.setState({radio_config:radio_config})
    }
  
    render(){
      const { getFieldDecorator } = this.props.form;
      const channel0=[1,2,3,4,5,6,7,8,9,10,11,12,13]
      const channel1=[149,153,157,161,165]
      const showRadio0 = this.state.showRadio0
  
      const {if_admin,wirelessmode,htmode,channel,txpower,beacon} = this.state.radio_config
        return (
          <Form>
                <Form.Item {...formItemLayout} label="射频">
                  <Switch
                      checkedChildren="开" 
                      unCheckedChildren="关" 
                      checked={if_admin=="1"?true:false}
                      onChange={this.changeIfadmin}
                    />   
                </Form.Item>
                {if_admin=="0"?null:
                <div>
                    {/*<Form.Item {...formItemLayout} label="国家">             
                      <Input value={country} readOnly/>
                    </Form.Item>*/}
                    <Form.Item {...formItemLayout} label="无线模式">
                    {
                      showRadio0?
                      <Select defaultValue="1" value={wirelessmode}  onChange={this.changeWirelessmode}>
                        <Option value="1">11B</Option>
                        <Option value="4">11G</Option>
                        <Option value="6">11N</Option>
                        <Option value="9">11BGN</Option>
                      </Select>      
                      :
                      <Select defaultValue="2" value={wirelessmode} onChange={this.changeWirelessmode}>
                        <Option value="2">11A</Option>
                        <Option value="8">11AN</Option>
                        <Option value="14">11AC</Option>
                      </Select>   
                    }
                    </Form.Item>
                    {//上面默认是11A或11B，所以这里默认是隐藏的
                      wirelessmode=="6"||
                      wirelessmode=="9"||
                      wirelessmode=="14"?
                      <Form.Item {...formItemLayout} label="频宽">
                      <Select defaultValue="0" value={htmode} onChange={this.changeHtmode}>
                        <Option value="0">HT20MHz</Option>
                        <Option value="1">HT40MHz</Option>
                        <Option value="2">HT80MHz</Option>
                      </Select>         
                    </Form.Item>
                        :                      
                      wirelessmode=="8"?
                      <Form.Item {...formItemLayout} label="频宽">
                      <Select defaultValue="0" value={htmode} onChange={this.changeHtmode}>
                        <Option value="0">HT20MHz</Option>
                        <Option value="1">HT40MHz</Option>
                      </Select>         
                    </Form.Item>
                      :
                      <Form.Item {...formItemLayout} label="频宽" style={{display:"none"}}>
                      <Select defaultValue="0" value="0" >
                        <Option value="0">HT20MHz</Option>
                      </Select>         
                      </Form.Item>
                    }
                    <Form.Item {...formItemLayout} label="信道">
                    {
                      <Select defaultValue="0" value={channel}  onChange={this.changeChannel}>
                        <Option value="0">AUTO</Option>
                        { 
                          showRadio0?channel0.map((item)=>{
                            return <Option value={item}>{item}</Option>}):
                          channel1.map((item)=>{
                            return <Option value={item}>{item}</Option>})
                        }
                      </Select>         
                    }
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="发射功率">
                    {
                      <Select defaultValue="0"  value={txpower}   onChange={this.changeTxpower}>
                        <Option value="0">0%</Option>
                        <Option value="12">12.5%</Option>
                        <Option value="25">25%</Option>
                        <Option value="50">50%</Option>
                        <Option value="75">75%</Option>
                        <Option value="100">100%</Option>
                      </Select>         
                    }
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="信标间隔(ms)">
                    {getFieldDecorator('beacon', {
                        rules: [
                            { required: true, message: '请选择信标间隔!' }], 
                            initialValue:beacon
                    })(
                      //<Input ref={(input) => {this.beacon = input}} />
                      <Input/>
                    )}
                    </Form.Item>
                </div>
                }
                <Form.Item {...tailFormItemLayout}>
                    <Button style={{width:132}} type="primary" onClick={()=>this.props.handleRadio(this.state.radio_config)}                        
                    >应用</Button>
                </Form.Item>
            </Form>
        )
    }
}
export default  Form.create()(ApRadio);
