
import React from 'react';
import { Switch, Card, message,Table,Form } from 'antd';
import axios from '@/axios'
import {cgidata} from '@/pages/cgidata'
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'


const columns = [ {
  title: '名称',
  dataIndex: 'name',
},{
  title: '内网地址',
  dataIndex: 'ip',
},{
  title: '协议',
  dataIndex: 'proto',
},  {
  title: '内网端口',
  dataIndex: 'iport',
}, {
  title: '外网端口',
  dataIndex: 'eport',
},];
export default class NoMatch extends React.Component{     
  state={
		enable_upnp:	false,
		upnp_list:	[/*{	   
			      "proto":"UDP",
            "name":"HCDN",
            "ip":"	192.168.5.17",
            "iport":"38052",
            "eport":"38052"
          }*/]
  }
  componentDidMount(){
    this.getUpnpdConfig()
  }

  getUpnpdConfig=()=>{    
    let upnp_list = []
    let values ={...cgidata.cgidata82};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){     
            upnp_list = res.result.upnp_list.map((item, index) => {
                item.key = index;
                return item;
            });
            this.setState({
              enable_upnp:res.result.enable_upnp,
              upnp_list
            })
          }
      })
  }
  setUpnpdConfig=(enable_upnp)=>{    
    let values ={...cgidata.cgidata83,enable_upnp};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
            message.success('设置成功')
          }
      })
  }
  handleSwitchChange=(checked)=>{
      this.setState({
        enable_upnp:checked
      })
      this.setUpnpdConfig(checked)
  }

  render() {   
    return (
          <Card title="UPNP设置">
          <Form.Item {...formItemLayout} label="UPNP设置">   
          <Switch 
              checkedChildren="开" 
              unCheckedChildren="关" 
              defaultChecked
              checked={this.state.enable_upnp}
              onChange={this.handleSwitchChange}
          />
          </Form.Item>
          {
            this.state.enable_upnp==false?null:
            
              <Table
              bordered
              columns={columns}
              dataSource={this.state.upnp_list}
              pagination={false}
            />
          }
          </Card>
    )
  }
}
