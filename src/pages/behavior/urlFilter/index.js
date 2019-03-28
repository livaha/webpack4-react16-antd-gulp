
import React from 'react';
import { Modal,Switch,Input,Form, Card,message } from 'antd';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import {formItemLayout} from '@/config/input_layout'
import ListOfCR from '@/components/ListOfCR'

export default class NoMatch extends React.Component{        
  constructor(props){
    super(props);
    this.columns = [ {
      title: 'URL',
      dataIndex: 'url',
    }];
  }
  state={
    url_filter:false,
    urlfilter_list:	[/*{
      "url":	"www.baidu.com"
    }, {
      "url":	"www.axilspot.com"
    }*/]
  }
  componentDidMount(){
    this.getUrlFilterConfig()
  }
  getUrlFilterConfig=()=>{

    let urlfilter_list = []
    let values ={...cgidata.cgidata74};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          if(res.result.urlfilter_list){            
            urlfilter_list = res.result.urlfilter_list.map((item, index) => {
              item.key = index;
              return item;
            });
          }
          this.setState({
            url_filter:res.result.url_filter,
            urlfilter_list:urlfilter_list
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
      url_filter:checked
    })
    
    this.handleSendData(checked,this.state.urlfilter_list)
    
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
      urlfilter_list:listContent
    })
    this.handleSendData(this.state.url_filter,listContent)
    
    this.getUrlFilterConfig()
  }
  
  addListItem = () => {
    let flag = false    
    let addItem={}
    let formatErr = false //false为格式正确
    let urlfilter_list = this.state.urlfilter_list
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
      
    if(urlfilter_list>=10){
      message.error('添加数目不能超过10条！')
      return false
    }
      
    if(urlfilter_list.length<1)
        flag = true;
    else{
      //some会遍历所有的元素，会影响flag， 我们只要发现不同就跳出
      //Array.some() :检测数组中是否有元素都满足条件
      //Array.every(): 检测数组的所有元素是否都满足条件
      flag = urlfilter_list.every(item=>{
        if(item.url == addItem.url){
              Modal.error({
                  title: '添加失败',
                  content: `URL ：${addItem.url}已经存在!`,
              });
          }          
          /**所有的元素都与输入的元素不同 */  
          return (item.url != addItem.url)
      })
    }
    
    if(flag){      
        let value = addItem
        urlfilter_list.push(value)
        this.setState({
            visible1: false,
            urlfilter_list
        });
        this.handleSendData(this.state.url_filter,urlfilter_list)
    }
  }    
  
  /**操作表格（增/删）都会发送到后台 */
  handleSendData=(url_filter=this.state.url_filter,urlfilter_list=this.state.urlfilter_list)=>{
    
    let values ={...cgidata.cgidata75,url_filter,urlfilter_list};      
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
          <Card title="URL过滤">
          <Form.Item {...formItemLayout} label="URL过滤设置">
            <Switch 
                style={{marginBottom:20}}
                checkedChildren="开" 
                unCheckedChildren="关" 
                defaultChecked
                checked={this.state.url_filter}
                onChange={this.handleSwitchChange}
            />
            </Form.Item>
          {
            this.state.url_filter==false?null:
            <div>
              <ListOfCR
              columns={this.columns}
              dataSource={this.state.urlfilter_list}
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
  render(){
      const { getFieldDecorator }  =this.props.form;
      const formItemLayoutModel = {
          labelCol: {span: 6},
          wrapperCol: {span: 16}
      };
      return (
          <Form>
                  <Form.Item {...formItemLayoutModel} label="URL">
                  {getFieldDecorator('url', {
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
              </Form>
      )
  }

}

AddListItem = Form.create({})(AddListItem);