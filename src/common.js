import React from 'react';
import {connect} from 'react-redux'
import {Redirect } from 'react-router-dom';
import {Row,Col} from 'antd';
import Header from '@/components/Header';
import '@/style/common.less'

class Common extends React.Component{

    render(){
        const {loginState} = this.props;
        const loginStorage = sessionStorage.getItem('loginState');
        return (
            <div>
            { 
                ( loginStorage === "1" || loginState)?(
                <div>
                    <Row className="content">
                        {this.props.children}
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
export default connect(mapState,null)(Common)