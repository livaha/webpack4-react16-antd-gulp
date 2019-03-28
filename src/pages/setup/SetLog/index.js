import React from 'react'
import { Card, Input, Button,Switch,InputNumber,Form } from 'antd';
import {connect} from 'react-redux'
import {actionCreater } from './store'
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'
const { TextArea } = Input;

class SetLog extends React.Component{
  
  componentDidMount(){
    this.props.getLogCfg();
  }

  render(){    
    const {syslog_enable,log_size,syslog,
      handleSwitchChange,handleSetSize,handleSizeChange,handleLogClear,handleRefresh
    } = this.props;

    return (
      <div>
        <Card title="系统日志">
        <Form.Item {...formItemLayout} label="系统日志">      
          <Switch 
            checkedChildren="开" 
            unCheckedChildren="关" 
            defaultChecked
            checked={syslog_enable}
            onChange={(...arg) => handleSwitchChange(...arg,log_size)}
          />
          </Form.Item>

          <div id="show" style={syslog_enable?{display:"block"}:{display:"none"}}>
       
            <Form.Item {...formItemLayout} label="日志大小"> 
                <InputNumber 
                  style={{margin:"0 15px 0 0"}} 
                  min={1} 
                  max={128} 
                  value={log_size} 
                  //defaultValue={64} 
                  onChange={handleSizeChange} 
                />
                <Button type="primary" onClick={()=>handleSetSize(syslog_enable,log_size)}>应用</Button>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}> 
                <a href="cgi-bin/cgi_stream.cgi?streamid=1" download="系统日志">
                  <Button type="primary" >保存</Button>
                </a>
                <Button style={{margin:"0 15px 0 15px"}} type="primary" onClick={handleLogClear}>清除</Button>
                <Button onClick={handleRefresh}>刷新</Button>
            </Form.Item>

                <TextArea 
                  placeholder="没有数据？点刷新试试！"
                  value = {syslog}
                  autosize={{ minRows: 12, maxRows: 22 }} 
                />

          </div>
          </Card>
      </div>
    )
  }

}

const mapState = (state)=>({
  syslog_enable:state.getIn(['setlog','syslog_enable']),
  log_size:state.getIn(['setlog','log_size']),
  syslog:state.getIn(['setlog','syslog'])
})

const mapDispatch = (dispatch) =>({
  getLogCfg(){
    dispatch(actionCreater.initLogData());
  },
  handleSwitchChange(checked,arg,log_size){
    dispatch(actionCreater.switchChange(checked,log_size));    
  },
  handleSizeChange(value){
    if(value >128) value = 128;
    if(value<1) value = 1;   
    dispatch(actionCreater.changeLogSize(value));
  },
  handleSetSize(syslog_enable,log_size){
    let values = {syslog_enable,log_size}
   dispatch(actionCreater.setSize(values));
  },
  handleLogClear(){
    dispatch(actionCreater.clearLog());
  },
  handleRefresh(){
    dispatch(actionCreater.handleRefreshLog());
  }

})
export default connect(mapState,mapDispatch)(SetLog)