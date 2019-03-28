import React from 'react';
import { Card, Form, Modal,Progress, Input, Button,} from 'antd';
import {confirmToApply} from '@/utils/utils'
import {actionCreater } from './store'
import {connect} from 'react-redux'
import {countDown_toIp} from '@/utils/utils'
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'

class Lan extends React.Component{   
    state={
        secondsToGo:"",
        visible:false,
        percent:0, 
    }

    componentDidMount(){
        this.props.getLanmsg();
    }
    componentWillReceiveProps(nextprops){
        if(nextprops.showProgress==true){
            this.setState({
                visible:true,
                secondsToGo:nextprops.locktime
            })
            countDown_toIp.bind(this)(nextprops.locktime,nextprops.redir_ip)
        }
    }
    
    handleApplyData=()=>{
        confirmToApply(this.handleSetLan)
    }
    
    handleSetLan=()=>{        
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLanmsg(values) 
            }
        });         
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {ipaddr,netmask } = this.props;
        return(
            <Card title="局域网设置">
                <Form>
                    <Form.Item {...formItemLayout} label="IP地址">
                    {getFieldDecorator('ipaddr', {
                        rules: [
                            { required: true, message: 'ip地址不能为空!' },
                            {
                                pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                                message:'IP地址格式不正确！'
                           }], 
                        initialValue:ipaddr
                    })(
                        <Input />
                    )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="子网掩码">
                    {getFieldDecorator('netmask', {
                        rules: [{ required: true, message: '子网掩码不能为空!' },
                        {
                            pattern:new RegExp('^(254|252|248|240|224|192|128|0)\\.0\\.0\\.0$|^(255\\.(254|252|248|240|224|192|128|0)\\.0\\.0)$|^(255\\.255\\.(254|252|248|240|224|192|128|0)\\.0)$|^(255\\.255\\.255\\.(254|252|248|240|224|192|128|0))$'),
                            message:'子网掩码格式不正确！'
                       }], 
                        initialValue:netmask
                    })(                        
                        <Input />
                    )}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" onClick={this.handleApplyData} >
                        应用
                    </Button>
                    </Form.Item>
                </Form>
                
            <Modal
                title="设置中"
                closable={false}
                footer={null}
                visible={this.state.visible}
            >
                <p>设置中，请稍后，还有{this.state.secondsToGo}秒设置完成...</p>
                <Progress  percent={this.state.percent} 
                    status="active"
                    strokeWidth={10}
                />
            </Modal>
            </Card>
        )
    }
}



const mapState = (state)=>({
    ipaddr:state.getIn(['lan','ipaddr']),
    netmask:state.getIn(['lan','netmask']),
    
    showProgress:state.getIn(['lan','showProgress']),
    locktime:state.getIn(['lan','locktime']),
    redir_ip:state.getIn(['lan','redir_ip']),
  })
  
const mapDispatch = (dispatch) =>({
    getLanmsg(){
        dispatch(actionCreater.getLanmsg())
    },
    setLanmsg(values){
        dispatch(actionCreater.setLanmsg(values))
    }
})

const Lan_ = Form.create()(Lan);
export default connect(mapState,mapDispatch)(Lan_)



