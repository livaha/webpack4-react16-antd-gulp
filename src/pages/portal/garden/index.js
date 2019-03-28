
import { Table,Modal, Card,Button,Icon, message,Form,Input  } from 'antd';
import React from 'react';
import ArpList from '@/components/ArpList'

import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
/**1处开启定时器：进来的时候开始定时器；2处清理定时器：unmount时，返回时 */

export default class Garden extends React.Component{     
  
  constructor(props) {
    super(props);

    this.aclColumns = [{
      title: 'MAC地址',
      dataIndex: 'garden_mac',
      key:'1'
    },{
      title: '移出白名单',
      dataIndex: 'garden_mac',
      key:'2',
      render: (text, record) => (
        <a><Icon type="delete" style={{color:'red',fornSize:"18px"}} onClick={()=>this.deletePortalWallGardenMac(text)}    /></a>      
      )
    }];

  }
  state={
		garden_list:	[/*{
				"garden_mac":	"00:E0:4C:36:15:3D"
			}, {
				"garden_mac":	"00:E0:4C:36:15:34"
			}*/]
  }
  
  componentDidMount(){    
    /**获取portal 白名单配置 */
    this.getPortalWallGardenConfig()

  }
  /**获取portal 白名单配置 */
  getPortalWallGardenConfig=()=>{
    let data ={...cgidata.cgidata106};      
      axios.ajax_post({
        data:data
      }).then((res)=>{
        if(res.restcode == 2000){ 
         this.setState({
          garden_list:res.result.garden_list,
          })
        }
      })
  }
    /**增加portal 白名单mac */
    addPortalWallGardenMac=(garden_mac)=>{
      garden_mac=garden_mac.toUpperCase()
      let data ={...cgidata.cgidata107,garden_mac};      
        axios.ajax_post({
          data:data
        }).then((res)=>{
          if(res.restcode == 2000){ 
            /**重新获取ACL列表信息 */
            this.getPortalWallGardenConfig()
          }
        })
    }
  
  /**删除portal 白名单mac */
  deletePortalWallGardenMac=(garden_mac)=>{
    let data ={...cgidata.cgidata108,garden_mac};      
      axios.ajax_post({
        data:data
      }).then((res)=>{
        if(res.restcode == 2000){ 
          /**重新获取ACL列表信息 */
          this.getPortalWallGardenConfig()
        }
      })
  }
      
  handleAddList=()=>{
    this.setState({
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

  hideModal1 = () => {
    this.setState({
        visible1: false,
    });
  }
  
  addListItem = () => {
    let flag = false    
    let addItem={}
    let formatErr = false //false为格式正确
    let garden_list = this.state.garden_list
    this.addItemForm.props.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          addItem = values
          formatErr = false
        }else{
          formatErr = true
        }
    });   
    //validateFields输入的格式不对则返回重新
    if  (formatErr)  
      return false;

    if(garden_list>=10){
      message.error('添加数目不能超过10条！')
      return false
    }
      
    if(garden_list.length<1)
        flag = true;
    else{
      //some会遍历所有的元素，会影响flag， 我们只要发现不同就跳出
      //Array.some() :检测数组中是否有元素都满足条件
      //Array.every(): 检测数组的所有元素是否都满足条件
      flag = garden_list.every(item=>{
        if(item.garden_mac == addItem.garden_mac){
              Modal.error({
                  title: '添加失败',
                  content: `MAC ：${addItem.garden_mac}已经存在!`,
              });
          }          
          /**所有的元素都与输入的元素不同 */  
          return (item.garden_mac != addItem.garden_mac)
      })
    }
    
    if(flag){      
        let value = addItem
        garden_list.push(value)
        this.setState({
            visible1: false,
            garden_list
        });
        this.addPortalWallGardenMac(addItem.garden_mac)
    }
  }    
  

  render() {   
    return (
      <div>
          <Card title="portal白名单">
            
          <Table
                  bordered
                  columns={this.aclColumns}
                  dataSource={this.state.garden_list}
                  //pagination={false}
                  footer={() => 
                    <div>
                        <Button style={{marginRight:20}}  
                            onClick={this.handleAddList}                            
                        >增加条目</Button>
      
                    </div>
                    }
              />
              
          <Modal
              title="添加ARP条目"
              visible={this.state.visible1}
              onOk={this.addListItem}
              onCancel={this.hideModal1}
              destroyOnClose={true}
              okText="确认"
              cancelText="取消"
          >
            <AddARPItem 
                garden_mac={this.state.garden_list.garden_mac} 
                handleScanArpList = {this.handleScanArpList.bind(this)}
                wrappedComponentRef={(inst)=>{this.addItemForm = inst;}}
            />
          </Modal>

          </Card>

          
    </div>
    )
  }
}


class AddARPItem extends React.Component{
  state={
    garden_mac:this.props.garden_mac
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props ) {   //刷新form表单
      //this.props.form.resetFields();
      this.setState({
        garden_mac:nextProps.garden_mac
      })
    }
  }

  selectIpMac=(ipaddr,macaddr)=>{
    this.setState({
      garden_mac:macaddr
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
                  {getFieldDecorator('garden_mac', {
                      rules: [{ required: true, message: 'MAC地址不能为空!' },
                      {
                          pattern:new RegExp('^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$'),
                          message:'MAC地址格式不正确！'
                     }], 
                      initialValue:this.state.garden_mac
                  })(                        
                      <Input />
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

AddARPItem = Form.create({})(AddARPItem);
