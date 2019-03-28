
import React from 'react';
import { Select,Switch,Form, Card,Button, message} from 'antd';
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'

const { Option } = Select;
export default class WanPing extends React.Component{    
  
  state={
		wanping_en:	false,
		wanid:	1,
		multiwan_list:	[{
				"wanid":	0,
				"interface":	"all"
			}, {
				"wanid":	1,
				"interface":	"wan1"
      }],
  }

  componentDidMount(){
    this.getWanPingConfig()
  }
  getWanPingConfig=()=>{
    let values ={...cgidata.cgidata101};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          this.setState({
            wanping_en:res.result.wanping_en,
            wanping_en_src:res.result.wanping_en,
            wanid:res.result.wanid,
            multiwan_list:res.result.multiwan_list
          })
        }
    })
  }
  handleSetWanPingConfig=()=>{
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setWanPingConfig(this.state.wanping_en,values.wanid,)
      }else{
      }
    });   
  }
  setWanPingConfig=(wanping_en,wanid)=>{
    let values ={...cgidata.cgidata102,wanping_en,wanid};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          message.success('设置成功！')
        }
    }).then((res)=>{
      this.getWanPingConfig()
  })
  }
  renderWanList=(multiwan_list)=>{      
    return multiwan_list.map((item)=>{      
      return (
        <Option value={item.wanid}>{item.interface.toUpperCase()}</Option>
      )
    })
  } 

  handleSwitchChange=(checked)=>{
      this.setState({
        wanping_en:checked
      })
      if(this.state.wanping_en_src == true){
        this.setWanPingConfig(checked,this.state.wanid)
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
          <Card title="WanPing设置">
          
          <Form>
            <Form.Item {...formItemLayout} label="WanPing设置">
          
            <Switch 
                style={{marginBottom:20}}
                checkedChildren="开" 
                unCheckedChildren="关" 
                defaultChecked
                checked={this.state.wanping_en}
                onChange={this.handleSwitchChange}
            />
            </Form.Item>

            {
              this.state.wanping_en==false?null:
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

                <Form.Item {...tailFormItemLayout} >
                    <Button type="primary" onClick={this.handleSetWanPingConfig}>应用</Button>
                </Form.Item>
                  </div>
            }
            </Form>
          </Card>
    )
  }
}

WanPing = Form.create({})(WanPing);