import React from 'react'
import axios from '@/axios'
import { Card, Form, Input, Button,message} from 'antd';
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'
import {cgidata} from '@/pages/cgidata'
class SetPassword extends React.Component {
  state = {
    confirmDirty: false,
  };
  componentDidMount(){
     // this.request();
  }

  //动态获取mock数据
  request = (values)=>{
      axios.ajax_post({
          data:values
      }).then((res)=>{
          if(res.restcode === 2000){
              this.setState({
                  dataSource : [res.result]
              })   
              message.success('设置成功');
              /**跳转到登陆页 */
              sessionStorage.clear()       
              window.location.reload(true);
          }
      })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    
        this.props.form.validateFields((err,values)=>{
          if (!err) {
            if(values.prepassword == values.newpassword){
              message.error('新密码与旧密码不能相同！')
              return false;
            }
          //合并数据
          let data ={...cgidata.cgidata1,prepassword:values.prepassword,newpassword:values.newpassword};
          //发送请求
          this.request(data);
        }
          })
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newpassword')) {
      callback('两次输入密码不一致!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmpassword'], { force: true });
    }
    callback();
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title="修改密码">
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="旧密码：" {...formItemLayout}>
              {
                  getFieldDecorator('prepassword', {
                      initialValue: '',
                      rules: [
                          {
                              required: true,
                              message: '密码不能为空!'
                          },{                     
                            pattern:new RegExp('^(.{5,32})$'),
                            message:'请输入5-32位的密码！'
                          },
                      ]
                  })(
                      <Input.Password type="password" placeholder="请输入旧密码" />
                  )
              }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="新密码："
          >
            {getFieldDecorator('newpassword', {
              rules: [{
                required: true, message: '密码不能为空!',
              }, {                     
                pattern:new RegExp('^(.{5,32})$'),
                message:'请输入5-32位的密码！'
              },{
                validator: this.validateToNextPassword,
              }],
            })(
              <Input.Password type="password"  placeholder="请输入新密码"/>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="确认密码："
          >
            {getFieldDecorator('confirmpassword', {
              rules: [{
                required: true, message: '密码不能为空!',
              },{                     
                pattern:new RegExp('^(.{5,32})$'),
                message:'请输入5-32位的密码！'
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input.Password type="password"  placeholder="请确认密码" onBlur={this.handleConfirmBlur} />
            )}
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">应用</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default Form.create({ name: 'register' })(SetPassword);





