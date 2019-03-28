
import React from 'react';
import {Table, Button, Modal, Select} from 'antd';
import {secondsToFormatTime} from '@/utils/utils';
const { Option } = Select;
export default class ApList extends React.Component{    
 
  constructor(props) {
    super(props);
    this.showDrawerFlag = false;//用它来决定是否显示
    this.columns = [{
      title: '备注名称',
      dataIndex: 'apname',
      render: text => <a href="javascript:;" onClick={()=>this.showDrawerFlag = true}>{text}</a>,
    }, {
      title: 'IP地址',
      dataIndex: 'ipaddr',
    render: text => {
        let href = "http://"+text
        return <a href={href} target="blank" /*onClick={this.showDetail}*/>{text}</a>},
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
      render: text => secondsToFormatTime(text)  ,
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
    group_info:this.props.group_info,
    movegid:"",
    visible:false
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps!== this.props) {

      this.setState({
        breaf_apinfo:nextProps.breaf_apinfo,
        group_info:nextProps.group_info,
      })
      if(this.props.breaf_apinfo!=nextProps.breaf_apinfo){        
        this.setState({
          selectedRowKeys:[],
        })
      }
    }
  }
  
  handleDeleteSelectList = ()=>{    
    Modal.confirm({
      title: '确认删除',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk:() =>{

        let apid = this.state.apid_forSelect
        /**去掉选择的勾 */
        this.setState({
          selectedRowKeys:[],
        })
        this.props.handleDeleteSelectAp(apid)        
      },
      onCancel() {
      },
    });    
  }
    
  onRowClick=( clickRowContext,clickRowKey) => {
    this.setState({ 
      apid:clickRowContext.apid ,
      apname:clickRowContext.apname
    });
    if(this.showDrawerFlag){
      this.props.showDetail(clickRowContext.apid,clickRowContext.apname)
      this.showDrawerFlag=false
    }
  }
  handleMoveSelectAp=()=>{
    /**发送分组和AP到后台 */
    let gid=this.state.movegid
    let apid = this.state.apid_forSelect
    this.props.handleMoveSelectAp(gid,apid)
    this.setState({visible:false})
  }

  showModal=()=>{
    this.setState({visible:true})
  }
  hideModal=()=>{
    this.setState({visible:false})
  }
  
  renderGroupMsg=(group_info)=>{      
    return group_info.map((item)=>{      
      return (
        <Option value={item.gid}>{item.groupname}</Option>
      )
    })
  }
  handleMoveGroupId=(value)=>{
    this.setState({movegid:value})
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
  const hasSelected = this.state.breaf_apinfo.length!=0 && selectedRowKeys.length > 0;

    return (
      <Table 
        rowSelection={rowSelection} 
        bordered
        onRowClick={this.onRowClick} 
        columns={this.columns} 
        dataSource={this.state.breaf_apinfo}
        footer={() => 
          <div>
              <Button type="danger"   
                style={{marginRight:20}}  
                onClick={this.handleDeleteSelectList} 
                disabled={!hasSelected}
              >删除所选</Button>

              <Button
                onClick={this.showModal}     
                disabled={!hasSelected}                       
              >移动到分组</Button>

              <Modal
                title="移动AP到分组"
                visible={this.state.visible}
                onOk={this.handleMoveSelectAp}
                onCancel={this.hideModal}
                okText="确定"
                cancelText="取消"
                destroyOnClose={true}
                maskClosable={false}
              >
                请选择移动到的分组：
                <Select defaultValue="1" style={{width:180}} onChange={this.handleMoveGroupId}>
                {
                  this.renderGroupMsg(this.state.group_info)
                }
                </Select>
              </Modal>
          </div>
        }  
      /> 
    )
  }
}
