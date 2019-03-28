
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
      title: 'IP地址',
      dataIndex: 'src_ip',
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
      title: '目的起始端口',
      dataIndex: 'port_start',
    },{
      title: '目的结束端口',
      dataIndex: 'port_end',
    },{
      title: '描述',
      dataIndex: 'desc',
    }];
  }
  state={
    ip_port_filter:false,
    ipportfilter_list:	[/*{
      "src_ip":	"192.168.7.2",
      "proto":	0,
      "port_start":	0,
      "port_end":	555,
      "desc":	"123123"
    }*/]
  }
  componentDidMount(){
    this.getIpPortFilterConfig()
  }
  getIpPortFilterConfig=()=>{

    let ipportfilter_list = []
    let values ={...cgidata.cgidata76};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          if(res.result.ipportfilter_list){            
            ipportfilter_list = res.result.ipportfilter_list.map((item, index) => {
              item.key = index;
              return item;
            });
          }
          this.setState({
            ip_port_filter:res.result.ip_port_filter,
            ipportfilter_list:ipportfilter_list
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
      ip_port_filter:checked
    })
    
    this.handleSendData(checked,this.state.ipportfilter_list)
    
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
      ipportfilter_list:listContent
    })
    this.handleSendData(this.state.ip_port_filter,listContent)
    
    this.getIpPortFilterConfig()
  }
  
  addListItem = () => {
    let flag = false    
    let addItem={}
    let formatErr = false //false为格式正确
    let ipportfilter_list = this.state.ipportfilter_list
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

    if(parseInt(addItem.port_end) < parseInt(addItem.port_start)){
      message.error('起始端口不能大于结束端口')
      return false
    }
    if(ipportfilter_list>=10){
      message.error('添加数目不能超过10条！')
      return false
    }
      
    if(ipportfilter_list.length<1)
        flag = true;
    else{
      //some会遍历所有的元素，会影响flag， 我们只要发现不同就跳出
      //Array.some() :检测数组中是否有元素都满足条件
      //Array.every(): 检测数组的所有元素是否都满足条件
      flag = ipportfilter_list.every(item=>{
        if(item.src_ip == addItem.src_ip){
              Modal.error({
                  title: '添加失败',
                  content: `IP ：${addItem.src_ip}已经存在!`,
              });
          }          
          /**所有的元素都与输入的元素不同 */  
          return (item.src_ip != addItem.src_ip)
      })
    }
    
    if(flag){      
        let value = addItem//{src_ip:addItem.src_ip,desc:addItem.desc}
        ipportfilter_list.push(value)
        this.setState({
            visible1: false,
            ipportfilter_list
        });
        this.handleSendData(this.state.ip_port_filter,ipportfilter_list)
    }
  }    
  
  /**操作表格（增/删）都会发送到后台 */
  handleSendData=(ip_port_filter=this.state.ip_port_filter,ipportfilter_list=this.state.ipportfilter_list)=>{
    
    let values ={...cgidata.cgidata77,ip_port_filter,ipportfilter_list};      
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
          <Card title="IP/端口过滤">
          <Form.Item {...formItemLayout} label="IP/PORT过滤设置">
            <Switch 
                style={{marginBottom:20}}
                checkedChildren="开" 
                unCheckedChildren="关" 
                defaultChecked
                checked={this.state.ip_port_filter}
                onChange={this.handleSwitchChange}
            />
            </Form.Item>
          {
            this.state.ip_port_filter==false?null:
            <div>
              <ListOfCR
              columns={this.columns}
              dataSource={this.state.ipportfilter_list}
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
    src_ip:''
  }

  selectIpMac=(ipaddr,macaddr)=>{
       this.setState({
        src_ip:ipaddr
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
                  <Form.Item {...formItemLayoutModel} label="IP地址">
                  {getFieldDecorator('src_ip', {
                      rules: [{ required: true, message: 'IP地址不能为空!' },
                          {
                              pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                              message:'IP地址格式不正确！'
                         }], 
                      initialValue:this.state.src_ip
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
                  <Form.Item {...formItemLayoutModel} label="目的起始端口">
                  {getFieldDecorator('port_start', {
                      rules: [
                          {                             
                            pattern:new RegExp('^([1-9]|\\d{2,4}|[1-5]\\d{4}|6[0-5][0-5][0-3][0-5])$'),
                            message:'端口只能为1-65535！'
                      }],
                      initialValue:100
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="目的结束端口">
                  {getFieldDecorator('port_end', {
                      rules: [
                          {                             
                            pattern:new RegExp('^([1-9]|\\d{2,4}|[1-5]\\d{4}|6[0-5][0-5][0-3][0-5])$'),
                            message:'端口只能为1-65535！'
                      }],
                      initialValue:555
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