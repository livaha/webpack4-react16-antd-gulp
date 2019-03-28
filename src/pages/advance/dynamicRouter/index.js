
import React from 'react';
import { Modal,Input,Form, Card,message,Select } from 'antd';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import ListOfCR from '@/components/ListOfCR'
const { Option } = Select;

export default class NoMatch extends React.Component{         
  constructor(props){
    super(props);
    this.columns = [{
      title: '规则名称',
      dataIndex: 'comment',
    },{
      title: '接口',
      dataIndex: 'wanid',      
      render: text => {
        switch(text){
          case 0: 
          return <span>ALL</span>
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
      title: '协议',
      dataIndex: 'proto',      
      render: text => {
        return <span>{text.toUpperCase()}</span>
      }  
    },{
      title: '起始IP',
      dataIndex: 'src_ip_start',
    },{
      title: '结束IP',
      dataIndex: 'src_ip_end',
    },{
      title: '目的IP',
      dataIndex: 'dest_ip',
    },{
      title: '子网掩码',
      dataIndex: 'dest_netmask',
    },{
      title: '起始端口',
      dataIndex: 'port_start',
    },{
      title: '目的端口',
      dataIndex: 'port_end',
    },];
  }

  state={
		wanid:	1,
    multiwan_list:	[{
      "wanid":	0,
      "interface":	"all"
    }, {
      "wanid":	1,
      "interface":	"wan1"
    }],
    policy_router_list:	[/*{
      "src_ip_start": "192.168.0.2",
      "src_ip_end": "192.168.0.4",
      "dest_ip":"192.168.7.1",
      "dest_netmask":"255.255.255.0",
      "port_start":12,
      "port_end": 553,
      "proto":"all",
      "wanid":"1",
      "comment":"1234"//规则名
    },
    {
      "src_ip_start": "192.168.0.2",
      "src_ip_end": "192.168.0.6",
      "dest_ip":"192.168.7.1",
      "dest_netmask":"255.255.255.0",
      "port_start":44,
      "port_end": 553,
      "proto":"all",
      "wanid":"1",
      "comment":"1234"
    }*/]
  }

  componentDidMount(){
    this.getMwan3PolicyConfig()
  }
  
  getMwan3PolicyConfig=()=>{
    
    let policy_router_list = []
    let values ={...cgidata.cgidata99};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){     
          let wanid = 1;
          /**判断一个值，看wanid是否在列表中，在则为wanid，不在则为1，给变量 */
          let wanidState = res.result.multiwan_list.some(element => {
            return (element.wanid == res.result.wanid)
          });
          if(wanidState == true){
            wanid = res.result.wanid
          }
          if(res.result.policy_router_list){            
            policy_router_list = res.result.policy_router_list.map((item, index) => {
              item.key = index;
              return item;
            });
          }
          this.setState({
            wanid:wanid,
            policy_router_list:policy_router_list,
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
  
  /**增加条目，一个新的MODEL里的内容 */
  handleAddListItem=()=>{
    this.setState({
      visible1: true,
  });
  }
  /**删除条目，参数为已删除的条目内容 */
  handleDeleteSelectList=(listContent)=>{
    this.setState({
      policy_router_list:listContent
    })
    this.handleSendData(listContent)
    
    this.getMwan3PolicyConfig()
  }
  
  /**操作表格（增/删）都会发送到后台 */
  handleSendData=(policy_router_list)=>{
    let values ={...cgidata.cgidata100,policy_router_list};      
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
    let policy_router_list = this.state.policy_router_list
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
      message.error('起始端口不能大于目的端口！')
      return false
    }

    if(policy_router_list.length>=10){
      message.error('添加数目不能超过10条！')
      return false
    }
    /**判断起始IP是否小于结束IP */
      //TODO
      
    if(policy_router_list.length<1)
        flag = true;
    else{
      //some会遍历所有的元素，会影响flag， 我们只要发现不同就跳出
      //Array.some() :检测数组中是否有元素都满足条件
      //Array.every(): 检测数组的所有元素是否都满足条件
      flag = policy_router_list.every(item=>{
        if(item.dest_ip == addItem.dest_ip){
              Modal.error({
                  title: '添加失败',
                  content: `IP ：${addItem.dest_ip}已经存在!`,
              });
          }          
          /**所有的元素都与输入的元素不同 */  
          return (item.dest_ip != addItem.dest_ip)
      })
    }
    
    if(flag){      
        let value = addItem
        policy_router_list.push(value)
        this.setState({
            visible1: false,
            policy_router_list
        });
        this.handleSendData(policy_router_list)
    }
  }    
  render() {   
    return (
          <Card title="策略路由设置">

            <ListOfCR
              columns={this.columns}
              dataSource={this.state.policy_router_list}
              handleAddListItem={this.handleAddListItem}
              handleDeleteSelectList={this.handleDeleteSelectList}
            />

            <Modal
                title="添加条目"
                visible={this.state.visible1}
                onOk={this.addListItem}
                onCancel={this.hideModal1}
                destroyOnClose={true}
                maskClosable={false}
                okText="确认"
                cancelText="取消"
            >
            
                <AddListItem 
                    wanid={this.state.wanid}
                    hideModal1={this.hideModal1}
                    multiwan_list={this.state.multiwan_list}
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
    wanid:this.props.wanid,
    multiwan_list:this.props.multiwan_list,
    ip_addr:''
  }
  
  
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props ) {
        this.setState({
          wanid:nextProps.wanid,
          multiwan_list:nextProps.multiwan_list,
        })
    }
  }

  selectIpMac=(ipaddr,macaddr)=>{
       this.setState({
        ip_addr:ipaddr
      });
  }
  
  renderMulitiWan=(multiwan_list)=>{      
    return multiwan_list.map((item)=>{
      return (
        <Option value={item.wanid} >{item.interface.toUpperCase()}</Option>
      )
    })
  }
  
  handleChangeWanid=(value)=>{
    this.setState({wanid:value})
  }
  render(){
      const { getFieldDecorator }  =this.props.form;
      const formItemLayoutModel = {
          labelCol: {span: 6},
          wrapperCol: {span: 16}
      };

      return (
          <Form>
                  <Form.Item {...formItemLayoutModel} label="规则名称">
                  {getFieldDecorator('comment', {
                      rules: [{ required: true, message: '规则名称不能为空!' }], 
                      initialValue:''
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="接口">
                  {getFieldDecorator('wanid', {
                      initialValue:this.state.wanid
                  })(
                    <Select /*value={this.state.wanid}*/ onChange={this.handleChangeWanid}>
                      {this.renderMulitiWan(this.state.multiwan_list)}
                    </Select>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="协议">
                  {getFieldDecorator('proto', {
                      initialValue:'all'
                  })(
                    <Select /*defaultValue={0} */>
                      <Option value="all">TCP+UDP</Option>
                      <Option value="tcp">TCP</Option>
                      <Option value="udp">UDP</Option>
                    </Select>   
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="起始IP地址">
                  {getFieldDecorator('src_ip_start', {
                      rules: [{ required: true, message: '起始IP地址不能为空!' },
                          {
                              pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                              message:'起始IP地址格式不正确！'
                         }], 
                      initialValue:''
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="结束IP地址">
                  {getFieldDecorator('src_ip_end', {
                      rules: [{ required: true, message: '结束IP地址不能为空!' },
                          {
                              pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                              message:'结束IP地址格式不正确！'
                         }], 
                      initialValue:''
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="目的IP地址">
                  {getFieldDecorator('dest_ip', {
                      rules: [{ required: true, message: '目的IP地址不能为空!' },
                          {
                              pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                              message:'目的IP地址格式不正确！'
                         }], 
                      initialValue:''
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="目的子网掩码">
                  {getFieldDecorator('dest_netmask', {
                      rules: [{ required: true, message: '目的子网掩码地址不能为空!' },
                          {
                            pattern:new RegExp('^(254|252|248|240|224|192|128|0)\\.0\\.0\\.0$|^(255\\.(254|252|248|240|224|192|128|0)\\.0\\.0)$|^(255\\.255\\.(254|252|248|240|224|192|128|0)\\.0)$|^(255\\.255\\.255\\.(254|252|248|240|224|192|128|0))$'),
                            message:'目的子网掩码地址格式不正确！'
                         }], 
                      initialValue:''
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="起始端口">
                  {getFieldDecorator('port_start', {
                      rules: [{ required: true, message: '起始端口不能为空!' },
                      {                             
                        pattern:new RegExp('^([1-9]|\\d{2,4}|[1-5]\\d{4}|6[0-5][0-5][0-3][0-5])$'),
                        message:'端口只能为1-65535！'
                      }],
                      initialValue:''
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="结束端口">
                  {getFieldDecorator('port_end', {
                      rules: [{ required: true, message: '起始端口不能为空!' },
                      {                             
                        pattern:new RegExp('^([1-9]|\\d{2,4}|[1-5]\\d{4}|6[0-5][0-5][0-3][0-5])$'),
                        message:'端口只能为1-65535！'
                      }],
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

