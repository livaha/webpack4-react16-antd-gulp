
import { Table,Modal, Card,Button, Icon  } from 'antd';
import React from 'react';
import {totalTrafficByte,totalTrafficbps} from '@/utils/utils'

import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
/**1处开启定时器：进来的时候开始定时器；2处清理定时器：unmount时，返回时 */
const ButtonGroup = Button.Group;

export default class NoMatch extends React.Component{     
  
  constructor(props) {
    super(props);
    this.clientColumns = [{
      title: 'MAC地址',
      dataIndex: 'mac_address',
      key:'1'
    }, {
      title: 'IP地址',
      dataIndex: 'ip_address',
      key:'2'
    }, {
      title: '累计上传',
      dataIndex: 'up_byte',
      key:'3',
      render: (text, record) => (
        <span>{totalTrafficByte(text)}</span>
      )
    }, {
      title: '累计下载',
      dataIndex: 'down_byte',
      key:'4',
      render: (text, record) => (
        <span>{totalTrafficByte(text)}</span>
      )
    },{
      title: '上传速度',
      dataIndex: 'up_rate',
      key:'5',
      render: (text, record) => (
        <span>{totalTrafficbps(text)}</span>
      ),
    },{
      title: '下载速度',
      dataIndex: 'down_rate',
      key:'6',
      render: (text, record) => (
        <span>{totalTrafficbps(text)}</span>
      ),
    },{
      title: '连接数',
      dataIndex: 'ip_address',
      key:'7',
      render: (text, record) => (
        <a onClick={()=>this.getBreafConntrackInfo(text)}    >查看</a>      
      )
    },{
      title: '封锁',
      dataIndex: 'mac_address',
      key:'8',
      render: (text, record) => (
        <a><Icon type="lock" style={{color:'red'}} onClick={()=>this.addAclList(text)}    /></a>      
      )
    }];

    this.aclColumns = [{
      title: 'MAC地址',
      dataIndex: 'acl_mac',
      key:'1'
    },{
      title: '解除封锁',
      dataIndex: 'acl_mac',
      key:'2',
      render: (text, record) => (
        <a><Icon type="unlock" style={{color:'green'}} onClick={()=>this.deleteAclList(text)}    /></a>      
      )
    }];

    this.conntrackColumns=[{
      title: '目的端口',
      dataIndex: 'dst_port',
      key:'1'
    }, {
      title: '目的地址',
      dataIndex: 'dst',
      key:'2'
    }, {
      title: '协议',
      dataIndex: 'protocol',
      key:'3'
    }, {
      title: '原端口',
      dataIndex: 'sport',
      key:'4'
    },{
      title: '原地址',
      dataIndex: 'src',
      key:'5'
    },{
      title: '连接时间',
      dataIndex: 'time',
      key:'6'
    },];
    
  }
  state={
    visible:false,
    showAcl:false,
    client_list:	[/*{
    "mac_address":	"00:E0:4C:69:00:52",
    "ip_address":	"192.168.7.109",
    "up_byte":	998453284,
    "down_byte":	2513203367,
    "up_rate":	1622227,
    "down_rate":	409
  }, {
    "mac_address":	"00:E0:4C:36:15:3D",
    "ip_address":	"192.168.7.98",
    "up_byte":	0,
    "down_byte":	0,
    "up_rate":	0,
    "down_rate":	0
  }, {
    "mac_address":	"00:E0:4C:69:00:52",
    "ip_address":	"192.168.7.99",
    "up_byte":	0,
    "down_byte":	0,
    "up_rate":	0,
    "down_rate":	1622227
  }, {
    "mac_address":	"00:E0:4C:36:15:3D",
    "ip_address":	"192.168.0.98",
    "up_byte":	0,
    "down_byte":	0,
    "up_rate":	0,
    "down_rate":	0
  }*/],
  conntrack_counts:	3,
  conntrack_list:	[/*{
      "iface":	"--",
      "dst_port":	"49890",
      "dst":	"192.168.1.100",
      "protocol":	"udp",
      "sport":	"56772",
      "src":	"192.168.7.109",
      "time":	"03-10 02:44:24"
    }, {
      "iface":	"--",
      "dst_port":	"20000",
      "dst":	"123.206.60.208",
      "protocol":	"udp",
      "sport":	"57305",
      "src":	"192.168.7.109",
      "time":	"03-10 02:43:36"
    }, {
      "iface":	"--",
      "dst_port":	"8000",
      "dst":	"119.147.185.24",
      "protocol":	"udp",
      "sport":	"12345",
      "src":	"192.168.7.109",
      "time":	"03-10 00:59:10"
    }*/],
		acl_list:	[/*{
				"acl_mac":	"00:E0:4C:36:15:3D"
			}, {
				"acl_mac":	"00:E0:4C:36:15:34"
			}*/]
  }
  
  componentDidMount(){    
    /**获取终端概览信息 */
    this.getBreafClientInfo()  
    /**获取ACL列表 */
    this.getAclList()

    /**定时获取数据 */
    this.intervalId = setInterval(() => {
      this.getBreafClientInfo()  
      this.getAclList()
    }, 5000);
  }
  componentWillUnmount(){
    clearInterval(this.intervalId);
  }
  /**获取终端概览信息 */
  getBreafClientInfo=()=>{
    let data ={...cgidata.cgidata92};      
      axios.ajax_post({
        data:data
      }).then((res)=>{
        if(res.restcode == 2000){ 
         this.setState({client_list:res.result.client_list})
        }
      })
  }
  /**获取终端链接信息 */
  getBreafConntrackInfo=(ip_address)=>{
    let data ={...cgidata.cgidata93,ip_address};      
      axios.ajax_post({
        data:data
      }).then((res)=>{
        if(res.restcode == 2000){ 
         this.setState({
           conntrack_counts:res.result.conntrack_counts,
           conntrack_list:res.result.conntrack_list,
          })
        }
      }).then((res)=>{
        this.setState({visible:true})
      })
  }
  
  /**获取ACL列表 */
  getAclList=()=>{
    let data ={...cgidata.cgidata94};      
      axios.ajax_post({
        data:data
      }).then((res)=>{
        if(res.restcode == 2000){ 
         this.setState({
          acl_list:res.result.acl_list,
          })
        }
      })
  }
  /**增加ACL */
  addAclList=(acl_mac)=>{
    let data ={...cgidata.cgidata95,acl_mac};      
      axios.ajax_post({
        data:data
      }).then((res)=>{
        if(res.restcode == 2000){ 
          /**获取终端概览信息 */
          this.getBreafClientInfo()
        }
      })
  }
  /**删除ACL */
  deleteAclList=(acl_mac)=>{
    let data ={...cgidata.cgidata96,acl_mac};      
      axios.ajax_post({
        data:data
      }).then((res)=>{
        if(res.restcode == 2000){ 
          /**重新获取ACL列表信息 */
          this.getAclList()
        }
      })
  }

  hideModal=()=>{
    this.setState({visible:false})
  }
  showAclList=()=>{
    this.setState({showAcl:true})
  }
  showClientInfo=()=>{
    this.setState({showAcl:false})
  }
  goback=()=>{
    /**返回系统状态：清除当前定时器 */
    clearInterval(this.intervalId);
    this.props.goback()
  }
  render() {   
    return (
      <div>
          <Card>
            
          <ButtonGroup>
            <Button  type="primary" ghost onClick={this.goback}>
              <Icon type="left" />返回
            </Button>
            <Button type="primary" style={{marginBottom:20}}
              onClick={this.showClientInfo} >
            在线列表
            </Button>
            <Button type="primary" onClick={this.showAclList}>
              ACL列表
            </Button>
          </ButtonGroup>
      {
        this.state.showAcl==false?
                <Table
                      bordered
                      columns={this.clientColumns}
                      dataSource={this.state.client_list}
                      //pagination={false}
                  />
                  :
                  <Table
                        bordered
                        columns={this.aclColumns}
                        dataSource={this.state.acl_list}
                        //pagination={false}
                    />
      }

                    
                  <Modal
                      title={`连接数(${this.state.conntrack_counts})`}
                      visible={this.state.visible}
                      footer={null}
                      onCancel={this.hideModal}
                      destroyOnClose={true}
                      maskClosable={true}
                      width={600}
                    >
                    
                  <Table
                        columns={this.conntrackColumns}
                        dataSource={this.state.conntrack_list}
                        pagination={false}
                        style={{margin:-20,marginBottom:20,fontSize: 8}}
                    />
                    </Modal>

                </Card>

          
    </div>
    )
  }
}
