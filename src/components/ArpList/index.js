
import React from 'react';
import {Table, Button, Modal} from 'antd';
import {cgidata} from '@/pages/cgidata'
import axios from '@/axios'

export default class ArpList extends React.Component{    
 
  constructor(props) {
    super(props);    
    this.arpcolumns = [{
      title: 'ip地址',
      dataIndex: 'ip',
    }, {
      title: 'mac地址',
      dataIndex: 'mac',
    }];    
  }

  state={
    arpList : [],
  }
    
  getArpListmsg=()=>{
    let arpList = []
    let values ={...cgidata.cgidata23};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
            arpList = res.result.arp_list.map((item, index) => {
                item.key = index;
                return item;
            });
            this.setState({arpList})
          }
      })
  }
  
  onRowClick=(selectedRows) => {
    this.setState({
        visible2: false,
    });
    let MAC = selectedRows.mac.toUpperCase()
    this.props.selectIpMac(selectedRows.ip,MAC)
  }


  handleScanArpList=()=>{
    this.getArpListmsg()
    this.setState({
        visible2: true,
      });
    //this.props.hideModal1()
  }
  hideModal2 = () => {
    this.setState({
        visible2: false,
        visible1: true,
    });
  }
  render() {   

    return (
          <div>
          <Button onClick={this.handleScanArpList}                        
          >扫描</Button>
          
          <Modal
            title="ARP列表"
            //mask={false}
            visible={this.state.visible2}
            maskClosable={false}
            onCancel={this.hideModal2}
            destroyOnClose={true}
            footer={<Button onClick={this.hideModal2}                        
            >关闭</Button>}
          >
              
            <Table
                bordered
                columns={this.arpcolumns}
                dataSource={this.state.arpList}
                pagination={false}
                onRowClick={this.onRowClick}
            />
          </Modal>
          </div>
    )
  }
}

/***
 * 在父组件中使用：
 
import ArpList from '@/components/ArpList'

export default class NoMatch extends React.Component{     
  hideModal1 = () => {
    this.setState({
        visible1: false,
    });
  }
  selectIpMac=(ipaddr,macaddr)=>{

    this.setState({
      visible1: true,
      ipaddr,
      macaddr ,
  });
  }
  render() {   
    return (
          <div>
            <ArpList hideModal1={this.hideModal1}
            selectIpMac={this.selectIpMac}/>
          </div>
    )
  }
}
 */