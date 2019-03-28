
import React from 'react';
import { Tabs,Switch, Card,Checkbox,Button,message,Form } from 'antd';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import {formItemLayout} from '@/config/input_layout'

const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;

export default class NoMatch extends React.Component{    
 
  state={
    //开关
    appfilter:	false,
    appfilter_src:	false,
    //用于标题的
		apptype:	[
      {typeid: "1", config_name: "app_config_1000", apptype_en: "COMMONLY USED WEB SITE", apptype_cn: "常用网站", apptype_ct: "常用網站"},
      {typeid: "1", config_name: "app_config_2000", apptype_en: "COMMUNITY", apptype_cn: "社交通讯", apptype_ct: "社交通訊"},
      {typeid: "1", config_name: "app_config_3000", apptype_en: "NETWORK GAME", apptype_cn: "网络游戏", apptype_ct: "網路遊戲", },
      {typeid: "1", config_name: "app_config_5000", apptype_en: "VIDEO AND NEWS", apptype_cn: "视频新闻", apptype_ct: "視頻新聞", },
   ],
    //用于复选框的
    applist:	[],      
      
    //被选上的
    checkedList:[],//this.props.checkedList,
    //全选按键，非全选时的效果
    indeterminate: false,
    //全选效果
    checkAll: false,
    //复选框组：列表的标签与值一一对应
    plainOptions:[],//this.props.plainOptions,
    //用于全选和全不选的列表
    allListValue:[],//this.props.allListValue,
  }

  componentDidMount(){
    this.get_app_breaf_config();
  }

  get_app_breaf_config=()=>{
    let config_name = '';
    let apptype = []
    let values ={...cgidata.cgidata54};      

      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
            if(res.result.apptype!=[]){
              config_name=res.result.apptype[0].config_name;
              res.result.apptype.forEach(function(item,index){      
                if(item.typeid==1){
                  item.key = index
                  apptype.push(item) 
                }
              })      
              
              this.setState({
                config_name,
                appfilter:res.result.appfilter,
                appfilter_src:res.result.appfilter,
                apptype:apptype,
              })
            }
            else{
              this.setState({
                appfilter:res.result.appfilter,
                apptype:res.result.apptype,
              })
            }
          }
      }).then((res)=>{
        this.get_app_detail_config_by_name(config_name)
    })
  }

  get_app_detail_config_by_name=(config_name)=>{
    let values ={...cgidata.cgidata55,config_name};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
                  
            let checkAll,indeterminate;
            let plainOptions =[]
            let allListValue =[]
            let checkedList =[]
            res.result.applist.forEach(function(item,index){

              plainOptions.push({label:item.appname_cn,value:item.appid})
              allListValue.push(item.appid)
              if(item.app_switch==true){
                checkedList.push(item.appid)
              }
            })
            
            if(checkedList.length == 0){
               checkAll=false
               indeterminate=false
            }
            else if(checkedList.length == allListValue.length){
              checkAll=true
              indeterminate=false
            }else{
              checkAll=false
              indeterminate=true
            }
            this.setState({
              applist:res.result.applist,
              plainOptions,
              allListValue,
              checkedList,              
              checkAll,
              indeterminate,
            })
          }
      })
  }
  handleSendData=(checkedList)=>{    
    let applist_src = this.state.applist;
    let applist =[]
    applist_src.forEach(function(item,index){
      
      if(checkedList.indexOf(item.appid)!=-1){
        item.app_switch = true
      }else{
        item.app_switch = false
      }
      applist.push(item)
    })

    let values ={...cgidata.cgidata56,appfilter:this.state.appfilter,applist:applist};     
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){                  
          message.success('设置成功');
          this.setState({appfilter_src:true})
        }
    }).then((res)=>{
      this.get_app_detail_config_by_name(this.state.config_name)
  })

  }
  

  handleSwitchChange=(checked)=>{
    if(checked==false && this.state.appfilter_src!=false){
      //关闭就发送给后台，开的时候只有在应用的时候才发送数据      
      let values ={...cgidata.cgidata56,appfilter:false,applist:this.state.applist};     
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){                  
            message.success('设置成功');
            //this.get_app_breaf_config()//重新获取后台数据/开关状态
            this.setState({appfilter_src:false})
          }
      })
      //.then((res)=>{
      //  let config_name=this.state.apptype[0].config_name;
      //  this.get_app_detail_config_by_name(config_name)
      //})
    }    
    this.setState({appfilter:checked})
  }
  
  renderAppType=(apptype)=>{
    let {plainOptions,allListValue,checkedList,checkAll,indeterminate}=this.state;
    if(apptype==[]){
      return <p>数据跑丢了...</p>
    }
    return apptype.map((item,index)=>{     
      if(item.typeid==1)
        return (
          <TabPane tab={item.apptype_cn} key={index} >
            <App plainOptions={plainOptions} 
            checkedList={checkedList}
            allListValue={allListValue}
            checkAll={checkAll}
            indeterminate={indeterminate}
            handleSendData={this.handleSendData}
            />            
          </TabPane>
        )
    })
  }
  callback=(key)=>{
    let this_ = this;
    let config_name = this.state.apptype[key].config_name;
    this.setState({
      checkedList:[],
      config_name 
    },function(){
      this_.get_app_detail_config_by_name(config_name)
    })
  }

  render() {   
    return (
          <Card title="应用过滤">
          <Form.Item {...formItemLayout} label="应用过滤">     
          <Switch 
              style={{marginBottom:20}}
              checkedChildren="开" 
              unCheckedChildren="关" 
              defaultChecked
              checked={this.state.appfilter}
              onChange={this.handleSwitchChange}
          />
          </Form.Item>
          {
            this.state.appfilter==false?null:

            <Tabs type="card" onChange={this.callback} animated={false}  defaultActiveKey="0">
              {this.renderAppType(this.state.apptype)}
            </Tabs>
          }
          </Card>
    )
  }
}

class App extends React.Component {
  state = {
    //被选上的
    checkedList:this.props.checkedList,// defaultCheckedList,
    //全选按键，非全选时的效果
    indeterminate: this.props.indeterminate,//false,//true,
    //全选效果
    checkAll: this.props.checkAll,//false,
    //复选框组：列表的标签与值一一对应
    plainOptions:this.props.plainOptions,
    //用于全选和全不选的列表
    allListValue:this.props.allListValue,
  };      

  componentWillReceiveProps(nextProps){
    
      if(this.props!=nextProps){      
          this.setState({  
            checkedList:nextProps.checkedList,                    
            plainOptions:nextProps.plainOptions,
            allListValue:nextProps.allListValue,
            indeterminate:nextProps.indeterminate,
            checkAll:nextProps.checkAll,
          })                
      }
  }

  onChange = (checkedList) => {
    let {plainOptions} = this.state;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }

  onCheckAllChange = (e) => {
    let {allListValue} = this.state
    this.setState({
      checkedList: e.target.checked ? allListValue : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  handleApply=()=>{
    
    this.props.handleSendData(this.state.checkedList)
  }
  render() {
    return (
      <div>
        <div /*style={{ borderBottom: '1px solid #E9E9E9' }}*/>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全选
          </Checkbox>
        </div>
        <br />
        <CheckboxGroup options={this.state.plainOptions} value={this.state.checkedList} onChange={this.onChange} />
        <Button type="primary" style={{display:"block", marginTop:20}} onClick={this.handleApply}>应用</Button>
                   
      </div>
    );
  }
}
