
import React from 'react';
import { Card,Spin,Button,Table, message } from 'antd';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'

export default class DhcpTest extends React.Component{     
 
  state={
    stopping:false,
		action_result:	[]
  }
  componentDidMount(){
    this.getResultStatus()
  }
  
  /**这是取结果的，里面置有定时器 */
  getResultStatus=()=>{    
    let data ={...cgidata.cgidata67};  
    axios.ajax_post({
      data
    }).then((res)=>{
        if(res.restcode == 2000){       
          let action_result = []
          if(res.result.ping_detct==1){        
            clearInterval(this.timeInterval);
            action_result = res.result.action_result.map((item, index) => {
              item.key = index+1;
              return item;
            });
            this.setState({        
              stopping:true,
              action_result
            })          
            this.timeInterval = setInterval(() => {
              this.getResultStatus()       
              action_result = res.result.action_result.map((item, index) => {
                item.key = index+1;
                return item;
              });
              this.setState({ action_result })          
            }, 5000);
          }
          else if(res.result.ping_detct==2 ||res.result.ping_detct==0){
            clearInterval(this.timeInterval);
            //console.log(this.state.action_result)

            if(res.result.action_result.length>0){
              action_result = res.result.action_result.map((item, index) => {
                item.key = index+1;
                return item;
              });
            }else if(res.result.ping_detct==2){
              message.success('没有检测到DHCP')
            }
            this.setState({
              action_result,          
              stopping:false
            })
          }           
        }
    })

  }
  handleStartDhcpTest=()=>{  
    this.setState({
      stopping:true,
      action_result:	[]
    })
    let data ={...cgidata.cgidata68}
    axios.ajax_post({
      data
    }).then((res)=>{          
        setTimeout(() => {
          this.getResultStatus()
        }, 5000);          
    })
  }

  handleStopDhcpTest=()=>{
    this.setState({
      stopping:false
    })    
    let values ={...cgidata.cgidata69};     
    axios.ajax_post({
      data:values
    })
  }
  render() {   
    let {stopping} = this.state
    const columns = [{
      title: '编号',
      dataIndex: 'key',
    },{
      title: 'DHCP服务器IP地址',
      dataIndex: 'ip',
    }, {
      title: 'Mac',
      dataIndex: 'mac',
    }]
    return (
          <Card title="DHCP检测">           
          {
            stopping==false?
            <Button style={{marginBottom:20}} type="primary" onClick={this.handleStartDhcpTest} >
                开始检测
            </Button>
          :
          <div>
            <Button type="primary" style={{marginBottom:20, backgroundColor:'red',borderColor:'red',color: '#fff',marginRight:20}} 
            onClick={this.handleStopDhcpTest} >
                停止检测
            </Button>
            <Spin />

          </div>
          }

          <Table columns={columns} dataSource={this.state.action_result}  pagination={false}/>
          </Card>
    )
  }
}
