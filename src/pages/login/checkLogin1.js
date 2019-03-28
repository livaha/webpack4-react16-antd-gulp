import React from 'react';
import {connect} from 'react-redux'
import {Redirect } from 'react-router-dom';
import {Row,Col} from 'antd';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NavLeft from '@/components/NavLeft';
import '@/style/common.less'

class CheckLogin extends React.Component{

    render(){
        sessionStorage.setItem('loginState', '1');
        const {loginState} = this.props;
        const loginStorage = sessionStorage.getItem('loginState');
        return (
            <div>
                <div>
                    <div>
                        <Header/>
                    </div>
                    <Row className="container">
                    <Col span={3} className="nav-left">
                        <NavLeft/>
                    </Col>
                    <Col span={21} className="main">
                        <Row className="content">                        
                            {/*加载所有的子组件 */}
                            {this.props.children}
                        </Row>
                        <Footer/>
                    </Col>
                    </Row>
                </div>
            </div>

        )
        return (
            <div>
            { 
                ( loginStorage === "1" || loginState)?(
                    <div>
                    <Row className="container">
                    <Col span={3} className="nav-left">
                        <NavLeft/>
                    </Col>
                    <Col span={21} className="main">
                        <Header/>
                        <Row className="content">                        
                            {/*加载所有的子组件 */}
                            {this.props.children}
                        </Row>
                        <Footer/>
                    </Col>
                    </Row>
                </div>
                )         
                :  window.location.hash=="#/login"?null:<Redirect to='/login'/>
            }
            </div>

        )
    }
}



const mapState = (state)=>({
    loginState:state.getIn(['login','loginState'])
})
export default connect(mapState,null)(CheckLogin)