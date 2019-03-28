import React from 'react'
import { Card, Form,  Button,Select,message,Checkbox,Statistic,InputNumber,Input  } from 'antd';
import {connect} from 'react-redux'
import {actionCreater } from './store'
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const Countdown = Statistic.Countdown;

const plainOptions = [
  { label: '周一', value: 2 },
  { label: '周二', value: 4 },
  { label: '周三', value: 8 },
  { label: '周四', value: 16 },
  { label: '周五', value: 32 },
  { label: '周六', value: 64 },
  { label: '周日', value: 1 },
];

class TickReboot extends React.Component{

  componentDidMount(){
    this.props.initTickData();

    this.interval=setInterval(()=>{
      this.props.handleSysTime((this.props.time_of_day+1000));
    },1000)
  }
  
  componentWillUnmount(){
    clearInterval(this.interval)
  }

  handleSendMode1Data=(sche_reboot_mode,hour,min)=>{
    let rectime = hour*3600 + min*60;
    if(rectime <600)      
      message.error('倒计时时间不能低于10分钟！');
    else
      this.props.handleSendMode1Data(sche_reboot_mode,rectime); 
  }
  render(){   
    const {show_time,remaining_time,checkedList,checkAll,sche_reboot_mode,weeks,rectime,show_t1hour,show_t1minute,hour,minute,
      handleSelectChange,onCheckAllChange,onCheckChange,handleSendMode2Data,onChange2hour,onChange2minute,
      onChange1hour,onChange1minute
    } = this.props;
    
    return(
      <div>
          <Card title="定时重启">
          <Form>
          <Form.Item label="模式" {...formItemLayout}>
            <Select
              style={{ width: 200 ,}}
              defaultValue='0'
              value={String(sche_reboot_mode)}
              onChange={handleSelectChange}
            >
              <Option value="0">关闭</Option>
              <Option value="1">倒计时</Option>
              <Option value="2">指定时间重启</Option>
            </Select>
            </Form.Item>

            {
              sche_reboot_mode==0?null:sche_reboot_mode==1?(              
              <div>
              <Form.Item label="倒计时（时：分）" {...formItemLayout}>
                {/**这里需要将时和分转换为分赋值给rectime */}
                <InputNumber min={0}  max={23} value={show_t1hour}  onChange={onChange1hour}/>:
                <InputNumber min={0} max={59}  value={show_t1minute} onChange={onChange1minute} />
                
              </Form.Item>
              </div>              
              ):(              
              <div>
              <Form.Item label="指定星期" {...formItemLayout}>
                <Checkbox onChange={onCheckAllChange} checked={checkAll}>全选</Checkbox>
                <CheckboxGroup options={plainOptions} value={checkedList}  onChange={onCheckChange} />
              </Form.Item>
              <Form.Item label="倒计时（时：分）" {...formItemLayout}>
                <InputNumber min={0} max={59} value={hour}  onChange={onChange2hour}/>:
                <InputNumber min={0} max={59} value={minute}  onChange={onChange2minute}/>
              </Form.Item>
              </div>
              )
            }
            {
              sche_reboot_mode===0?null:                  
              <Form.Item label="设备系统时间" {...formItemLayout}>
                <Input  value={show_time} readOnly/>
              </Form.Item>
            }
            {
              remaining_time>0?
              <Form.Item label="重启倒计时" {...formItemLayout}>
              <Countdown valueStyle={{/*fontSize:14*/}} value={remaining_time} format=" D 天 H 时 m 分 s 秒" />
              </Form.Item>
              :null                  
            }
            {
            sche_reboot_mode===1?
            <Form.Item {...tailFormItemLayout}>
                <Button 
                onClick={() => this.handleSendMode1Data(sche_reboot_mode,show_t1hour,show_t1minute)}
                type="primary" >应用 </Button>    
                
              </Form.Item>    
            :sche_reboot_mode===2?
            <Form.Item  {...tailFormItemLayout}>
                <Button 
                onClick={() => handleSendMode2Data(sche_reboot_mode,rectime,weeks,hour,minute)}
                type="primary" >应用 </Button>
                
              </Form.Item>
                   :null
            }
            </Form>
          </Card>
      </div>
    )
  }
}

const mapState = (state)=>({
  sche_reboot_mode:state.getIn(['tickreboot','sche_reboot_mode']),
  rectime:state.getIn(['tickreboot','rectime']),
  weeks:state.getIn(['tickreboot','weeks']),
  hour:state.getIn(['tickreboot','hour']),
  minute:state.getIn(['tickreboot','minute']),
  show_t1hour:state.getIn(['tickreboot','show_t1hour']),
  show_t1minute:state.getIn(['tickreboot','show_t1minute']),
  checkedList:state.getIn(['tickreboot','checkedList']),
  checkAll:state.getIn(['tickreboot','checkAll']),
  //deadline:state.getIn(['tickreboot','deadline']),
  remaining_time:state.getIn(['tickreboot','remaining_time']),
  time_of_day:state.getIn(['tickreboot','time_of_day']),
  show_time:state.getIn(['tickreboot','show_time']),
})

const mapDispatch = (dispatch) =>({
  handleSysTime(time_of_day){   
    dispatch(actionCreater.handleSysTime(time_of_day));
  },
  onChange1hour(show_t1hour){
    dispatch(actionCreater.show_t1hour(show_t1hour));
  },
  onChange1minute(show_t1minute){
    dispatch(actionCreater.show_t1minute(show_t1minute));
  },
  onChange2hour(hour){
    dispatch(actionCreater.show_t2hour(hour));
  },
  onChange2minute(minute){
    dispatch(actionCreater.show_t2minute(minute));
  },

  initTickData(){
    dispatch(actionCreater.initTickData());
  },
  handleSendMode1Data(sche_reboot_mode,rectime){
    dispatch(actionCreater.handleSendMode1Data(sche_reboot_mode,rectime));
  },

  handleSendMode2Data(sche_reboot_mode,rectime,weeks,hour,minute){
    if(weeks !== 0) 
      dispatch(actionCreater.handleSendMode2Data(sche_reboot_mode,rectime,weeks,hour,minute));
    else    
      message.error('请选择需要重启的星期！');
  },

  handleSelectChange(sche_reboot_mode){
    dispatch(actionCreater.handleRebootMode(sche_reboot_mode));
  },
  onCheckChange(checkedList){   
    let weeks = 0;
    checkedList.map((item,index)=>{
      weeks = weeks+item;
      /**看下weeks全选上的值是多少，然后给赋值为255 */
      if(weeks==127) weeks=255;
    })
    let checkAll= (checkedList.length === plainOptions.length);
    dispatch(actionCreater.changeCheckedData(checkAll,checkedList,weeks));
  },
  onCheckAllChange(e){
    let weeks = e.target.checked ?255:0;
    let plainOptions_value = plainOptions.map((item,index)=>{
      return item.value
    })
    let  checkedList= e.target.checked ? plainOptions_value : [];
    let  checkAll= e.target.checked;
    dispatch(actionCreater.changeCheckedData(checkAll,checkedList,weeks));
  },
})
const TickReboot_ = Form.create()(TickReboot);
export default connect(mapState,mapDispatch)(TickReboot_)
