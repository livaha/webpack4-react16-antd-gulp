
import React from 'react';
import { Select,Switch,Input,Form, Card,Button,message } from 'antd';
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'
import axios from '@/axios'
import {cgidata} from '@/pages/cgidata'

const { Option } = Select;
/**指定接口中的列表由muliti_wan决定，但是默认选中接口由wanid决定
 * 我们要注意的是获取到的wanid是否存在于muliti_wan中，不在则默认接口为WAN1，wanid=1
 */

class Remote extends React.Component {
  state={
		remote_enable:	false,
		wanid:	1,
		port:	8080,
		multiwan_list:	[{
				"wanid":	0,
				"interface":	"all"
			}, {
				"wanid":	1,
				"interface":	"wan1"
			}]
  }
  componentDidMount(){
    this.getRemoteManageConfig()
    
    let wanid = this.state.multiwan_list.some(element => {
      return (element.wanid == this.state.wanid)
    });
  }

  getRemoteManageConfig=()=>{    
    let values ={...cgidata.cgidata59};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){     
            let wanid = 1;
            /**判断一个值，看wanid是否在列表中，在则为wanid，不在则为1，给变量 */
            let wanidState = res.result.multiwan_list.some(element => {
              return (element.wanid == res.result.wanid)
            });
            if(wanidState == true){
              wanid = res.result.wanid
            }
            this.setState({
              remote_enable:res.result.remote_enable,
              wanid:wanid,
              port:res.result.port,
              multiwan_list:res.result.multiwan_list,
            })
          }
      })
  }
  setRemoteManageConfig=(data)=>{
      
    let values ={...cgidata.cgidata60,...data};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
            message.success('设置成功')
          }
      })
  }
  handleSetRemoteManageConfig=()=>{
    this.props.form.validateFields((err,values)=>{
      if(!err){
        this.setState({
          wanid:values.wanid,
          port:values.port
        })
        let data = {remote_enable:this.state.remote_enable,...values}
        this.setRemoteManageConfig(data)
      }
    })
  }
  renderMulitiWan=(multiwan_list)=>{      
    return multiwan_list.map((item)=>{
      return (
        <Option value={item.wanid} >{item.interface.toUpperCase()}</Option>
      )
    })
  }


  handleSwitch=(checked)=>{
    this.setState({
      remote_enable:checked
    })
    let data = {remote_enable:checked,wanid:this.state.wanid,port:this.state.port}
    this.setRemoteManageConfig(data)

  }
  handleChangeWanid=(value)=>{
    this.setState({wanid:value})
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title="远程管理">
      <Form>
        <Form.Item {...formItemLayout} label="开关">
          <Switch 
            checkedChildren="开" 
            unCheckedChildren="关" 
            checked={this.state.remote_enable}
            onChange={this.handleSwitch}
          />
        </Form.Item>
        {this.state.remote_enable==false?null:
          <div>
            <Form.Item {...formItemLayout} label="指定端口">
            {getFieldDecorator('wanid', {
                initialValue:this.state.wanid
            })(
              <Select /*value={this.state.wanid}*/ onChange={this.handleChangeWanid}>
                {this.renderMulitiWan(this.state.multiwan_list)}
              </Select>
            )}
            </Form.Item>

            <Form.Item {...formItemLayout} label="接口">
            {
                getFieldDecorator('port', {
                  rules: [
                      {                             
                        pattern:new RegExp('^([8-9]\\d|\\d{3,4}|[1-5]\\d{4}|6[0-5][0-5][0-3][0-5])$'),
                        message:'接口只能为80-65535！'
                  }],
                  initialValue:this.state.port,                  
                })(
                  <Input />      
              )
            }
            </Form.Item>
            
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" onClick={this.handleSetRemoteManageConfig} >
                  应用
              </Button>
            </Form.Item>

          </div>
        }
      </Form>
      </Card>
    );
  }
}

export default Form.create()(Remote)
