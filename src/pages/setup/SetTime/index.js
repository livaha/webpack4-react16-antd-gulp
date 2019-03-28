import React from 'react'
import { Card, Form, Input, Button,Switch,Select,message} from 'antd';
import TIME_ZONE from '@/config/timeZone';
import {connect} from 'react-redux'
import {actionCreater } from './store'
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'
const Option = Select.Option;
const FormItem = Form.Item;

class SetTime extends React.Component{
  state={
    submitDisable : false
  }

  componentDidMount(){
    //获取系统时间和ntpserver等信息
    this.props.initNtpData();

    this.interval=setInterval(()=>{
      this.props.handleSysTime((this.props.time_of_day+1000));
    },1000)
  }
  
  componentWillUnmount(){
    clearInterval(this.interval)
  }

  handleSwitchChange=(value)=>{
    this.setState({
      submitDisable:true
    })
    console.log(this.state.submitDisable)
    this.props.handleSwitchChange(value)
  }

  handleSetNtpData=()=>{    
    let ntpserverlist = this.props.form.getFieldsValue();
    
    console.log(ntpserverlist)
    //将ntp_server123合并为1个
    //let ntp_server = [ntpser1.state.value,ntpser2.state.value,ntpser3.state.value]
    let ntp_server = [ntpserverlist.ntp_server1,
                    ntpserverlist.ntp_server2,
                    ntpserverlist.ntp_server3]    
    
    if((JSON.stringify(ntp_server) !== JSON.stringify(this.props.ntp_server)) || 
        (this.state.submitDisable === true)){
      //本数据不相等就提交，并且将数据置为false
      this.setState({
        submitDisable:false
      })
      //应用按钮将所有的设置发送到后台
      this.props.handleSetNtpData(this.props.ntp_enable,ntp_server,this.props.time_zone)
    }else{
      //如果原来数据没有改变，ntp_server也没有改变，就不提交，并把数据置为false
      //window.alert('数据没有改变，无法提交！')   
      message.error('数据没有改变，无法提交！');
      this.setState({
        submitDisable:false
      })
    }
  }
  
  handleSelectChange=(value)=>{  
    this.setState({
      submitDisable:true
    })
    this.props.handleSelectChange(value)
  }
  
  /**渲染select timezone 节点 */
  renderOptionTime=()=>{    
    return TIME_ZONE.map((item,index)=>{
      return (<Option value={item.value} key={item.value}> {item.label}</Option>)
    })
  }

  render(){   
    const {ntp_enable,show_time,ntp_server,handleLocalTime} = this.props;

    const {getFieldDecorator} = this.props.form;
    return(
      <div>
          <Card title="系统时间">
            <Form>
              <FormItem label="显示系统时间" {...formItemLayout}>              
                <Input value={show_time} readOnly/>
              </FormItem> 
              <FormItem {...tailFormItemLayout}>
                <Button type="primary"  onClick={handleLocalTime}>使用本机时间 </Button>              
              </FormItem> 
            <FormItem label="时区选择" {...formItemLayout}>
              <Select 
                onChange={this.handleSelectChange}
                defaultValue='CST-8'
              >
                {this.renderOptionTime()}
              </Select>
            </FormItem>

            <FormItem label="开启NTP服务器" {...formItemLayout}>
              <Switch 
                onClick={this.handleSwitchChange} 
                defaultChecked={ntp_enable}
                checked={ntp_enable}
              />    
            </FormItem>

              {/**defaultValue={ntp_server?ntp_server[0]:null}
                这里的defaultValue不能用，可以用antd的initialValue或者百度一个redux-form的用法 */}
              
            <FormItem label="NTP服务器1" {...formItemLayout}>
              {
                  getFieldDecorator('ntp_server1', {
                      initialValue:ntp_server[0],
                      rules: [{ required: true,}],
                 
                  })(
                    /*<Input disabled={!ntp_enable}  innerRef={(input) => {this.ntpser1 = input}} /> */
                    <Input disabled={!ntp_enable} />         
              )
            }
          </FormItem>                
          <FormItem label="NTP服务器2" {...formItemLayout}>
            {
                getFieldDecorator('ntp_server2', {
                    initialValue:ntp_server[1],                  
                })(
                  <Input disabled={!ntp_enable} />      
              )
            }
          </FormItem>        
          <FormItem label="NTP服务器3" {...formItemLayout}>
            {
                getFieldDecorator('ntp_server3', {
                    initialValue:ntp_server[2],                  
                })(
                  <Input disabled={!ntp_enable} />      
              )
            }
          </FormItem>  
          <FormItem {...tailFormItemLayout}>
              {/*<Button type="primary" onClick={()=>this.handleSetNtpData(this.ntpser1,this.ntpser2,this.ntpser3,)}>应用</Button>*/}
              <Button type="primary" onClick={this.handleSetNtpData}>应用</Button>
          </FormItem>   
          </Form>
          </Card>
      </div>
    )
  }
}


const mapState = (state)=>({
  ntp_enable:state.getIn(['settime','ntp_enable']),
  ntp_server:state.getIn(['settime','ntp_server']),
  time_of_day:state.getIn(['settime','time_of_day']),
  show_time:state.getIn(['settime','show_time']),
  time_zone:state.getIn(['settime','time_zone']),
})

const mapDispatch = (dispatch) =>({
  initNtpData(){
    dispatch(actionCreater.initNtpData());
  },
  handleSysTime(time_of_day){   
    dispatch(actionCreater.handleSysTime(time_of_day));
  },
  handleLocalTime(){    
    let browser_time_chuo = (new Date()).getTime();
    dispatch(actionCreater.handleLocalTime(browser_time_chuo));
  },
  handleSelectChange(value){  
    //选择时区，将时区值发送到store  
    dispatch(actionCreater.setTimeZone(value));
  },
  handleSwitchChange(value){
    //console.log(value)
    dispatch(actionCreater.changeNtpEnable(value));
  },
  handleSetNtpData(ntp_enable,ntp_server,time_zone){    
    dispatch(actionCreater.handleSetNtpData(ntp_enable,ntp_server,time_zone));
  },

})
//export default connect(mapState,mapDispatch)(SetTime)

const SetTime_ = Form.create()(SetTime);
export default connect(mapState,mapDispatch)(SetTime_)