
import React from 'react';
import { Select,Switch,Input,Form, Card,Button, Checkbox, message} from 'antd';
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'


const { Option } = Select;
export default class DMZ extends React.Component{    
  
  state={
		dmz_enable:	false,
		wanid:	1,
		dest_ip_src:	"192.168.7.99",
		multiwan_list:	[/*{
				"wanid":	0,
				"interface":	"all"
			}, {
				"wanid":	1,
				"interface":	"wan1"
      }*/],
    user_ip:	"192.168.7.98",
    dest_ip:''
  }

  componentDidMount(){
    this.getDmzConfig()
    this.getCurrenUserInfo()
  }
  getDmzConfig=()=>{
    let values ={...cgidata.cgidata78};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          this.setState({
            dmz_enable:res.result.dmz_enable,
            dmz_enable_src:res.result.dmz_enable,
            wanid:res.result.wanid,
            dest_ip_src:res.result.dest_ip,
            dest_ip:res.result.dest_ip,
            multiwan_list:res.result.multiwan_list,
          })
        }
    })
  }
  getCurrenUserInfo=()=>{
    let values ={...cgidata.cgidata16};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          this.setState({
            user_ip:res.result.user_ip,
          })
        }
    })
  }
  handleSetDmzConfig=()=>{
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({dest_ip:values.dest_ip})
        this.setDmzConfig(this.state.dmz_enable,values.wanid,values.dest_ip)
      }else{
      }
    });   
  }
  setDmzConfig=(dmz_enable,wanid,dest_ip)=>{
    let values ={...cgidata.cgidata79,dmz_enable,wanid,dest_ip};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          message.success('设置成功！')
        }
    }).then((res)=>{      
      this.getDmzConfig()
    })
  }
  renderWanList=(multiwan_list)=>{      
    return multiwan_list.map((item)=>{      
      return (
        <Option value={item.wanid}>{item.interface.toUpperCase()}</Option>
      )
    })
  } 
  changeDestIP=(e)=>{
    let checked = e.target.checked;
    this.props.form.resetFields(`dest_ip`,'');//强制清除指定字段输入的数据
    if(checked){
      this.setState({
        dest_ip:this.state.user_ip
      })
    }else{
      this.setState({
        dest_ip:this.state.dest_ip_src
      })

    }
  }
  handleSwitchChange=(checked)=>{
      this.setState({
        dmz_enable:checked
      })
      if(this.state.dmz_enable_src == true){
        this.setDmzConfig(checked,this.state.wanid,this.state.dest_ip)
      }
  }
  changeMulWan=(value)=>{
    this.setState({
      wanid:value
    })
  }
  render() {   
    const { getFieldDecorator }  =this.props.form;
    return (
          <Card title="DMZ设置">
          
          <Form>
            <Form.Item {...formItemLayout} label="DMZ设置">
          
            <Switch 
                style={{marginBottom:20}}
                checkedChildren="开" 
                unCheckedChildren="关" 
                defaultChecked
                checked={this.state.dmz_enable}
                onChange={this.handleSwitchChange}
            />
            </Form.Item>

            {
              this.state.dmz_enable==false?null:
              <div>

                <Form.Item {...formItemLayout} label="指定接口">
                      {getFieldDecorator('wanid', {
                          initialValue:1
                      })(
                        <Select /*defaultValue={1} */ onChange={this.changeMulWan}>
                        {this.renderWanList(this.state.multiwan_list)}
                        </Select>      
                      )}
                </Form.Item>

                <Form.Item {...formItemLayout} label="主机地址">
                {getFieldDecorator('dest_ip', {
                    rules: [
                        { required: true, message: '请输入主机地址!' },
                        {                             
                          pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                          message:'主机地址格式不正确！'
                    }],
                    initialValue:this.state.dest_ip
                })(
                    <Input/>
                )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Checkbox onChange={this.changeDestIP}>当前连接的电脑IP是{this.state.user_ip}</Checkbox>
                </Form.Item>
                <Form.Item {...tailFormItemLayout} >
                    <Button type="primary" onClick={this.handleSetDmzConfig}>应用</Button>
                </Form.Item>
                  </div>
            }
            </Form>
          </Card>
    )
  }
}

DMZ = Form.create({})(DMZ);