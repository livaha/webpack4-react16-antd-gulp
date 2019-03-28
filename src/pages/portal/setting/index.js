
import React, { PureComponent } from 'react';
import { Card ,Form,Input,Button,Radio,message,Upload,Icon} from 'antd';
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'
import reqwest from 'reqwest';
import {cgidata} from '@/pages/cgidata'
import axios from '@/axios';
import {domainName} from '@/utils/utils'

const RadioGroup = Radio.Group;

class Portal_Setting extends PureComponent {
  state={
    enable:1,
    orig_url_en:1,
		timeout:	600,
		title:	"",
		redirect:	"https://",
    image_url:	"/portal/bg.png",
    
    fileList: [],
  }
  componentDidMount(){
    this.getPortalConfig()
  }
  handleWebEnable=(e)=>{
    this.setState({
      enable:e.target.value
    })
  }
  handleRedirectUrl=(e)=>{
    this.setState({
      orig_url_en:e.target.value
    })

  }

  getPortalConfig=()=>{
    let values ={...cgidata.cgidata103};     
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){      
            this.setState({                        
              enable:res.result.enable,
              orig_url_en:res.result.orig_url_en,
              timeout:	res.result.timeout,
              title:	res.result.title,
              redirect:	res.result.redirect,
              image_url:res.result.image_url,
            })
        }
    })                  
  }
  setPortalConfig=(values)=>{
    let data ={...cgidata.cgidata104,...values};     
    axios.ajax_post({
      data:data
    }).then((res)=>{
        if(res.restcode == 2000){     
          message.success('设置成功')
        }
    })                  
  }


  handleApplyData=()=>{
    this.props.form.validateFields((err, values) => {
      if (!err) {
          let enable = this.state.enable;
          let orig_url_en = this.state.orig_url_en;
          let redirect = values.redirect;//domainName(values.redirect);
          let title = values.title;
          let timeout = values.timeout;
          let data = {enable,orig_url_en,redirect,title,timeout}
          if(orig_url_en===1 &&　redirect===false){            
            message.error('网址格式不正确')
            return false
          }
          this.setPortalConfig(data)
      }
      else{
          
      }
    });   
  }

  beforeUpload =(file)=> {//上传中、完成、失败都会调用这个函数。
    
    const isJPG = (file.type === 'image/jpeg')||(file.type === 'image/png');
    if (!isJPG) {
      message.error('图片只能为 .JPG 或 .PNG 格式!');
      return false
    }
    //console.log(file.size)
    const isLt200KB = file.size < 204800;
    if (!isLt200KB) {
      message.error('图片必须小于200KB!');
      return false
    }
    //return isJPG && isLt200KB;

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
    
    let upgradeurl = `cgi-bin/cgi_stream.cgi?streamid=10`
    // You can use any AJAX library you like
    reqwest({
      url: upgradeurl,
      method: 'post',
      processData: false,
      data:formData,
      success: (resp) => {
        let res = JSON.parse(resp)
        if(res.restcode === 2000){
          message.success('上传成功')
        }else if(res.restcode == 4008){            
            message.error('文件格式错误.');
        }
      },
      error: () => {
        message.error('upload failed.');
      },
    });
    this.setState({
      showVisibleAddModle:false
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const radioStyle = {
      display: 'block',    
      height: '36px',
      lineHeight: '38px',
    };
    const props = {
      name: 'image',
      beforeUpload:  this.beforeUpload,      
      accept:".jpg,.png",
    };
    return (
      <Card title="Portal设置">

        <Form.Item {...formItemLayout} label="WEB认证">
          <RadioGroup onChange={this.handleWebEnable} value={this.state.enable}>
              <Radio value={1}>开启</Radio>
              <Radio value={0}>关闭</Radio>
            </RadioGroup>
        </Form.Item>
        <Form.Item {...formItemLayout} label="认证有效期(秒)">
          {getFieldDecorator('timeout', {
              rules: [{ required: true, message: '认证有效期不能为空!' },
              {
                  pattern:new RegExp('^([3-9]\\d\\d|\\d{4,5}|60[0-3]\\d\\d\\d|604[0-7]\\d\\d|604800)$'),
                  message:'时间范围只为300~ 604800秒（7天）  '
              }], 
              initialValue:this.state.timeout
          })(                        
              <Input />
          )}
          小时(范围：300-604800秒)
        </Form.Item>
        <Form.Item {...formItemLayout} label="标题">
          {getFieldDecorator('title', {
              rules: [{ required: true, message: '标题不能为空!' },
              {
                  pattern:new RegExp('^.{1,64}$'),
                  message:'请输入1-64位字符！'
              }], 
              initialValue:this.state.title
          })(                        
              <Input />
          )}
          </Form.Item>
        <Form.Item {...formItemLayout} label="认证后网址跳转">
          <RadioGroup onChange={this.handleRedirectUrl} value={this.state.orig_url_en}>
            <Radio style={radioStyle}  value={0}>跳转到客户认证前网址</Radio>
            <Radio style={radioStyle}  value={1}>跳转到指定网址</Radio>
          </RadioGroup>
          {getFieldDecorator('redirect', {
              rules: [{ required: this.state.orig_url_en?false:true, message: '跳转网址不能为空!' },
              {
                  //pattern:new RegExp('^(254|252|248|240|224|192|128|0)\\.0\\.0\\.0$|^(255\\.(254|252|248|240|224|192|128|0)\\.0\\.0)$|^(255\\.255\\.(254|252|248|240|224|192|128|0)\\.0)$|^(255\\.255\\.255\\.(254|252|248|240|224|192|128|0))$'),
                  //message:'子网掩码格式不正确！'
              }], 
              initialValue:this.state.redirect
          })(                        
              <Input disabled={this.state.orig_url_en?false:true}/>
          )}
          </Form.Item>
          
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" onClick={this.handleApplyData} style={{marginRight:20}}>
                应用设置
            </Button>
          </Form.Item>
          <Form.Item label="背景图片" {...formItemLayout}>
                <Upload {...props} fileList={this.state.fileList}>
                  <Button style={{width:237}} >
                    <Icon type="upload" /> 点击上传文件
                  </Button>
                </Upload>
              </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" disabled={this.state.fileList.length>0?false:true} onClick={this.handleUploadAp} >
                上传图片
            </Button>
          </Form.Item>

      </Card>)
  }
}


export default Form.create()(Portal_Setting);