
import React from 'react';
import { Modal,Switch,Input,Form, Card,message,Select } from 'antd';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import ArpList from '@/components/ArpList'
import ListOfCR from '@/components/ListOfCR'
import {formItemLayout} from '@/config/input_layout'
const { Option } = Select;

export default class NoMatch extends React.Component{        
  constructor(props){
    super(props);
    this.columns = [ {
      title: '接口',
      dataIndex: 'wanid',
      render: (text, record) => {
        switch(text){
          case 0:
            return <span>WANALL</span>
          case 1:
            return <span>WAN1</span>
          case 2:
            return <span>WAN2</span>
          case 3:
            return <span>WAN3</span>
          case 4:
            return <span>WAN4</span>
          default:
            return <span>WAN1</span>
          }
        }
    },{
      title: 'IP地址',
      dataIndex: 'ip_addr',
    }, {
      title: '协议',
      dataIndex: 'proto',
      render: (text, record) => {
        switch(text){
          case 0:
            return <span>TCP+UDP</span>
          case 1:
            return <span>TCP</span>
          case 2:
            return <span>UDP</span>
          default:
            return <span>TCP+UDP</span>
          }
        }
    },{
      title: '内部端口',
      dataIndex: 'internal_port',
    },{
      title: '外部端口',
      dataIndex: 'external_port',
    },{
      title: '描述',
      dataIndex: 'desc',
    }];
  }
  state={
    port_forward:false,
    port_forward_list:	[/*{
      "ip_addr":	"192.168.7.99",
      "wanid":	1,
      "proto":	0,
      "internal_port":	123,
      "external_port":	333,
      "desc":	"asgfqergqe"
    }*/],
    multiwan_list:	[/*{
      "wanid":	0,
      "interface":	"all"
    }, {
      "wanid":	1,
      "interface":	"wan1"
    }*/]
  }
  componentDidMount(){
    this.getPortForwardConfig()
  }
  getPortForwardConfig=()=>{

    let port_forward_list = []
    let values ={...cgidata.cgidata80};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          if(res.result.port_forward_list){            
            port_forward_list = res.result.port_forward_list.map((item, index) => {
              item.key = index;
              return item;
            });
          }
          this.setState({
            port_forward:res.result.port_forward,
            port_forward_list:port_forward_list,
            multiwan_list:res.result.multiwan_list,
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
      port_forward:checked
    })
    
    this.handleSendData(checked,this.state.port_forward_list)
    
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
      port_forward_list:listContent
    })
    this.handleSendData(this.state.port_forward,listContent)
    
    this.getPortForwardConfig()
  }
  
  addListItem = () => {
    let flag = false    
    let addItem={}
    let formatErr = false //false为格式正确
    let port_forward_list = this.state.port_forward_list
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

    if(port_forward_list>=10){
      message.error('添加数目不能超过10条！')
      return false
    }
      
    if(port_forward_list.length<1)
        flag = true;
    else{
      //some会遍历所有的元素，会影响flag， 我们只要发现不同就跳出
      //Array.some() :检测数组中是否有元素都满足条件
      //Array.every(): 检测数组的所有元素是否都满足条件
      flag = port_forward_list.every(item=>{
        if(item.ip_addr == addItem.ip_addr){
              Modal.error({
                  title: '添加失败',
                  content: `IP ：${addItem.ip_addr}已经存在!`,
              });
          }          
          /**所有的元素都与输入的元素不同 */  
          return (item.ip_addr != addItem.ip_addr)
      })
    }
    
    if(flag){      
        let value = addItem
        port_forward_list.push(value)
        this.setState({
            visible1: false,
            port_forward_list
        });
        this.handleSendData(this.state.port_forward,port_forward_list)
    }
  }    
  
  /**操作表格（增/删）都会发送到后台 */
  handleSendData=(port_forward=this.state.port_forward,port_forward_list=this.state.port_forward_list)=>{
    let values ={...cgidata.cgidata81,port_forward,port_forward_list};      
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
          <Card title="端口映射">
          <Form.Item {...formItemLayout} label="端口映射">      
            <Switch 
                style={{marginBottom:20}}
                checkedChildren="开" 
                unCheckedChildren="关" 
                defaultChecked
                checked={this.state.port_forward}
                onChange={this.handleSwitchChange}
            />
            </Form.Item>
          {
            this.state.port_forward==false?null:
            <div>
              <ListOfCR
              columns={this.columns}
              dataSource={this.state.port_forward_list}
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
                    multiwan_list={this.state.multiwan_list}
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
    multiwan_list:this.props.multiwan_list,
    ip_addr:''
  }
  
  
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props ) {
        this.setState({
          multiwan_list:nextProps.multiwan_list,
        })
    }
  }

  selectIpMac=(ipaddr,macaddr)=>{
       this.setState({
        ip_addr:ipaddr
      });
  }
  renderWanList=(multiwan_list)=>{      
    return multiwan_list.map((item)=>{      
      return (
        <Option value={item.wanid}>{item.interface.toUpperCase()}</Option>
      )
    })
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
                  <Form.Item {...formItemLayoutModel} label="指定接口">
                  {getFieldDecorator('wanid', {
                      initialValue:1
                  })(

                    <Select /*defaultValue={1} */>
                    {this.renderWanList(this.state.multiwan_list)}
                    </Select>      
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="IP地址">
                  {getFieldDecorator('ip_addr', {
                      rules: [{ required: true, message: 'IP地址不能为空!' },
                          {
                              pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                              message:'IP地址格式不正确！'
                         }], 
                      initialValue:this.state.ip_addr
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="协议">
                  {getFieldDecorator('proto', {
                      initialValue:0
                  })(

                    <Select /*defaultValue={0} */>
                      <Option value={0}>TCP+UDP</Option>
                      <Option value={1}>TCP</Option>
                      <Option value={2}>UDP</Option>
                    </Select>      
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="内部端口">
                  {getFieldDecorator('internal_port', {
                      rules: [
                          {                             
                            pattern:new RegExp('^([1-9]|\\d{2,4}|[1-5]\\d{4}|6[0-5][0-5][0-3][0-5])$'),
                            message:'端口只能为1-65535！'
                      }],
                      initialValue:''
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="外部端口">
                  {getFieldDecorator('external_port', {
                      rules: [
                          {                             
                            pattern:new RegExp('^([1-9]|\\d{2,4}|[1-5]\\d{4}|6[0-5][0-5][0-3][0-5])$'),
                            message:'端口只能为1-65535！'
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
                  <Form.Item {...tailFormItemLayoutModel}>                  
                      <ArpList hideModal1={this.props.hideModal1}
                        selectIpMac={this.selectIpMac}/>
                  </Form.Item>
              </Form>
      )
  }

}

AddListItem = Form.create({})(AddListItem);