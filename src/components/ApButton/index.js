import React from 'react';
import { Modal, Button, Input, Switch, message } from 'antd';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
const Search = Input.Search;
const confirm = Modal.confirm;

export default class GroupSetting extends React.Component{
    state={
      apid:this.props.apid,
      showUpgrade:this.props.showUpgrade,
      buttonDisable:this.props.buttonDisable,
      blink:false,
      visibleLED:false,
      visible:false,
      confirmLoading: false,      
      breaf_apinfo:this.props.breaf_apinfo,
      breaf_apinfo_src:this.props.breaf_apinfo,

    }
    
    componentWillReceiveProps(nextProps) {
      if (nextProps !== this.props ) {
          this.setState({
            apid:nextProps.apid,
            buttonDisable:nextProps.buttonDisable,
            breaf_apinfo:nextProps.breaf_apinfo,
            breaf_apinfo_src:nextProps.breaf_apinfo,
          })
      }
    }

    warning=()=> {
      Modal.warning({
        title: '请选择要选择的项！',
        okText:'确定',
        //content: 'some messages...some messages...',
      });
    }

    
    showModal = () => {
      this.setState({
        visible: true,
      });
    }

    handleOk = () => {
      let _this = this;
      let apid = this.state.apid
      let values ={apid,...cgidata.cgidata44}; 
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
            message.success('设置成功')
            this.props.getGroupMsg()
          }
      })      

      this.setState({
        ModalText: '窗口将在3秒后关闭...',
        confirmLoading: true,
      });
      setTimeout(() => {
        this.setState({
          visible: false,
          confirmLoading: false,
        });
        
        //重新去获取AP信息
        _this.props.getApListFromModel()
      }, 3000);
    }

    handleCancel = () => {
      this.setState({
        visible: false,
      });
    }
    
    handleApUpdata=()=>{
      let apid = this.state.apid
      if(apid==""){
        this.warning()
        return false;
      }     
      this.setState({visible:true})
/*
      confirm({
        title: '是否需要升级选择的AP?',
        content: '点击确定，设备将会重启',
        okText:'确定',
        cancelText:'取消',
        onOk() {
          axios.ajax_post({
            data:values
          }).then((res)=>{
              if(res.restcode == 2000){   
                console.log('success')
              }
          })      
        },
      });*/
    }

    handleApReboot=()=>{
      let apid = this.state.apid
      let values ={apid,...cgidata.cgidata43};      
      if(apid==""){
        this.warning()
        return false;
      }

      confirm({
        title: '是否需要重启选择的AP?',
        content: '点击确定，选中的AP将重启',
        okText:'确定',
        cancelText:'取消',
        onOk:() =>{
          axios.ajax_post({
            data:values
          }).then((res)=>{
              if(res.restcode == 2000){   
                message.success('配置下发成功')
                this.props.getGroupMsg()
              }
          })
        },
      });
    }

    handleApReset=()=>{
      let apid = this.state.apid;
      let values ={apid,...cgidata.cgidata42};    
      if(apid==""){
        this.warning()
        return false;
      }  
      confirm({
        title: '是否需要重置选择的AP?',
        content: '点击确定，设备将会重启',
        okText:'确定',
        cancelText:'取消',
        onOk:() =>{
          axios.ajax_post({
            data:values
          }).then((res)=>{
              if(res.restcode == 2000){   
                message.success('设置成功')
                this.props.getGroupMsg()   
              }
          })   
        },
      });
    }

    handleApLedSetting=()=>{      
      let apid = this.state.apid;
      let blink = this.state.blink;
      let values ={apid,blink,...cgidata.cgidata45};    
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
            message.success('设置成功')
            this.props.getGroupMsg()
          }
      })
      this.setState({visibleLED:false,blink:false},()=> {
        this.props.getGroupMsg()
      })
    }

    showLedModal=()=>{
      if(this.state.apid==""){
        this.warning()
        return false;
      }  
      this.setState({visibleLED:true})
    }

    hideLedModal=()=>{
      this.setState({visibleLED:false,blink:false})
    }

    handleBlink=(value)=>{
      this.setState({blink:value})
    }

    handleSearch=(value)=>{
      let searchList = this.state.breaf_apinfo;
      let newList = []
      if(value == ''){
        this.props.handleFilterList(null,true)
      }else{
        searchList.forEach(function (item,index) {  
          if(item.apname.indexOf(value)!=-1 ||item.mac.indexOf(value)!=-1 ){
            newList.push(item)
          }
        })
        this.props.handleFilterList(newList,false)
      }      
    }
    render(){
      return(
  
      <div className="context">
          {/** 
            <Input
              prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              style={{ width: 200 }}
              size="small"
              placeholder="名称/MAC"
            />
          */}
      
          <Search
            enterButton
            size="small"
            placeholder="备注名称/MAC地址"
            onSearch={this.handleSearch}
            style={{ width: 200 }} 
            //ref={node => {console.log(this.searchInput); this.searchInput = node; }}
          />
          {
            this.state.showUpgrade==true?
            <div style={{display:"inline-block"}}>       
            <Button type="primary" size="small" style={{ marginRight:20,marginLeft:20,marginBottom:20}}
            onClick={this.handleApUpdata}
            //onClick={this.showModal}
            disabled={this.state.buttonDisable}          >升级</Button>
            <Button type="primary" size="small" 
            onClick={this.props.getGroupMsg} 
            /*disabled={this.state.buttonDisable}*/          >刷新</Button>
            </div>
            :
            <div style={{display:"inline-block"}}>              
              <Button type="primary" size="small" style={{ marginLeft:20,marginBottom:20}}
              onClick={this.handleApReboot}          >重启</Button>

              <Button type="primary" size="small" style={{ marginRight:20,marginLeft:20 }}
              onClick={this.handleApReset}          >复位</Button>

              <Button type="primary" size="small" style={{ marginRight:20 }}
              onClick={this.showLedModal}          >LED设置</Button>

              <Button type="primary" size="small" 
              onClick={this.props.getGroupMsg}          >刷新</Button>
            </div>
          }

          <Modal
            title="升级选中AP"
            visible={this.state.visible}
            onOk={this.handleOk}
            okText="确定"
            cancelText="取消"
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}
          >
            <p>点击确定，选中的AP将重启！</p>
          </Modal>

          <Modal
              title="LED设置"
              visible={this.state.visibleLED}
              onOk={this.handleApLedSetting}
              onCancel={this.hideLedModal}
              okText="确认"
              cancelText="取消"
              destroyOnClose={true}
          >
          <span>LED闪烁：</span>
          <Switch 
                  checkedChildren="开" 
                  unCheckedChildren="关" 
                  checked={this.state.blink}
                  onChange={this.handleBlink}
                  />
          </Modal>

        </div>
      )
    }
  }
  
  