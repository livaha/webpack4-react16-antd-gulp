
import React from 'react';
import axios from '@/axios'
import {cgidata} from '@/pages/cgidata'
import reqwest from 'reqwest';
import {showConfirm,countDown_toLogin} from '@/utils/utils'
import { Modal,Progress,Card,Form, Icon, Input, Button, message,Upload} from 'antd';


class SuperAdmin extends React.Component{    
  state={
    secondsToGo:"",
    percent:0,
    visible:true,
    super_admin:'',
    pass:false,
    prepassword:'',
    newpassword:'',
    fileList: [],
  }
  handleSuperAuth=(value)=>{    
    /**发送给后台看是否认证成功 */
    let data ={...cgidata.cgidata52,super_admin:value.state.value};   
    axios.ajax_post({
      data:data
    }).then((res)=>{
        if(res.restcode == 2000){   
          /**认证成功：看是下载还是上传操作 */
          this.setState({              
            visible:false,
            pass:true,
          })          
        }
    })
  }

  chanageSuperadminPassword=()=>{    
    this.props.form.validateFields((err, values) => {
      if (!err) { 
        let data ={...cgidata.cgidata53,prepassword:values.prepassword,newpassword:values.newpassword};   
        axios.ajax_post({
          data:data
        }).then((res)=>{
            if(res.restcode == 2000){   
              /**重新认证 */
              this.setState({
                visible:true,
                pass:false
              })              
            }
        })
      }
    })

  }
  beforeUpload =(file)=> {//上传中、完成、失败都会调用这个函数。
    //let fileList = [file];
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    //fileList = fileList.slice(-1);
    this.setState({ fileList:[file] });
    return false
  }
  
  handleUploadAp=()=>{
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });
    //console.log(fileList)
    let upgradeurl ='cgi-bin/cgi_stream.cgi?streamid=9'
    // You can use any AJAX library you like
    reqwest({
      url: upgradeurl,
      method: 'post',
      processData: false,
      data:formData,
      success: (resp) => {
        let res = JSON.parse(resp)
        if(res.restcode === 2000){
          
          this.setState({
            secondsToGo:res.locktime,
            rstartVisible:true
          })
          countDown_toLogin.bind(this)(res.locktime);
          //Util.countDown_restart(res.locktime);
          //TODO:回到登陆页，显示进度条
        }else if(res.restcode == 4008){            
            message.error('文件格式错误.');
        }
      },
      error: () => {
        message.error('upload failed.');
      },
    });
  }

  render() {   
    const { getFieldDecorator } = this.props.form;
    const props = {
      name: 'file',
      beforeUpload:  this.beforeUpload,      
      accept:".conf",
    };
    return (
          <div>
            
            <Modal
                title="超级管理员认证"
                closable={false}
                visible={this.state.visible}
                destroyOnClose={true}
                mask={false}
                footer={null}
              >
                  <span style={{marginRight:10,}}>输入超级管理员密码:</span>
                  <Input type="password" style={{width:180}} ref={(input) => {this.super_admin = input}} />
                  <Button type="primary" style={{marginLeft:10,width:80,}} onClick={ ()=>this.handleSuperAuth(this.super_admin)}                        
                  >应用</Button>
              </Modal>

              {
                this.state.pass==false?null:
                <Card title="超级管理员页面">

                  <Card
                    type="inner"
                    title="修改超级管理员密码"
                  >     
                    <Form>
                          <Form.Item 
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 12 }}
                            label="请输入旧密码">
                          {getFieldDecorator('prepassword', {
                              rules: [
                                  { required: true, message: '请输入旧密码!' }], 
                                  initialValue:''
                          })(
                              <Input.Password style={{width:280}} />
                          )}
                          </Form.Item>
                          <Form.Item 
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 12 }}
                            label="请输入新密码">
                          {getFieldDecorator('newpassword', {
                              rules: [
                                  { required: true, message: '请输入新密码!' }], 
                                  initialValue:''
                          })(
                              <Input.Password style={{width:280}} />
                          )}
                          </Form.Item>
                          <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                              <Button type="primary" style={{width:132}} onClick={this.chanageSuperadminPassword}                        
                              >应用</Button>
                          </Form.Item>
                      </Form>
                      
                  </Card>

                  <Card
                    style={{ marginTop: 20 }}
                    type="inner"
                    title="AP备注名称管理"
                  >                  
                    <span style={{marginRight:30}}>下载AP备注名称文件:</span>
                    <a href="cgi-bin/cgi_stream.cgi?streamid=8" download="AP备注名称文件">
                    <Button type="primary" shape="circle" icon="download" /></a>

                    <br/><br/>

                    <span style={{marginRight:30}}>上传文件:</span>
                    <Upload {...props} fileList={this.state.fileList}>
                      <Button style={{width:237}} >
                        <Icon type="upload" /> 点击上传文件
                      </Button>
                    </Upload>

                    {
                      this.state.fileList==''?null:
                      <Button type="primary"  style={{marginLeft:90,marginTop:20,width:120}}
                          onClick={()=>showConfirm('上传文件',this.handleUploadAp)}                            
                      >上传</Button>
                    }
                  </Card>
                  
                <Modal
                  title="重启中"
                  closable={false}
                  footer={null}
                  visible={this.state.rstartVisible}
                  >
                  <p>设备正在重启，请不要断电，还有{this.state.secondsToGo}秒重启完成...</p>
                  <Progress  percent={this.state.percent} 
                      status="active"
                      strokeWidth={10}
                  />
                </Modal>
                </Card>

              }           
          </div>
    )
  }
}

export default  Form.create()(SuperAdmin)

