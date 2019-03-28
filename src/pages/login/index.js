import React from 'react';
import './index.css'
import {actionCreater } from './store'
import Header from '@/components/Header';
import {connect} from 'react-redux'
import {  Form, Icon, Input, Button, } from 'antd';
import {Redirect} from 'react-router-dom';

class Login extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.login(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {loginState} = this.props;
    if(!loginState){
      return (
        <div>
          <Header />
          
        <div id="components-form-demo-normal-login">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入正确的用户名!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password"  autoComplete="new-password" placeholder="请输入密码" />
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登陆
              </Button>
            </Form.Item>
          </Form>
        </div>
        </div>
      );
    }else{
      if(this.props.first_boot==1)
        return <Redirect to='/wizard'/>
      else
        return <Redirect to='/'/>
    }

  }
}

const mapState = (state)=>({
  loginState:state.getIn(['login','loginState']),
  first_boot:state.getIn(['login','first_boot'])
})

const mapDispatch = (dispatch) =>({
  login(values){
    dispatch(actionCreater.login(values))
  }
})
const Login_ = Form.create()(Login);
export default connect(mapState,mapDispatch)(Login_)