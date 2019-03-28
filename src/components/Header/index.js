import React from 'react';
import axios from '@/axios'
import {showConfirm,countDown_toLogin} from '@/utils/utils'
import {cgidata} from '@/pages/cgidata'
import './index.less'
import {connect} from 'react-redux'
import { actionCreater as loginActionCreators } from '@/pages/login/store';
import {Link} from 'react-router-dom'
import { Button, Modal,Progress  } from 'antd';

class Header extends React.Component{
    state={
      secondsToGo:"",
      percent:0
    }
    handleRestart=()=>{
     
     //发送请求并获取时间
     let values ={...cgidata.cgidata11};      
       axios.ajax_post({
         data:values
       }).then((res)=>{
           if(res.restcode == 2000){               
              this.setState({
                secondsToGo:res.locktime,
                visible:true
              })
              countDown_toLogin.bind(this)(res.locktime);
           }
       })
    }

    render(){
        const { username,login ,logout} = this.props;
        return(
            <div className="header">
                
                <div className="logo-position">
                <div className="logo">
                <a href="http://totolink.net/" target="blank"><img src="/assets/logo.png" alt="totolink logo"/></a>
                 
                    {login?
                    <div className="logout-right">
                    <Link to='/login' onClick={logout}><span style={{color:'#fff'}}>退出</span></Link>
                    <Button style={{marginLeft:15}} icon="poweroff" type="danger" shape="circle"
                        onClick={()=>showConfirm('重启',this.handleRestart)}></Button></div>
                    :
                    <span className="login-right">您好，请登陆</span>
                    }         
                </div>   
                </div>   
                
            <Modal
              title="重启中"
              closable={false}
              footer={null}
              visible={this.state.visible}
            >
              <p>设备正在重启，请不要断电，还有{this.state.secondsToGo}秒重启完成...</p>
              <Progress  percent={this.state.percent} 
                  status="active"
                  strokeWidth={10}
              />
            </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        //username : state.header.username
        //username:state.get('header').get('username')
        username:state.getIn(['header','username']),
        login:state.getIn(['login','loginState'])
    }
}

const mapDispathToProps =(dispatch)=>{
    return{
        logout(){
            console.log('a')
            dispatch(loginActionCreators.logout())
        }
    }
}

export default connect(mapStateToProps,mapDispathToProps)(Header)
