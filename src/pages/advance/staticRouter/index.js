
import React from 'react';
import { Modal,Input,Form, Card,message,Select } from 'antd';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import ArpList from '@/components/ArpList'
import ListOfCR from '@/components/ListOfCR'
const { Option } = Select;

export default class NoMatch extends React.Component{           
  constructor(props){
    super(props);
    this.columns = [{
      title: '接口',
      dataIndex: 'interface',      
      render: text => {
        return <span>{text.toUpperCase()}</span>
      }  
    },{
      title: '目的地址',
      dataIndex: 'target',
    }, {
      title: '子网掩码',
      dataIndex: 'netmask',
    },{
      title: '网关',
      dataIndex: 'gateway',
    },{
      title: '路由度量',
      dataIndex: 'metric',
    },{
      title: '备注',
      dataIndex: 'comment',
    }];
  }
  state={
    static_router_list:	[/*{
      "interface":	"lan",
      "target":	"192.168.7.99",
      "gateway":	"192.168.7.99",
      "netmask":	"255.255.255.255",
      "metric":	1,
      "comment":	"aaaaa"
    }, {
      "interface":	"wan1",
      "target":	"192.168.5.99",
      "gateway":	"192.168.5.99",
      "netmask":	"255.255.255.255",
      "metric":	1,
      "comment":	"bbbbbb"
    }*/],
  interface_list:	[{
      "id":	0,
      "interface":	"lan"
    }, {
      "id":	1,
      "interface":	"wan1"
    }]
  }
  
  componentDidMount(){
    this.getStaticRouterConfig()
  }
  getStaticRouterConfig=()=>{

    let static_router_list = []
    let values ={...cgidata.cgidata70};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          if(res.result.static_router_list){            
            static_router_list = res.result.static_router_list.map((item, index) => {
              item.key = index;
              return item;
            });
          }
          this.setState({
            static_router_list:static_router_list,
            interface_list:res.result.interface_list,
          })
        }
    })
  }
  hideModal1 = () => {
    this.setState({
        visible1: false,
    });
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
      static_router_list:listContent
    })
    this.handleSendData(listContent)
    
    this.getStaticRouterConfig()
  }
  
  /**操作表格（增/删）都会发送到后台 */
  handleSendData=(static_router_list)=>{
    let values ={...cgidata.cgidata71,static_router_list};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          message.success('设置成功！')
        }
    })
  }
  
  addListItem = () => {
    let flag = false    
    let addItem={}
    let formatErr = false //false为格式正确
    let static_router_list = this.state.static_router_list
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

    if(static_router_list>=10){
      message.error('添加数目不能超过10条！')
      return false
    }
      
    if(static_router_list.length<1)
        flag = true;
    else{
      //some会遍历所有的元素，会影响flag， 我们只要发现不同就跳出
      //Array.some() :检测数组中是否有元素都满足条件
      //Array.every(): 检测数组的所有元素是否都满足条件
      flag = static_router_list.every(item=>{
        if(item.target == addItem.target){
              Modal.error({
                  title: '添加失败',
                  content: `IP ：${addItem.target}已经存在!`,
              });
          }          
          /**所有的元素都与输入的元素不同 */  
          return (item.target != addItem.target)
      })
    }
    
    if(flag){      
        let value = addItem
        static_router_list.push(value)
        this.setState({
            visible1: false,
            static_router_list
        });
        this.handleSendData(static_router_list)
    }
  }    
  render() {   
    return (
          <Card title="静态路由">
            <ListOfCR
            columns={this.columns}
            dataSource={this.state.static_router_list}
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
                    interface_list={this.state.interface_list}
                    //handleScanArpList = {this.handleScanArpList.bind(this)}
                    wrappedComponentRef={(inst)=>{this.addItemForm = inst;}}
                />
            </Modal>
          </Card>
    )
  }
}


class AddListItem extends React.Component{
  state={
    interface_list:this.props.interface_list,
    ip_addr:''
  }
  
  
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props ) {
        this.setState({
          interface_list:nextProps.interface_list,
        })
    }
  }

  selectIpMac=(ipaddr,macaddr)=>{
       this.setState({
        ip_addr:ipaddr
      });
  }
  renderWanList=(interface_list)=>{      
    return interface_list.map((item)=>{      
      return (
        <Option value={item.interface}>{item.interface.toUpperCase()}</Option>
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
                  <Form.Item {...formItemLayoutModel} label="接口">
                  {getFieldDecorator('interface', {
                      initialValue:this.state.interface_list[0].interface
                  })(

                    <Select /*defaultValue={1} */>
                    {this.renderWanList(this.state.interface_list)}
                    </Select>      
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="目的地址">
                  {getFieldDecorator('target', {
                      rules: [{ required: true, message: '目的地址不能为空!' },
                          {
                              pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                              message:'目的地址格式不正确！'
                         }], 
                      initialValue:this.state.ip_addr
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="网关">
                  {getFieldDecorator('gateway', {
                      rules: [{ required: true, message: '网关地址不能为空!' },
                          {
                              pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                              message:'网关地址格式不正确！'
                         }], 
                      initialValue:this.state.ip_addr
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="子网掩码">
                  {getFieldDecorator('netmask', {
                      rules: [{ required: true, message: '子网掩码地址不能为空!' },
                          {
                            pattern:new RegExp('^(254|252|248|240|224|192|128|0)\\.0\\.0\\.0$|^(255\\.(254|252|248|240|224|192|128|0)\\.0\\.0)$|^(255\\.255\\.(254|252|248|240|224|192|128|0)\\.0)$|^(255\\.255\\.255\\.(254|252|248|240|224|192|128|0))$'),
                            message:'子网掩码地址格式不正确！'
                         }], 
                      initialValue:this.state.ip_addr
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="路由度量">
                  {getFieldDecorator('metric', {
                      rules: [{ required: true, message: '路由度量不能为空!' },
                          {                             
                            pattern:new RegExp('^([0-9]|\\d\\d|[1]\\d\\d|2[0-4]\\d|25[0-5])$'),
                            message:'路由度量只能为0-255！'
                      }],
                      initialValue:''
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="备注">
                  {getFieldDecorator('comment', {
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
