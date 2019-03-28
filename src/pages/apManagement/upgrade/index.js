
import React from 'react';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import ApModelGroup from '@/components/ApModelGroup'
import ApButton from '@/components/ApButton'
import ApModelList from '@/components/ApModelList'
import reqwest from 'reqwest';
import { Card, Form, Table, Input, Button,Modal,Upload, message, Icon, Tabs, Switch } from 'antd';

export default class NoMatch extends React.Component{    
  state={
    showVisibleAddModle:false,
    usb_storage:	1,
    apid_forSelect:'',//用于给AP升级，字符串形式如"1", "1,3,4,8"
		upgrade_info:	[/*{
				"fid":	"1",
				"model":	"123",
				"fwversion":	"0",
				"active":	"0",
        "file":	"",
        "key":"1"
			}, {
				"fid":	"3",
				"model":	"VAAA",
				"fwversion":	"123",
				"active":	"1",
				"file":	"VAAA-123.bin",
        "key":"2"
      }*/],
      model_info:	[/*{
				"model":	"v2c"
			}, {
				"model":	"v1c"
			}, {
				"model":	"BBCC"
			}, {
				"model":	"Baba"
			}, {
				"model":	"bebe"
			}, {
				"model":	"LIHUAXIA"
			}, {
				"model":	"vi"
      }*/],    
      model:"",  
      breaf_apinfo:	[/*{
        "apid":	"9",
        "apname":	"vista_ap",
        "ipaddr":	"192.168.208.130",
        "mac":	"00:19:BE:20:03:EF",
        "model":	"v2c",
        "version":	"155",
        "uptime":	"1190",
        "jointime":	"02-23 05:17",
        "runstate":	"3"
      }, {
        "apid":	"2",
        "apname":	"AP_AA",
        "ipaddr":	"192.168.7.98",
        "mac":	"00:19:BE:20:03:AA",
        "model":	"v2c",
        "version":	"155",
        "uptime":	"0",
        "jointime":	"02-21 03:22",
        "runstate":	"0"
      }*/],      
      breaf_apinfo_src:	[/*{
        "apid":	"9",
        "apname":	"vista_ap",
        "ipaddr":	"192.168.208.130",
        "mac":	"00:19:BE:20:03:EF",
        "model":	"v2c",
        "version":	"155",
        "uptime":	"1190",
        "jointime":	"02-23 05:17",
        "runstate":	"3"
      }, {
        "apid":	"2",
        "apname":	"AP_AA",
        "ipaddr":	"192.168.7.98",
        "mac":	"00:19:BE:20:03:AA",
        "model":	"v2c",
        "version":	"155",
        "uptime":	"0",
        "jointime":	"02-21 03:22",
        "runstate":	"0"
      }*/]      
	
  }

  componentDidMount(){
    this.getApUpgradeInfo();
    this.getApmodelList()
  }     

  getApmodelList=()=>{
    let model;
    let values ={...cgidata.cgidata50};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){  
            if(res.result.model_info.length>0){
              model=res.result.model_info[0].model;
            }else{
              model=''
            }
            this.setState({
              model_info:res.result.model_info,
              model
            })
          }
          this.getApListFromModel(model)
      })
  }

  getApListFromModel=(model=this.state.model)=>{
    this.setState({model:model})
    let values ={model,...cgidata.cgidata51};      
    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){            
          let breaf_apinfo = []
          breaf_apinfo = res.result.breaf_apinfo.map((item, index) => {
            item.key = index;
            return item;
          });
          this.setState({
            breaf_apinfo:breaf_apinfo,
            breaf_apinfo_src:breaf_apinfo,
            apid_forSelect:"",
          })
        }
    })
}
  getApUpgradeInfo=()=>{
    let values ={...cgidata.cgidata46};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){  
            let upgrade_info = []
            upgrade_info = res.result.upgrade_info.map((item, index) => {
              item.key = index;
              return item;
            });
            this.setState({
              usb_storage:res.result.usb_storage,
              upgrade_info:upgrade_info,
            })
          }
      })
  }

  deleteApUpgradeInfo=(fid)=>{
    let values ={...cgidata.cgidata47,fid};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){
            message.success('删除成功')   
            this.getApUpgradeInfo()       
          }
      })
  }

  showAddApItem=()=>{
    this.setState({
      showVisibleAddModle:true,
    })    
  }

  handleUploadAp=(values)=>{
    const { fileList } = values;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });
    let upgradeurl = `cgi-bin/cgi_stream.cgi?streamid=5&model=${values.model}&fwversion=${values.fwversion}&active=${values.active}`
    // You can use any AJAX library you like
    reqwest({
      url: upgradeurl,
      method: 'post',
      processData: false,
      data:formData,
      success: (resp) => {
        let res = JSON.parse(resp)
        if(res.restcode === 2000){
          //Util.countDown_restart(res.locktime);
          /**重新获取新数据 */
          this.getApUpgradeInfo();
        }else if(res.restcode == 4008){            
            message.error('文件格式错误.');
        }
      },
      error: () => {
        message.error('upload failed.');
      },
    });
    this.setState({
      showVisibleAddModle:false
    })
  }

  changeApidSelect=(value)=>{
    this.setState({apid_forSelect:value})
  }

  hideAddApModal=()=>{
    this.setState({
      showVisibleAddModle:false,
    })    
  }

  handleFilterList=(newList,srcflage)=>{
    if(srcflage){//搜索框内容为空时用原来的数据
      let newList = this.state.breaf_apinfo_src;
      this.setState({breaf_apinfo:newList})
    }else{      
      this.setState({breaf_apinfo:newList})
    }
  }
  getGroupMsg=()=>{
    this.getApListFromModel(this.state.model)
  }
  render(){

    const TabPane = Tabs.TabPane;

    return (
      <Card title="AP升级">
        <Tabs defaultActiveKey="1" onChange={this.callback} animated={true} tabPosition="top">
          <TabPane tab="AP版本" key="1">
            {
              this.state.usb_storage=="0"?
              <p>抱歉：升级功能需要接入USB存储设备才能使用！</p>
              :
              <APversion
                usb_storage={this.state.usb_storage}
                upgrade_info={this.state.upgrade_info}
                deleteApUpgradeInfo={this.deleteApUpgradeInfo}
                showAddApItem={this.showAddApItem}
              />
            }
            
            <AddAPversion_
              showVisibleAddModle={this.state.showVisibleAddModle}
              handleUploadAp={this.handleUploadAp}
              hideAddApModal={this.hideAddApModal}
              //wrappedComponentRef={(inst)=>{this.addApVersionForm = inst}}
            />
          </TabPane>

          <TabPane tab="AP型号" key="2">     

            <ApModelGroup 
              model_info={this.state.model_info}
              getApListFromModel={this.getApListFromModel}
            />

<br/>
          <ApButton 
            apid={this.state.apid_forSelect}//这个一会从那个列表的选择里面拿过来
            getGroupMsg={this.getGroupMsg}
            showUpgrade={true}//只显示升级按纽，其他不显示
            buttonDisable={this.state.usb_storage==0?true:false}
            getApListFromModel={this.getApListFromModel}
            
            breaf_apinfo={this.state.breaf_apinfo}//要搜索的列表            
            handleFilterList={this.handleFilterList}
          />

            <ApModelList
              breaf_apinfo={this.state.breaf_apinfo}
              changeApidSelect={this.changeApidSelect}
            />
          </TabPane>
        </Tabs>
      </Card>
    )        
  }
}


class AddAPversion extends React.Component{
  state={
    visibleAddAp:this.props.showVisibleAddModle,
    fileList: [],
    model:"",
    fwversion:"",
    active:"0",
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showVisibleAddModle!== this.props.visibleAddAp) {
      if(nextProps.showVisibleAddModle==false){
        this.setState({
          visibleAddAp:nextProps.showVisibleAddModle,
          fileList: [],
        })

      }else{
        this.setState({
          visibleAddAp:nextProps.showVisibleAddModle,
        })

      }
    }
  }
  beforeUpload =(file)=> {//上传中、完成、失败都会调用这个函数。
    //let fileList = [file];
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    //fileList = fileList.slice(-1);
    this.setState({ fileList:[file] });
    return false
  }

  handleAddApItem=()=>{
    this.props.form.validateFields((err, values) => {
      if(!err){
        this.setState({                
          model:values.model,
          fwversion:values.fwversion,
        },function(){                
            this.props.handleUploadAp(this.state);
        })
      }
    })
  }

  handleActive=(value)=>{
    if(value==true){
      this.setState({active:"1"})
    }else{
      this.setState({active:"0"})
    }
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
        labelCol: {span: 8},
        wrapperCol: {span: 12}
    };
    const props = {
      name: 'file',
      beforeUpload:  this.beforeUpload,      
      accept:".bin",
    };
    return(
      <div>
        <Modal
            title="增加条目"
            visible={this.state.visibleAddAp}
            onOk={this.handleAddApItem}
            onCancel={this.props.hideAddApModal}
            okText="确认"
            cancelText="取消"
            destroyOnClose={true}
        >
            <Form>
              <Form.Item label="接入点型号" {...formItemLayout}>
                  {
                      getFieldDecorator('model', {
                          initialValue: '',
                          rules: [{ required:true, message:'接入点型号不能为空!'}]
                      })(
                          <Input placeholder="请输入型号" />
                      )
                  }
              </Form.Item>
              <Form.Item label="软件版本号" {...formItemLayout}>
                  {
                      getFieldDecorator('fwversion', {
                          initialValue: '',
                          rules: [{ required:true, message:'软件版本号不能为空!'},
                          {                             
                            //pattern:new RegExp('^([3-6])$'),
                            message:'软件版本号只能为数字！'
                       }],
                      })(
                          <Input placeholder="请输入型号" />
                      )
                  }
              </Form.Item>
              <Form.Item label="版本文件" {...formItemLayout}>
                <Upload {...props} fileList={this.state.fileList}>
                  <Button style={{width:237}} >
                    <Icon type="upload" /> 点击上传文件
                  </Button>
                </Upload>
              </Form.Item>
              <Form.Item label="激活状态" {...formItemLayout}>
                  <Switch 
                  checkedChildren="开" 
                  unCheckedChildren="关" 
                  onChange={this.handleActive}/>
              </Form.Item>
            </Form>
        </Modal>
      </div>      
    )
  }

}
const AddAPversion_ = Form.create()(AddAPversion);

class APversion extends React.Component{

  state={
    usb_storage:this.props.usb_storage,
    upgrade_info:this.props.upgrade_info,
    selectedRowKeys: [],
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps!== this.props) {
      //刷新form表单
      this.setState({
        usb_storage:nextProps.usb_storage,
        upgrade_info:nextProps.upgrade_info
      })
    }
  }

  handleDeleteDhcpSelectList = (fid)=>{    
    Modal.confirm({
      title: '确认删除',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk:() =>{
        this.props.deleteApUpgradeInfo(fid)      
      },
      onCancel() {
      },
    });    
  }
    
  onSelectChange = (selectedRowKeys) => {
    //console.log(selectedRowKeys)
    this.setState({ selectedRowKeys });
  }
  render(){
    //console.log(this.state.result.arpbind_list,this.state.result.enable)
    const {  selectedRowKeys } = this.state;
    const rowSelection = {
    selectedRowKeys,
    onChange: this.onSelectChange,
    };      
    const hasSelected = this.state.upgrade_info.length!=0 && selectedRowKeys.length > 0;
    
    this.upgradeInfocolumns = [{
      title: '接入点型号',
      dataIndex: 'model',
    }, {
      title: '软件版本号',
      dataIndex: 'fwversion',
    }, {
      title: '版本文件',
      dataIndex: 'file',
    }, {
      title: '激活状态',
      dataIndex: 'active',
      render: (text) => <Switch disabled defaultChecked={text=="0"?false:true} />,
    },{
      title: '删除',
      dataIndex: 'fid',
      key:'2',
      render: (text, record) => (
        <Button type="danger"  onClick={()=>this.handleDeleteDhcpSelectList(text)}>删除</Button>    
      )
    }];
    return(

      <div>
      <Table
          bordered
          columns={this.upgradeInfocolumns}
          dataSource={this.state.upgrade_info}
          rowSelection={rowSelection}
          pagination={true}
          fixed={false}
          footer={() => 
          <div>
              <Button style={{marginRight:20}}  
                  onClick={this.props.showAddApItem}                            
              >增加条目</Button>

          </div>
          }
      />
      </div>
      
    )
  }

}