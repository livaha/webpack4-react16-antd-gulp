
import React from 'react';
import { Modal,Switch,Input,Form, Card,message } from 'antd';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import {ipRangeisExist} from '@/utils/utils'
import ListOfCR from '@/components/ListOfCR'
import {formItemLayout} from '@/config/input_layout'

export default class NoMatch extends React.Component{        
  constructor(props){
    super(props);
    this.columns = [ {
      title: '连接数',
      dataIndex: 'connlimit_num',
    },{
      title: '起始IP',
      dataIndex: 'start_ip',
    },{
      title: '结束IP',
      dataIndex: 'end_ip',
    },{
      title: '描述',
      dataIndex: 'desc',
    }];
  }
  state={
    conn_limit:false,
		conn_limit_list:	[/*
			{
				"connlimit_num":	"123",
				"start_ip":	"192.168.1.1",
				"end_ip":	"192.168.1.2",
				"desc":	"aaaaa"
			},
			{
				"connlimit_num":100,         
				"start_ip":"192.168.1.4",
				"end_ip":"192.168.1.9",
				"desc":"bbbbb"
	}*/]
  }
  componentDidMount(){
    this.getIpPortFilterConfig()
  }
  getIpPortFilterConfig=()=>{

    let conn_limit_list = []
    let values ={...cgidata.cgidata97};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          if(res.result.conn_limit_list){            
            conn_limit_list = res.result.conn_limit_list.map((item, index) => {
              item.key = index;
              return item;
            });
          }
          this.setState({
            conn_limit:res.result.conn_limit,
            conn_limit_list:conn_limit_list
          })
        }
    })
  }
  
  hideModal1 = () => {
    this.setState({
        visible1: false,
    });
  }
  
  handleSwitchChange=(checked)=>{ 
    this.setState({
      conn_limit:checked
    })
    
    this.handleSendData(checked,this.state.conn_limit_list)
    
  }
  /**增加条目，一个新的MODEL里的内容 */
  handleAddListItem=()=>{
    this.setState({
      visible1: true,
  });
  }
  /**删除条目，参数为已删除的条目内容 */
  handleDeleteSelectList=(listContent)=>{
    this.setState({
      conn_limit_list:listContent
    })
    this.handleSendData(this.state.conn_limit,listContent)
    
    this.getIpPortFilterConfig()
  }
  
  addListItem=()=>{
    this.addItemForm.props.form.validateFields((err, values) => {
      if (!err) {
        let conn_limit_list = this.state.conn_limit_list
        if(conn_limit_list.length>=10){          
          message.error("增加条目不能超过10条！")
          return false;
        }
          let iplimit_item = values
          if(ipRangeisExist(conn_limit_list,values.start_ip,values.end_ip)){
            conn_limit_list.push(iplimit_item)
            this.setState({
                visible1: false,
                conn_limit_list
            });
            this.handleSendData(this.state.conn_limit,conn_limit_list)
          }else{
            return false;
          }
      }      
    });   
  }
    
  /**操作表格（增/删）都会发送到后台 */
  handleSendData=(conn_limit,conn_limit_list)=>{
    
    let values ={...cgidata.cgidata98,conn_limit,conn_limit_list};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          message.success('设置成功！')
        }
    })
  }

  render() {   
    return (
          <Card title="终端连接数控制">
          <Form.Item {...formItemLayout} label="终端连接数控制">   
            <Switch 
                style={{marginBottom:20}}
                checkedChildren="开" 
                unCheckedChildren="关" 
                defaultChecked
                checked={this.state.conn_limit}
                onChange={this.handleSwitchChange}
            />
            </Form.Item>
          {
            this.state.conn_limit==false?null:
            <div>
              <ListOfCR
              columns={this.columns}
              dataSource={this.state.conn_limit_list}
              handleAddListItem={this.handleAddListItem}
              handleDeleteSelectList={this.handleDeleteSelectList}
              />

              <Modal
                  title="添加条目"
                  visible={this.state.visible1}
                  onOk={this.addListItem}
                  onCancel={this.hideModal1}
                  destroyOnClose={true}
                  okText="确认"
                  cancelText="取消"
              >
                <AddListItem 
                    hideModal1={this.hideModal1}
                    //selectIpMac={this.selectIpMac}
                    //handleScanArpList = {this.handleScanArpList.bind(this)}
                    wrappedComponentRef={(inst)=>{this.addItemForm = inst;}}
                />
              </Modal>
            </div>
          }
          </Card>
    )
  }
}


class AddListItem extends React.Component{
  state={
    
  }

  
  render(){
      const { getFieldDecorator }  =this.props.form;
      const formItemLayoutModel = {
          labelCol: {span: 6},
          wrapperCol: {span: 16}
      };

      return (
          <Form>
                  <Form.Item {...formItemLayoutModel} label="连接数">
                  {getFieldDecorator('connlimit_num', {
                      rules: [
                          {                             
                            pattern:new RegExp('^([1-9]|\\d{2,3}|1000)$'),
                            message:'端口只能为1-1000！'
                      }],
                      initialValue:''
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="起始IP">
                  {getFieldDecorator('start_ip', {
                      rules: [{ required: true, message: 'IP地址不能为空!' },
                          {
                              pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                              message:'IP地址格式不正确！'
                         }], 
                      initialValue:''
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="结束IP">
                  {getFieldDecorator('end_ip', {
                      rules: [{ required: true, message: 'IP地址不能为空!' },
                          {
                              pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                              message:'IP地址格式不正确！'
                         }], 
                      initialValue:''
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="描述">
                  {getFieldDecorator('desc', {
                      initialValue:''
                  })(
                      <Input/>
                  )}
                  </Form.Item>
              </Form>
      )
  }

}

AddListItem = Form.create({})(AddListItem);