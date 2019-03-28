import React from 'react';
import axios from '@/axios';
import {cgidata,cgi_url} from '@/pages/cgidata'
import { Card, Form, message, Input, Button, Switch,} from 'antd';
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'
/**高级配置中的开关是二合一发送：添加一个应用开关 */

class Lan extends React.Component{    

    state={      
      heartbeat_interval:	0,
      heartbeat_fail:	0,
      gloabal_roaming:false,
      gloabal_auto_channel:false,

      heartbeat_interval_src:0,
      heartbeat_fail_src:	0,
      gloabal_roaming_src:false,
      gloabal_auto_channel_src:false,
    }
    componentDidMount(){
      this.getAcCloabalConfig()
      this.getAcAdvanceConfig()
    }
    
    getAcCloabalConfig=()=>{
      let values ={...cgidata.cgidata38};      
        axios.ajax_post({
          data:values
        }).then((res)=>{
            if(res.restcode == 2000){   
              this.setState({              
                heartbeat_interval:	res.result.heartbeat_interval,
                heartbeat_fail:	res.result.heartbeat_fail,
                /**_src用于判断是否要点应用按键 */
                heartbeat_interval_src:	res.result.heartbeat_interval,
                heartbeat_fail_src:	res.result.heartbeat_fail,
              })
            }
        })
    }
    
    setAcCloabalConfig=(values)=>{
      values ={...cgidata.cgidata39,...values};      
      //console.log(values)
        axios.ajax_post({
          data:values
        }).then((res)=>{
            if(res.restcode == 2000){       
              message.success('设置成功！')              
            }
        }).then((res)=>{
          this.getAcCloabalConfig()
        })
      }

    getAcAdvanceConfig=()=>{
    let values ={...cgidata.cgidata40};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
            this.setState({              
              gloabal_roaming:	res.result.gloabal_roaming,
              gloabal_auto_channel:	res.result.gloabal_auto_channel,
              /**_src用于判断是否要点应用按键 */
              gloabal_roaming_src:	res.result.gloabal_roaming,
              gloabal_auto_channel_src:	res.result.gloabal_auto_channel,
            })
          }
      })
    }


    handleSetACGloabalConfig=()=>{        
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //console.log('Received values of form: ', values);
                if(values.heartbeat_interval==this.state.heartbeat_interval_src &&
                  values.heartbeat_fail==this.state.heartbeat_fail_src){
                    message.success("数据已是最新状态！")
                    return false;
                }
                this.setAcCloabalConfig(values)
                this.setState({                  
                  heartbeat_interval:	values.heartbeat_interval,
                  heartbeat_fail:	values.heartbeat_fail,
                })                
            }
        });         
    }

    handleGloabalRoaming=(e)=>{   
        this.setState({                  
          gloabal_roaming:	e,
        })
    }
    handleGloabalAutoChannel=(e)=>{   
        this.setState({                  
          gloabal_auto_channel:	e,
        })
    }
    handleaAvanceConfig=()=>{   
      const {gloabal_roaming,gloabal_auto_channel,gloabal_roaming_src,gloabal_auto_channel_src} = this.state;
      if(gloabal_roaming==gloabal_roaming_src &&
        gloabal_auto_channel==gloabal_auto_channel_src){
          message.success("数据已是最新状态！")
          return false;
      }
      let values ={...cgidata.cgidata41,gloabal_roaming,gloabal_auto_channel};      

        axios.ajax_post({
          data:values
        }).then((res)=>{
            if(res.restcode == 2000){      
              message.success('设置成功！')        
            }
        }).then((res)=>{
          this.getAcAdvanceConfig()
        })
  }

    render(){
        const { getFieldDecorator } = this.props.form;
        return(
          <div>
            <Card title="AC全局配置">
              <Form>
                  <Form.Item {...formItemLayout} label="心跳间隔">
                  {getFieldDecorator('heartbeat_interval', {
                      rules: [
                          { required: true, message: '心跳间隔不能为空!' },
                          {                             
                            pattern:new RegExp('^([3-9]\\d|[1]\\d\\d|200)$'),
                            message:'心跳间隔只能为30-200！'
                       }],
                      initialValue:this.state.heartbeat_interval
                  })(
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="心跳失败次数">
                  {getFieldDecorator('heartbeat_fail', {
                      rules: [
                          { required: true, message: '心跳失败次数不能为空!' },
                          {                             
                            //pattern:new RegExp('^([3-9]|1[0-2])$'),
                            pattern:new RegExp('^([3-6])$'),
                            message:'心跳失败次数只能为3-6！'
                       }],
                          initialValue:this.state.heartbeat_fail
                  })(                        
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" onClick={this.handleSetACGloabalConfig} >
                      应用
                  </Button>
                  </Form.Item>
              </Form>
            </Card>
<br/>
            <Card title="AC全局高级配置"> 
            
              <Form.Item {...formItemLayout} label="全局漫游">
                <Switch
                    checkedChildren="开" 
                    unCheckedChildren="关" 
                    checked={this.state.gloabal_roaming}
                    onChange={this.handleGloabalRoaming}
                  />   
              </Form.Item>
              <Form.Item {...formItemLayout} label="全局自动信道">
                <Switch 
                  checkedChildren="开" 
                  unCheckedChildren="关" 
                  checked={this.state.gloabal_auto_channel}
                  onChange={this.handleGloabalAutoChannel}
                />
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" onClick={this.handleaAvanceConfig} >
                    应用
                </Button>
              </Form.Item>
            </Card>
          </div>
        )
    }
}


export default Form.create()(Lan)


