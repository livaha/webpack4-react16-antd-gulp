
import React from 'react';
import { Radio,Select, Card ,Form,Table,Button,Modal,Input,message} from 'antd';
import axios from '@/axios'
import {ipPoolRange,ipRangeisExist} from '@/utils/utils'
import {cgidata} from '@/pages/cgidata'
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'

const { Option } = Select;
const RadioGroup = Radio.Group;
const columns = [{
  title: '起始ip地址',
  dataIndex: 'start_ip',
},{
  title: '结束ip地址',
  dataIndex: 'end_ip',
}, {
  title: '上行速率(Mbps)',
  dataIndex: 'up_bw',
}, {
  title: '下行速率(Mbps)',
  dataIndex: 'down_bw',
}, {
  title: '描述',
  dataIndex: 'desc',
}];

export default class NoMatch extends React.Component{    
 
  state={
    
    selectedRowKeys: [], 
		qos_mode:	0,//qos_mode : 0 Disable（关闭）  1 Smart Mode（智能模式） 2 IP Mode（IP 流控）
		smart_qos_mode:	0,// 0 default mode (默认模式) 2 Office Mode（办公模式）  3 Gaming Mode（游戏模式）4 Advance Mode （高级模式）
		smart_qos_priority:	"0,3,0,0,4,2",//只有模式为高级模式才提交，这是默认值，不要删
		minip:	"192.168.7.0",
		maxip:	"192.168.8.255",
		iplimit:	[/*{
				"start_ip":	"192.168.7.111",
				"end_ip":	"192.168.7.222",
				"up_bw":	1000,
				"down_bw":	1,
				"desc":	"aaa"
			},{
				"start_ip":	"192.168.7.33",
				"end_ip":	"192.168.7.44",
				"up_bw":	1000,
				"down_bw":	2,
				"desc":	"aaa"
			},{
				"start_ip":	"192.168.7.15",
				"end_ip":	"192.168.7.26",
				"up_bw":	1000,
				"down_bw":	3,
				"desc":	"aaa"
			},{
				"start_ip":	"192.168.7.7",
				"end_ip":	"192.168.7.12",
				"up_bw":	1000,
				"down_bw":	4,
				"desc":	"aaa"
			}*/]
  }

  componentDidMount(){
    this.getSmartQosConfig()
  }
  
  getSmartQosConfig=()=>{

    let values ={...cgidata.cgidata57};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
        let {qos_mode,smart_qos_mode,smart_qos_priority,minip,maxip,iplimit}=res.result
        if(!smart_qos_priority) smart_qos_priority="0,3,0,0,4,2"
        this.setState({qos_mode,smart_qos_mode,smart_qos_priority,minip,maxip,iplimit})
      })
  }
  changeQosMode=(value)=>{
    this.setState({
      qos_mode:value
    })
  }

  changeSmartQosMode = (e) => {
    this.setState({
      smart_qos_mode: e.target.value,
    });
  }
  renderAdvanceRadio=()=>{      
      return (
        <div>
            <Radio value="0">最高</Radio>
            <Radio value="1">高</Radio>
            <Radio value="2">中</Radio>
            <Radio value="3">低</Radio>
            <Radio value="4">最低</Radio>
        </div>
      )
  }

  /**arg:选择的radio是第几个 ， index:修改smart_qos_priority的第几个
   * priorityArr:smart_qos_priority转换后的数组
   */
  changePriority=(arg,index,priorityArr)=>{
    let value = arg[0].target.value
    priorityArr[index]=value;
    this.setState({
      smart_qos_priority:priorityArr.toString()
    })
  }
  handleAddRules=()=>{    
    this.setState({
      visible: true,
    });
  }
  hideModal=()=>{    
    this.setState({
      visible: false,
    });
  }
  handleDeleteSelectList=()=>{
    let dataList = this.state.iplimit
    Modal.confirm({
      title: '确认删除',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk:()=>{
          let selectedRowKeys = this.state.selectedRowKeys
          selectedRowKeys.forEach(function (value, index) {
            dataList = dataList.filter((item,index) => index !== value)
          })
          this.setState({
            selectedRowKeys: [],
            iplimit:dataList
          })
      },
      onCancel() {
        //console.log('Cancel');
      },
  });
  }

  handleAddRulesItem=()=>{

    this.addIpRulesForm.props.form.validateFields((err, values) => {
      if (!err) {
        //console.log(values)

        let iplimit = this.state.iplimit;
        if(iplimit.length>=10){          
          message.error("增加条目不能超过10条！")
          return false;
        }
          let iplimit_item = values    
          /**返回true为在符合IP段里面 */
          if(ipPoolRange(this.state.minip,this.state.maxip,values.start_ip,values.end_ip)){
            /**判断是否已经存在此IP断 */
            if(ipRangeisExist(iplimit,values.start_ip,values.end_ip)){
              iplimit.push(iplimit_item)
              this.setState({
                visible:false,
                iplimit
              })
            }
          }
      }      
    });   
  }

  handleSendData=()=>{
    
    let {qos_mode,smart_qos_mode,smart_qos_priority,iplimit}=this.state
    let values;
    if(smart_qos_mode==4){//只有高级模式才提交smart_qos_priority
      
      values ={...cgidata.cgidata58,qos_mode,smart_qos_mode,smart_qos_priority,iplimit};    
    }else{

      values ={...cgidata.cgidata58,qos_mode,smart_qos_mode,iplimit};    
    }  
      axios.ajax_post({
        data:values
      }).then((res)=>{
        if(res.restcode == 2000){   
          message.success('设置成功')
        }
      }).then((res)=>{
        
        this.getSmartQosConfig()
      })
  }

  render() {   
    let {qos_mode,smart_qos_mode,smart_qos_priority,minip,maxip,iplimit}=this.state
    //console.log(qos_mode,smart_qos_mode,smart_qos_priority,minip,maxip,iplimit)
    let priorityArr = smart_qos_priority.split(',')
    //console.log(priorityArr)
    const {  selectedRowKeys } = this.state;
    const rowSelection = {
    selectedRowKeys,
    onChange:(selectedRowKeys) => {
      this.setState({ selectedRowKeys });
    } ,
    };        
    const hasSelected = iplimit.length!=0 && selectedRowKeys.length > 0;
    
    return (
          <Card title="QOS设置">
            
            <Form.Item {...formItemLayout} label="QOS模式">
              <Select value={qos_mode } style={{width:120}}  onChange={this.changeQosMode}>
                <Option value={0}>关闭</Option>
                <Option value={1}>智能流控</Option>
                <Option value={2}>IP流控</Option>
              </Select>     
              
            </Form.Item>
            {
              qos_mode==0?

              <Form.Item {...tailFormItemLayout}>
              <Button type="primary"
                      onClick={this.handleSendData}                            
                  >应用</Button>
              </Form.Item>
              :null
            }
            {
              qos_mode==1?<div>

              <Form.Item {...formItemLayout} label="智能流控">
                <RadioGroup onChange={this.changeSmartQosMode} value={smart_qos_mode}>
                  <Radio value={0}>默认模式</Radio>
                  <Radio value={1}>办公模式</Radio>
                  <Radio value={2}>游戏模式</Radio>
                  <Radio value={3}>下载模式</Radio>
                  <Radio value={4}>高级模式</Radio>
                </RadioGroup>
              </Form.Item>
              {
                smart_qos_mode==4?<div>
                  
              <Form.Item {...formItemLayout} label="HTTP上网">
                <RadioGroup onChange={(...arg)=>this.changePriority(arg,0,priorityArr)} value={priorityArr[0]}>
                  {this.renderAdvanceRadio()}
                </RadioGroup>
              </Form.Item>
              <Form.Item {...formItemLayout} label="HTTP下载">
                <RadioGroup onChange={(...arg)=>this.changePriority(arg,1,priorityArr)} value={priorityArr[1]}>
                  {this.renderAdvanceRadio()}
                </RadioGroup>
              </Form.Item>
              <Form.Item {...formItemLayout} label="HTTPS上网">
                <RadioGroup onChange={(...arg)=>this.changePriority(arg,2,priorityArr)} value={priorityArr[2]}>
                  {this.renderAdvanceRadio()}
                </RadioGroup>
              </Form.Item>
              <Form.Item {...formItemLayout} label="小包">
                <RadioGroup onChange={(...arg)=>this.changePriority(arg,3,priorityArr)} value={priorityArr[3]}>
                  {this.renderAdvanceRadio()}
                </RadioGroup>
              </Form.Item>
              <Form.Item {...formItemLayout} label="P2P下载">
                <RadioGroup onChange={(...arg)=>this.changePriority(arg,4,priorityArr)} value={priorityArr[4]}>
                  {this.renderAdvanceRadio()}
                </RadioGroup>
              </Form.Item>
              <Form.Item {...formItemLayout} label="其它">
                <RadioGroup onChange={(...arg)=>this.changePriority(arg,5,priorityArr)} value={priorityArr[5]}>
                  {this.renderAdvanceRadio()}
                </RadioGroup>
              </Form.Item>
              
                </div>:null
              }
              

            <Form.Item {...tailFormItemLayout}>
            <Button type="primary"
                    onClick={this.handleSendData}                            
                >应用</Button>
            </Form.Item>
              </div>:null
            }

            {
              qos_mode==2?<div>

                
              <Table
                  bordered
                  columns={columns}
                  dataSource={iplimit}
                  rowSelection={rowSelection}
                  pagination={false}
                  fixed={false}
                  footer={() => 
                  <div>
                      <Button style={{marginRight:20}}  
                          onClick={this.handleAddRules}                            
                      >增加条目</Button>

                      <Button type="danger" style={{marginRight:20}}  
                          onClick={this.handleDeleteSelectList} 
                          disabled={!hasSelected}
                      >删除所选</Button>
                      
                    <Button type="primary"
                            onClick={this.handleSendData}                            
                        >应用</Button>
                  </div>
                  }
              />

            <Modal
                title="增加条目"
                visible={this.state.visible}
                onOk={this.handleAddRulesItem}
                onCancel={this.hideModal}
                maskClosable={false}
                destroyOnClose={true}
                okText="确认"
                cancelText="取消"
            >
            <AddIpRules 
                wrappedComponentRef={(inst)=>{this.addIpRulesForm = inst;}}
            />
            </Modal>

              </div>:null
            }
          </Card>
    )
  }
}


class AddIpRules extends React.Component{

  render(){
      const { getFieldDecorator }  =this.props.form;
      const formItemLayoutModel = {
          labelCol: {span: 6},
          wrapperCol: {span: 16}
      };
      
      return (
          <Form>
                  <Form.Item {...formItemLayoutModel} label="起始IP地址">
                  {getFieldDecorator('start_ip', {
                      rules: [
                          { required: true, message: 'ip地址不能为空!' },
                          {
                            pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                            message:'IP地址格式不正确！'
                         }], 
                      initialValue:''
                  })(
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="结束IP地址">
                  {getFieldDecorator('end_ip', {
                      rules: [
                          { required: true, message: 'ip地址不能为空!' },
                          {
                            pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                            message:'IP地址格式不正确！'
                         }], 
                      initialValue:''
                  })(
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="上行速率(Mbps)">
                  {getFieldDecorator('up_bw', {
                      rules: [{ required: true, message: '上行速率不能为空!' },
                      {
                        pattern:new RegExp('^([1-9]|\\d{2,3}|1000)$'),
                        message:'上行速率只能为1-1000！'
                     }], 
                      initialValue:''
                  })(                        
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="下行速率(Mbps)">
                  {getFieldDecorator('down_bw', {
                      rules: [{ required: true, message: '下行速率不能为空!' },
                      {
                        pattern:new RegExp('^([1-9]|\\d{2,3}|1000)$'),
                          message:'下行速率只能为1-1000！'
                     }], 
                      initialValue:''
                  })(                        
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutModel} label="描述">
                  {getFieldDecorator('desc', {
                      rules: [
                      {
                          //pattern:new RegExp('^[a-zA-Z0-9]{0,32}$'),
                          //message:'请输入不超过32位的数字或字母！',
                          pattern:new RegExp('^.{0,32}$'),
                          message:'请输入不超过32位的字符！'
                     }], 
                      initialValue:''
                  })(
                      <Input />
                  )}
                  </Form.Item>
              </Form>
      )
  }

}

AddIpRules = Form.create({})(AddIpRules);