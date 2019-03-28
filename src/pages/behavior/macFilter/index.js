
import React from 'react';
import { Modal,Switch,Input,Form, Card,message } from 'antd';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import ArpList from '@/components/ArpList'
import ListOfCR from '@/components/ListOfCR'
import {formItemLayout} from '@/config/input_layout'


export default class NoMatch extends React.Component{        
  constructor(props){
    super(props);
    this.columns = [ {
      title: 'Mac地址',
      dataIndex: 'mac_addr',
    }, {
      title: '描述',
      dataIndex: 'desc',
    }];
  }
  state={
    mac_filter:false,
    macfilter_list:	[/*{
      "mac_addr":	"00:19:be:20:03:ef",
      "desc":	"macfilter_test"
    }, {
      "mac_addr":	"00:19:be:20:03:33",
      "desc":	"macfilter_test2"
    }*/]
  }
  componentDidMount(){
    this.getMacFilterConfig()
  }
  getMacFilterConfig=()=>{

    let macfilter_list = []
    let values ={...cgidata.cgidata72};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          if(res.result.macfilter_list){            
            macfilter_list = res.result.macfilter_list.map((item, index) => {
              item.key = index;
              return item;
            });
          }
          this.setState({
            mac_filter:res.result.mac_filter,
            macfilter_list:macfilter_list
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
      mac_filter:checked
    })
    
    this.handleSendData(checked,this.state.macfilter_list)
    
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
      macfilter_list:listContent
    })
    this.handleSendData(this.state.mac_filter,listContent)
    
    this.getMacFilterConfig()
  }
  
  addListItem = () => {
    let flag = false    
    let addItem={}
    let formatErr = false //false为格式正确
    let macfilter_list = this.state.macfilter_list
    this.addItemForm.props.form.validateFields((err, values) => {
        if (!err) {
          addItem = values
          formatErr = false
        }else{          
          formatErr = true
        }
    });   
    //validateFields输入的格式不对则返回重新
    if  (formatErr)  
      return false;
      
    if(macfilter_list>=10){
      message.error('添加数目不能超过10条！')
      return false
    }
      
    if(macfilter_list.length<1)
        flag = true;
    else{
      //some会遍历所有的元素，会影响flag， 我们只要发现不同就跳出
      //Array.some() :检测数组中是否有元素都满足条件
      //Array.every(): 检测数组的所有元素是否都满足条件
      flag = macfilter_list.every(item=>{
        if(item.mac_addr == addItem.mac_addr){
              Modal.error({
                  title: '添加失败',
                  content: `MAC ：${addItem.mac_addr}已经存在!`,
              });
          }          
          /**所有的元素都与输入的元素不同 */  
          return (item.mac_addr != addItem.mac_addr)
      })
    }
    
    if(flag){      
        let value = {mac_addr:addItem.mac_addr.toUpperCase(),desc:addItem.desc}
        macfilter_list.push(value)
        this.setState({
            visible1: false,
            macfilter_list
        });
        this.handleSendData(this.state.mac_filter,macfilter_list)
    }
  }    
  
  /**操作表格（增/删）都会发送到后台 */
  handleSendData=(mac_filter=this.state.mac_filter,list=this.state.macfilter_list)=>{
    
    let values ={...cgidata.cgidata73,mac_filter,macfilter_list:list};      
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
          <Card title="MAC过滤">
          <Form.Item {...formItemLayout} label="MAC过滤设置">
            <Switch 
                style={{marginBottom:20}}
                checkedChildren="开" 
                unCheckedChildren="关" 
                defaultChecked
                checked={this.state.mac_filter}
                onChange={this.handleSwitchChange}
            />
            </Form.Item>
          {
            this.state.mac_filter==false?null:
            <div>
              <ListOfCR
              columns={this.columns}
              dataSource={this.state.macfilter_list}
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
    mac_addr:''
  }

  selectIpMac=(ipaddr,macaddr)=>{
       this.setState({
         mac_addr:macaddr
      });
  }
  render(){
      const { getFieldDecorator }  =this.props.form;
      const formItemLayoutModel = {
          labelCol: {span: 6},
          wrapperCol: {span: 16}
      };
      const tailFormItemLayoutModel = {
        wrapperCol:{
            span:14,
            offset:6
        }
      };

      return (
          <Form>
                  <Form.Item {...formItemLayoutModel} label="MAC地址">
                  {getFieldDecorator('mac_addr', {
                      rules: [{ required: true, message: 'MAC地址不能为空!' },
                      {
                          pattern:new RegExp('^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$'),
                          message:'MAC地址格式不正确！'
                     }], 
                      initialValue:this.state.mac_addr
                  })(                        
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="描述">
                  {getFieldDecorator('desc', {
                      rules: [
                          {
                              //pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                              //message:'IP地址格式不正确！'
                         }], 
                      initialValue:''
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...tailFormItemLayoutModel}>                  
                      <ArpList hideModal1={this.props.hideModal1}
                        selectIpMac={this.selectIpMac}/>
                  </Form.Item>
              </Form>
      )
  }

}

AddListItem = Form.create({})(AddListItem);