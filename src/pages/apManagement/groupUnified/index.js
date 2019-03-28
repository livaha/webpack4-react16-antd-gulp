import React from 'react';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import GroupSetting from '@/components/ApGroup'
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'
import { Card, Switch,Checkbox, Form, Button, Input, Select ,message} from 'antd';
const { Option } = Select;
/**ALL分组为0 ， default分组为1，
 * 这里默认没有ALL组，
 */

export default class NoMatch extends React.Component{    
  state={
    /**group_info数据可以为空，只用于测试 */
    group_info:	[/*{
        "gid":	"0",
        "groupname":	"ALL"
      }*/,{
        "gid":	"1",
        "groupname":	"default"
      }, {
        "gid":	"2",
        "groupname":	"xavier"
      }, {
        "gid":	"3",
        "groupname":	"hpluo"
      },],
      
		ssid_config:	{
			wid:	"1",
			gid:	"1",
			ssid_2g:	"aaaaaaaa",
			hide_2g:	"1",
			isolate_2g:	"1",
			encry_2g:	"1",
			passphrase_2g:	"bbbbbbbbbbbbbb",
			maxsta_2g:	"32",
			vlanid_2g:	"0",
			ssid_5g:	"aaaaaaaa",
			hide_5g:	"1",
			isolate_5g:	"1",
			encry_5g:	"1",
			passphrase_5g:	"bbbbbbbbbbbbbb",
			maxsta_5g:	"32",
			vlanid_5g:	"0"
		}
  }
  componentDidMount(){
    /**1 获取分组信息     */
    this.getGroupmsg();
    this.getSSIDmsg();
  }
  
  getGroupmsg=()=>{
    let values ={...cgidata.cgidata26};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
            let group_info = res.result.group_info;
            /*group_info.unshift({
                "gid":	"0",
                "groupname":	"ALL"
            })*/
            this.setState({group_info})
          }
      })
  }

  getSSIDmsg=(gid = "1")=>{
    let values ={gid,...cgidata.cgidata34};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
            this.setState({ssid_config:res.result.ssid_config})
          }
      })
  }

  /**处理group增删改 */
  handleAddGroupItem=(groupname)=>{
    groupname = groupname.state.value
    if(groupname=='' || groupname==undefined){ 
      message.error('组名不能为空！')
      return false
    }
    let values ={groupname,...cgidata.cgidata27};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          /**返回了一个gid， 将它组合push到组的数组里 */
          let item = {groupname:groupname,gid:res.result.gid}
          let group_info=this.state.group_info; 
          group_info.push(item)           
          this.setState({
            group_info,
          })
        }
    }).then((res)=>{
        this.getGroupmsg();
    })
  }

  handleEditGroupItem=(groupname,gid)=>{
    groupname = groupname.state.value
    if(groupname==''){ 
      message.error('组名不能为空！')
      return false
    }
    let values ={groupname,gid,...cgidata.cgidata29};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          //console.log('操作成功',res.result)        
        }
    }).then((res)=>{
      this.getGroupmsg();
    })
  }

  handleDelteGroupItem=(groupname,gid)=>{
    
    let values ={groupname,gid,...cgidata.cgidata28};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          //console.log('操作成功',res.result)    
        }
    }).then((res)=>{
      this.getGroupmsg();
    })
  }

  handleSetSSIDmsg=(values)=>{
    values ={...cgidata.cgidata35,...values};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){   
          message.success('设置成功')
          /*this.setState({
            ssid_config:values
          })*/
        }
    })
  }

  render(){
    return (
      <div>
        <Card title="AP群组统一设置">
          <GroupSetting group_info={this.state.group_info}
          handleAddGroupItem={this.handleAddGroupItem}
          handleEditGroupItem={this.handleEditGroupItem}
          handleDelteGroupItem={this.handleDelteGroupItem}
          getSSIDmsg={this.getSSIDmsg}
          />

          <GroupSSIDSetting_ 
            ssid_config={this.state.ssid_config}
            handleSetSSIDmsg={this.handleSetSSIDmsg.bind(this)}
            wrappedComponentRef={(inst)=>{this.ssidSettingForm = inst;}}
          />
        </Card>          
      </div>
      )        
    }
}

class GroupSSIDSetting extends React.Component{
    state={
      ssid_config:this.props.ssid_config,
      ssid2to1Enable : false
    }

    componentDidMount(){
      let ssid_config = this.state.ssid_config;
      //console.log("aaa",ssid_config,this.props.ssid_config)
      this.changeSSID2to1Enable(ssid_config)
    }

    componentWillReceiveProps(nextProps) {
      
      if (nextProps !== this.props ) {
        if(this.props.ssid_config!=nextProps.ssid_config){
            
          this.changeSSID2to1Enable(nextProps.ssid_config)
          this.setState({
            ssid_config:nextProps.ssid_config
          })
        }
      }
    }
    changeSSID2to1Enable=(ssid_config)=>{
        if(/*this.state.ssid2to1Enable == false &&*/
          ssid_config.ssid_2g == ssid_config.ssid_5g &&
          ssid_config.hide_2g == ssid_config.hide_5g &&
          ssid_config.isolate_2g == ssid_config.isolate_5g &&
          ssid_config.encry_2g == ssid_config.encry_5g &&
          ssid_config.passphrase_2g == ssid_config.passphrase_5g &&
          ssid_config.maxsta_2g == ssid_config.maxsta_5g 
          ){
            this.setState({
              ssid2to1Enable:true
            })
          }else{
            this.setState({
              ssid2to1Enable:false
            })
          }
    }
    handleSetSSIDmsg=(ssid_config)=>{            
      this.props.form.validateFields((err, values) => {
        if (!err) {
          //console.log(values)
          if(this.state.ssid2to1Enable){
            ssid_config.maxsta_2g = values.maxsta_2g
            ssid_config.maxsta_5g = values.maxsta_2g
            ssid_config.passphrase_2g = ssid_config.encry_2g=="0"?"":values.passphrase_2g
            ssid_config.passphrase_5g = ssid_config.encry_2g=="0"?"":values.passphrase_2g
            ssid_config.ssid_2g = values.ssid_2g
            ssid_config.ssid_5g = values.ssid_2g
            
            ssid_config.hide_5g = ssid_config.hide_2g
            ssid_config.isolate_5g = ssid_config.isolate_2g
            ssid_config.encry_5g = ssid_config.encry_2g
          }
          else{
            ssid_config.maxsta_2g = values.maxsta_2g
            ssid_config.maxsta_5g = values.maxsta_5g
            ssid_config.passphrase_2g = ssid_config.encry_2g=="0"?"":values.passphrase_2g
            ssid_config.passphrase_5g = ssid_config.encry_5g=="0"?"":values.passphrase_5g
            ssid_config.ssid_2g = values.ssid_2g
            ssid_config.ssid_5g = values.ssid_5g
          }
        }
        else{
          return false
        }
      });   
      this.props.handleSetSSIDmsg(ssid_config)
    }

    onChangeHide2g=(value)=>{
      value = value.target.checked
      let ssid_config = this.state.ssid_config
      if(value==true){
        ssid_config.hide_2g = "1"
      }else{        
        ssid_config.hide_2g = "0"
      }
      this.setState({
        ssid_config
      })
    }

    handleEncry2g=(value)=>{
      //console.log(value)
      let ssid_config = this.state.ssid_config
      if(value==1){
        ssid_config.encry_2g = "1"
      }else{        
        ssid_config.encry_2g = "0"
      }
      this.setState({
        ssid_config
      })
    }

    onChangeIsolate2g=(value)=>{
      value = value.target.checked
      //console.log(value)
      let ssid_config = this.state.ssid_config
      if(value==true){
        ssid_config.isolate_2g = "1"
      }else{        
        ssid_config.isolate_2g = "0"
      }
      this.setState({
        ssid_config
      })

    }


    onChangeHide5g=(value)=>{
      value = value.target.checked
      let ssid_config = this.state.ssid_config
      if(value==true){
        ssid_config.hide_5g = "1"
      }else{        
        ssid_config.hide_5g = "0"
      }
      this.setState({
        ssid_config
      })
    }

    handleEncry5g=(value)=>{
      //console.log(value)
      let ssid_config = this.state.ssid_config
      if(value==1){
        ssid_config.encry_5g = "1"
      }else{        
        ssid_config.encry_5g = "0"
      }
      this.setState({
        ssid_config
      })
    }

    onChangeIsolate5g=(value)=>{
      value = value.target.checked
      //console.log(value)
      let ssid_config = this.state.ssid_config
      if(value==true){
        ssid_config.isolate_5g = "1"
      }else{        
        ssid_config.isolate_5g = "0"
      }
      this.setState({
        ssid_config
      })

    }

    handleMultiFrequencyUnify=(value)=>{
      //console.log(value)      
      this.setState({
        ssid2to1Enable : value
      })
    }
    render(){
      const { getFieldDecorator } = this.props.form;
      const {ssid_config}=this.state
      
      return(
        <div>     
          <Card
            type="inner"
            title="SSID分组设置"
          >
          
          <Form>
              <Form.Item {...formItemLayout} label="多频合一">
                <Switch
                    checkedChildren="开" 
                    unCheckedChildren="关" 
                    checked={this.state.ssid2to1Enable}
                    onChange={this.handleMultiFrequencyUnify}
                  />   
              </Form.Item>
              
            {
              this.state.ssid2to1Enable?

              <div>                
                  <Form.Item {...formItemLayout} label="SSID">
                  {getFieldDecorator('ssid_2g', {    
                      rules: [{ required: true, message: '请输入SSID名称!' }],              
                      initialValue:ssid_config.ssid_2g
                  })(
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="隐藏SSID">
                      <Checkbox checked={ssid_config.hide_2g=="0"?false:true} 
                        onChange={this.onChangeHide2g}
                      />
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="加密方式">
                    <Select value={ssid_config.encry_2g=="0"?"不加密":"加密"} 
                      onChange={this.handleEncry2g}>
                      <Option value="0">不加密</Option>
                      <Option value="1">加密</Option>
                    </Select>      
                  </Form.Item>
                  {
                    ssid_config.encry_2g=="0"?null:
                    <Form.Item {...formItemLayout} label="密码">
                    {getFieldDecorator('passphrase_2g', {         
                        rules: [{ required: true, message: '请输入密码!' }],             
                        initialValue:ssid_config.passphrase_5g
                    })(
                        <Input.Password placeholder="请输入密码" />
                    )}
                    </Form.Item>
                  }
                  <Form.Item {...formItemLayout} label="二层隔离">
                      <Checkbox checked={ssid_config.isolate_2g=="0"?false:true} 
                        onChange={this.onChangeIsolate2g} 
                      />
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="最大用户数">
                  {getFieldDecorator('maxsta_2g', {          
                      rules: [
                          { required: true, message: '请输入最大用户数!' },
                          {                             
                            pattern:new RegExp('^(\\d|\\d\\d|[1][0-1]\\d|12[0-8])$'),
                            message:'最大用户数只能为0-128！'
                       }],        
                      initialValue:ssid_config.maxsta_2g  //0-128
                  })(
                      <Input />
                  )}
                  </Form.Item>
              </div>
            :
              <div>
                <Form.Item {...formItemLayout} label="2G SSID">
                {getFieldDecorator('ssid_2g', {         
                    rules: [{ required: true, message: '请输入SSID名称!' }],          
                    initialValue:ssid_config.ssid_2g
                })(
                    <Input />
                )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="2G 隐藏SSID">
                    <Checkbox checked={ssid_config.hide_2g=="0"?false:true} 
                      onChange={this.onChangeHide2g}
                    />
                </Form.Item>
                <Form.Item {...formItemLayout} label="2G 加密方式">
                  <Select value={ssid_config.encry_2g=="0"?"不加密":"加密"} 
                    onChange={this.handleEncry2g}>
                    <Option value="0">不加密</Option>
                    <Option value="1">加密</Option>
                  </Select>      
                </Form.Item>
                {
                  ssid_config.encry_2g=="0"?null:
                  <Form.Item {...formItemLayout} label="2G 密码">
                  {getFieldDecorator('passphrase_2g', {         
                      rules: [{ required: true, message: '请输入密码!' }],           
                      initialValue:ssid_config.passphrase_5g
                  })(
                      <Input.Password placeholder="请输入密码" />
                  )}
                  </Form.Item>
                }
                <Form.Item {...formItemLayout} label="2G 二层隔离">
                    <Checkbox checked={ssid_config.isolate_2g=="0"?false:true} 
                      onChange={this.onChangeIsolate2g} 
                    />
                </Form.Item>
                <Form.Item {...formItemLayout} label="2G 最大用户数">
                {getFieldDecorator('maxsta_2g', {                  
                    rules: [
                        { required: true, message: '请输入最大用户数!' },
                        {                             
                          pattern:new RegExp('^(\\d|\\d\\d|[1][0-1]\\d|12[0-8])$'),
                          message:'最大用户数只能为0-128！'
                      }],        
                    initialValue:ssid_config.maxsta_2g  //0-128
                })(
                    <Input />
                )}
                </Form.Item>              

                <Form.Item {...formItemLayout} label="5G SSID">
                  {getFieldDecorator('ssid_5g', {        
                      rules: [{ required: true, message: '请输入SSID名称!' }],                    
                      initialValue:ssid_config.ssid_5g
                  })(
                      <Input />
                  )}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="5G 隐藏SSID">
                      <Checkbox checked={ssid_config.hide_5g=="0"?false:true} 
                      onChange={this.onChangeHide5g}/>
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="5G 加密方式">
                    <Select defaultValue={ssid_config.encry_5g=="0"?"不加密":"加密"}  
                      onChange={this.handleEncry5g}>
                      <Option value="0">不加密</Option>
                      <Option value="1">加密</Option>
                    </Select>   
                  </Form.Item>
                  {
                    ssid_config.encry_5g=="0"?null:
                    <Form.Item {...formItemLayout} label="5G 密码">
                    {getFieldDecorator('passphrase_5g', {          
                        rules: [{ required: true, message: '请输入密码!' }],         
                        initialValue:ssid_config.passphrase_5g
                    })(
                        <Input.Password placeholder="请输入密码" />
                    )}
                    </Form.Item>
                  }
                  <Form.Item {...formItemLayout} label="5G 二层隔离">
                      <Checkbox checked={ssid_config.isolate_5g=="0"?false:true} 
                      onChange={this.onChangeIsolate5g}  />
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="5G 最大用户数">
                  {getFieldDecorator('maxsta_5g', {                 
                      rules: [
                          { required: true, message: '请输入最大用户数!' },
                          {                             
                            pattern:new RegExp('^(\\d|\\d\\d|[1][0-1]\\d|12[0-8])$'),
                            message:'最大用户数只能为0-128！'
                       }],         
                      initialValue:ssid_config.maxsta_5g  //0-128
                  })(
                      <Input />
                  )}
                  </Form.Item>
              </div>
              }
              <Form.Item {...tailFormItemLayout}>
              <Button type="primary" onClick={()=>this.handleSetSSIDmsg(ssid_config)} >
                  应用
              </Button>
              </Form.Item>

              </Form>
          </Card>

        </div>
      )
    }

}

const GroupSSIDSetting_ = Form.create()(GroupSSIDSetting);

