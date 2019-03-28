
import React from 'react';
import {Table} from 'antd';

export default class ApList extends React.Component{    
 
  constructor(props) {
    super(props);
    this.columns = [{
      title: '备注名称',
      dataIndex: 'apname',
      render: text => <a href="javascript:;" >{text}</a>,
    }, {
      title: 'IP地址',
      dataIndex: 'ipaddr',
    render: text => {
        let href = "http://"+text
        return <a href={href} target="blank">{text}</a>},
    }, {
      title: 'MAC地址',
      dataIndex: 'mac',
    }, {
      title: '接入点型号',
      dataIndex: 'model',
    }, {
      title: '软件版本号',
      dataIndex: 'version',
    }, {
      title: '运行时间',
      dataIndex: 'uptime',
      render: text => this.secondsToFormatTime(text)  ,
    }, {
      title: '加入时间',
      dataIndex: 'jointime',
    }, {
      title: '状态',
      dataIndex: 'runstate',
      render: (text, record) => {
        switch(text){
          case '0':
            return <span>离线</span>
          case '1':
            return <span>发现</span>
          case '2':
            return <span>认证</span>
          case '3':
            return <span>加入</span>
          case '4':
            return <span>配置</span>
          case '5':
            return <span>数据检查</span>
          case '6':
          return <span style={{color: "#40dc40"}}>运行</span>
          case '7':
            return <span style={{color: "red"}}>升级中</span>
          case '8':
            return <span style={{color: "#ffc107"}}>重置中</span>
          case '9':
          return <span style={{color: "#2d38bd"}}>重启中</span>
          default:
            return <span>未知</span>
        }
      }
    }];
    
  }

  state={
    selectedRowKeys:[],
    apid:'1',
    apname:	"",
    apid_forSelect:'',//用于给AP升级，字符串形式如"1", "1,3,4,8"
    breaf_apinfo:this.props.breaf_apinfo,
    visible:false
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps!== this.props) {

      this.setState({
        breaf_apinfo:nextProps.breaf_apinfo,
      })
      if(this.props.breaf_apinfo!=nextProps.breaf_apinfo){        
        this.setState({
          selectedRowKeys:[],
        })
      }
    }
  }
  secondsToFormatTime=(seconds)=>{
    let text = parseInt(seconds);
    let secondTime = parseInt(seconds);// 秒
    let minuteTime = 0;// 分
    let hourTime = 0;// 小时
    let dayTime = 0;// 天
    if(text<60){
      if(text==0)
        return <span >--:--</span>
      return <span >{secondTime}秒</span>
    }
    else if(text > 60 && text < 3600){//如果秒数大于1分钟，小于1小时，
      minuteTime = parseInt(text / 60);
      secondTime = parseInt(text % 60);
      return <span >{minuteTime}分{secondTime}秒</span>
    }
    else if(text > 3600 && text < 3600*24){//如果秒数大于1小时，小于1天
      secondTime = parseInt(text % 60)
      minuteTime = parseInt(text / 60);
      hourTime = parseInt(minuteTime / 60);
      minuteTime = parseInt(minuteTime %60);            
      return <span >{hourTime}时{minuteTime}分{secondTime}秒</span>
    }
    else{//天
      secondTime = parseInt(text % 60)
      minuteTime = parseInt(text / 60);
      hourTime = parseInt(minuteTime / 60);
      minuteTime = parseInt(minuteTime %60);
      dayTime = parseInt(hourTime / 24);
      hourTime = parseInt(hourTime % 24);
      return <span >{dayTime}天{hourTime}时{minuteTime}分{secondTime}秒</span>
    }
  }
  
    
  onRowClick=( clickRowContext,clickRowKey) => {
    this.setState({ 
      apid:clickRowContext.apid ,
      apname:clickRowContext.apname
    });
  }

  

  render() {   
  const {  selectedRowKeys } = this.state;
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys,//用于在checked box的勾或不勾
    onChange: (selectedRowKeys, selectedRows) => {
      //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      let selectList = []
      selectedRows.forEach(function (value, index) {
        selectList.push(value.apid)
      })
      this.setState({
        apid_forSelect:selectList.toString(),
        selectedRowKeys
      })
      this.props.changeApidSelect(selectList.toString())
    }
  };
    return (
      <Table 
        rowSelection={rowSelection} 
        bordered
        onRowClick={this.onRowClick} 
        columns={this.columns} 
        dataSource={this.state.breaf_apinfo}
      /> 
    )
  }
}
