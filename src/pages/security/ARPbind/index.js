import React from 'react';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import { Card, Form, Table, Input, Button,Modal,Switch} from 'antd';
import {formItemLayout} from '@/config/input_layout'

const arpcolumns = [{
  title: 'ip地址',
  dataIndex: 'ip',
}, {
  title: 'mac地址',
  dataIndex: 'mac',
}];

export default class NoMatch extends React.Component{      
  constructor(props){
    super(props);
    this.arpBindcolumns = [{
      title: 'ip地址',
      dataIndex: 'ipaddr',
    }, {
      title: 'mac地址',
      dataIndex: 'macaddr',
    }, {
      title: '操作',
      dataIndex: 'action',
      //render: () => <Button type="danger" >Delete</Button>,
      render: (text, record) => (
         this.state.result.arpbind_list.length >= 1
          ? (
          <Button type="danger" onClick={() => this.handleDeleteItem(record.key,this.state.result.arpbind_list)} >删除</Button>
          ) : null
      ),
    }];
  }

  state={
    result:{
      enable:false,      
      arpbind_list:[],
    },
    arpList : [],
    selectedRowKeys: [], // Check here to configure the default column
    ipaddr:''    ,
    macaddr:''
  }
  
  componentDidMount(){
    this.getArpBindListmsg();
  }

  getArpBindListmsg=()=>{
    let stateResult=this.state.result
    let arpbind_list = []
    let values ={...cgidata.cgidata24};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
            arpbind_list = res.result.arpbind_list.map((item, index) => {
                item.key = index;
                return item;
            });
            stateResult.arpbind_list = arpbind_list
            stateResult.enable = res.result.enable
            this.setState({result:stateResult})
          }
      })
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
  
  /**发送配置请求 */
  sendArpBindMsg=(stateResult)=>{
    this.setState({result:stateResult})
    let values ={...cgidata.cgidata25,...stateResult};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          //console.log('success')
        }
    }).then((res)=>{      
      /**重新请求数据吧,将列表重新赋值key，不要怕多次请求 */
      this.getArpBindListmsg();
    })
  }
    
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
    
  handleAddList=()=>{
    this.setState({
        visible1: true,
    });
  }
  
  hideModal1 = () => {
    this.setState({
        visible1: false,
    });
  }

  hideModal2 = () => {
    this.setState({
        visible2: false,
        visible1: true,
    });
  }

  handleScanArpList=()=>{
    this.setState({
        visible2: true,
        visible1:false
      });
    this.getArpListmsg()
  }
  onRowClick=(selectedRows, selectedRowKeys) => {
    this.setState({
        visible2: false,
        visible1: true,
        ipaddr :selectedRows.ip,
        macaddr :selectedRows.mac
    });
  }

  handleSwitchChange=(checked)=>{ 
    //发送开关请求，并设置enable
    let stateResult = this.state.result
    stateResult.enable = checked;
    this.sendArpBindMsg(stateResult)
  }

  handleDeleteItem = (key,dataList) => {
    Modal.confirm({
        title: '确认删除',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk:() =>{
          let stateResult = this.state.result
          //dataList = dataList.filter(item => item.key !== key)
          //删除数组的第key条
          dataList.splice(key,1)          
          stateResult.arpbind_list = dataList
          this.sendArpBindMsg(stateResult)        
        },
        onCancel() {
        },
    }); 
  }
    
  handleDeleteDhcpSelectList = (selectList)=>{    
    Modal.confirm({
      title: '确认删除',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk:() =>{
        let stateResult = this.state.result
        let selectedRowKeys = this.state.selectedRowKeys
        //删除指定多个下标的数组 如arr[,,,,,] 删除下标为[1,3,4]
        //通过给定key，过滤掉下标与key相同的值 
        selectedRowKeys.forEach(function (value,index) {          
            selectList = selectList.filter(item => {              
              return (item.key !== value)
            })    
        })
        this.setState({selectedRowKeys: []})
        stateResult.arpbind_list = selectList
        this.sendArpBindMsg(stateResult)      
      },
      onCancel() {
      },
    });    
  }

  addArpBindListItem = () => {
    //添加条目，将输入的内容放到state.result中，随后发送请求
    let stateResult = this.state.result;        
    let flag = false    
    let formatErr = false //false为格式正确
    let arpBindItem={}
    this.addArpItemForm.props.form.validateFields((err, values) => {
        if (!err) {
          arpBindItem = values
          formatErr = false
        }
        else{
          formatErr = true
        }
    });   
    //validateFields输入的格式不对则返回重新
    if  (formatErr)  
      return false;

    if(stateResult.arpbind_list.length<1)
        flag = true
    else{
      //some会遍历所有的元素，会影响flag， 我们只要发现不同就跳出
      //Array.some() :检测数组中是否有元素都满足条件
      //Array.every(): 检测数组的所有元素是否都满足条件
      flag = stateResult.arpbind_list.every(item=>{
          //console.log(item)
          if(item.ipaddr == arpBindItem.ip){
              Modal.error({
                  title: '添加失败',
                  content: `IP ：${arpBindItem.ip}已经存在!`,
                });
          }
          else if(item.macaddr == arpBindItem.mac){
              Modal.error({
                  title: '添加失败',
                  content: `MAC ：${arpBindItem.mac}已经存在!`,
              });
          }          
          /**所有的元素都与输入的元素不同 */  
          return (item.ipaddr != arpBindItem.ip && item.macaddr != arpBindItem.mac)
      })
    }
    //console.log(flag)
    if(flag){      
        let value = {ipaddr:arpBindItem.ip,macaddr:arpBindItem.mac.toUpperCase(),/*key:stateResult.arpbind_list.length*/}
        stateResult.arpbind_list.push(value)
        this.sendArpBindMsg(this.state.result)
        this.setState({
            visible1: false,
        });
    }
}    

  render(){
    //console.log(this.state.result.arpbind_list,this.state.result.enable)
    const {  selectedRowKeys } = this.state;
    const rowSelection = {
    selectedRowKeys,
    onChange: this.onSelectChange,
    };      
    const hasSelected = this.state.result.arpbind_list.length!=0 && selectedRowKeys.length > 0;
      return (
      
        <Card title="ARP绑定列表">
        <Form.Item {...formItemLayout} label="ARP绑定设置">   
          <Switch 
              style={{marginBottom:20}}
              checkedChildren="开" 
              unCheckedChildren="关" 
              defaultChecked
              checked={this.state.result.enable}
              onChange={this.handleSwitchChange}
          />
          </Form.Item>
          {this.state.result.enable==false?null:
          <div>
          <Table
              bordered
              columns={this.arpBindcolumns}
              dataSource={this.state.result.arpbind_list}
              rowSelection={rowSelection}
              pagination={false}
              fixed={false}
              footer={() => 
              <div>
                  <Button style={{marginRight:20}}  
                      onClick={this.handleAddList}                            
                  >增加条目</Button>

                  <Button type="danger"  
                      onClick={()=>this.handleDeleteDhcpSelectList(this.state.result.arpbind_list)} 
                      disabled={!hasSelected}
                  >删除所选</Button>
              </div>
              }
          />

          <Modal
              title="添加ARP条目"
              visible={this.state.visible1}
              onOk={this.addArpBindListItem}
              onCancel={this.hideModal1}
              destroyOnClose={true}
              okText="确认"
              cancelText="取消"
          >
            <AddARPItem 
                ipaddr={this.state.ipaddr} 
                macaddr={this.state.macaddr} 
                handleScanArpList = {this.handleScanArpList.bind(this)}
                wrappedComponentRef={(inst)=>{this.addArpItemForm = inst;}}
            />
          </Modal>
          
          <Modal
            title="ARP列表"
            visible={this.state.visible2}
            maskClosable={false}
            onCancel={this.hideModal2}
            destroyOnClose={true}
            footer={<Button onClick={this.hideModal2}                        
            >关闭</Button>}
          >
              
            <Table
                bordered
                columns={arpcolumns}
                dataSource={this.state.arpList}
                pagination={false}
                onRowClick={this.onRowClick}
            />
          </Modal>
          </div>
        }
      </Card>
    )      
  }
}


class AddARPItem extends React.Component{
  state={
    ipaddr :this.props.ipaddr,
    macaddr:this.props.macaddr
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props ) {   //刷新form表单
      //this.props.form.resetFields();
      this.setState({
        ipaddr: nextProps.ipaddr,
        macaddr:nextProps.macaddr
      })
    }
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
                  {getFieldDecorator('ip', {
                      rules: [
                          { required: true, message: 'ip地址不能为空!' },
                          {
                              pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                              message:'IP地址格式不正确！'
                         }], 
                      initialValue:this.state.ipaddr
                  })(
                      <Input/>
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="MAC地址">
                  {getFieldDecorator('mac', {
                      rules: [{ required: true, message: 'MAC地址不能为空!' },
                      {
                          pattern:new RegExp('^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$'),
                          message:'MAC地址格式不正确！'
                     }], 
                      initialValue:this.state.macaddr
                  })(                        
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...tailFormItemLayoutModel}>
                      <Button onClick={this.props.handleScanArpList}                        
                      >扫描</Button>
                  </Form.Item>
              </Form>
      )
  }

}

AddARPItem = Form.create({})(AddARPItem);