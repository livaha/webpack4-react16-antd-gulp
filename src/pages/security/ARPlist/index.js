
import React from 'react';
import axios from '@/axios'
import {cgidata} from '@/pages/cgidata'
import { Card, Table} from 'antd';
const arpcolumns = [{
  title: 'ip地址',
  dataIndex: 'ip',
}, {
  title: 'mac地址',
  dataIndex: 'mac',
}];

export default class NoMatch extends React.Component{    
    
  state={
    arpList:[]
  }

  componentDidMount(){
    this.getArpListmsg();
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

  render(){
      return (
        <Card title="ARP列表">
          <Table
            bordered
            columns={arpcolumns}
            dataSource={this.state.arpList}
            pagination={false}
          />
      </Card>
    )      
  }
}