import React from 'react';
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import ApRadio from '../ApRadio'
import { Radio, Drawer, Form, Button,  Input, Tabs,Collapse,message } from 'antd';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

class DrawerForm extends React.Component{
  state = { 
    drawerVisible: this.props.visible ,
    apid:this.props.apid,
    apname:this.props.apname,
    //gid:this.props.gid,
    showRadio0:this.props.showRadio0,
    showRadio1:this.props.showRadio1,
    radio0_config:this.props.radio0_config,
    radio1_config:this.props.radio1_config,
    detail_apinfo:this.props.detail_apinfo,
    apid:this.props.apid,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props ) {
      //刷新form表单
      //this.props.form.resetFields();
      if(this.props.apname!=nextProps.apname)
        this.props.form.resetFields();
      this.setState({
        apid: nextProps.apid,
        apname:nextProps.apname,
        radio0_config:nextProps.radio0_config,
        radio1_config:nextProps.radio1_config,
        detail_apinfo:nextProps.detail_apinfo,
        showRadio0:nextProps.showRadio0,
        showRadio1:nextProps.showRadio1,
      },function(){
      })
    }
  }

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  onClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };
  handleRadioClick0=()=>{
    this.setState({
      showRadio0:true,
      showRadio1:false,
    })
  }
  handleRadioClick1=()=>{
    this.setState({
      showRadio1:true,
      showRadio0:false
    })
  }
  handleSetApName=(apname)=>{
    let apid = this.state.apid
    apname = apname.state.value
    this.props.handleSetApName(apid,apname)
  }

  handleRadio=(radio_config)=>{
    let radioid = this.state.showRadio0?"1":"0"
    let apid = this.state.apid
    
    this.handleRadioForm.props.form.validateFields((err, values) => {
      if (!err) {
          radio_config.beacon=values.beacon
      }
    });         
    let values = {apid,radioid,...radio_config,...values,...cgidata.cgidata33}

    axios.ajax_post({
      data:values
    }).then((res)=>{
        if(res.restcode == 2000){    
          message.success('设置成功')      
        }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { radio_type , reason,runstate} = this.state.detail_apinfo;
    return (
      <div>
        <Drawer
          title="属性列表"
          width={452}
          onClose={this.props.onClose}
          visible={this.state.drawerVisible}
          mask={false}
        >
          
          <Tabs defaultActiveKey="1" /*onChange={this.callback}*/>
            <TabPane tab="详细信息" key="1">            
              <Collapse  defaultActiveKey={['1']} onChange={this.callback}>
                <Panel header="概览" key="1">
                
                    <dl className="list-row">
                      <dt>MAC地址</dt>
                      <dd>{this.state.detail_apinfo.mac}</dd>
                    </dl>
                    <dl className="list-row">
                      <dt>IP地址</dt>
                      <dd>{this.state.detail_apinfo.ipaddr}</dd>
                    </dl>
                    <dl className="list-row">
                      <dt>型号</dt>
                      <dd>{this.state.detail_apinfo.model}</dd>
                    </dl>
                    <dl className="list-row">
                      <dt>软件版本号</dt>
                      <dd>{this.state.detail_apinfo.version}</dd>
                    </dl>
                    <dl className="list-row">
                      <dt>运行时间</dt>
                      <dd>{this.state.detail_apinfo.uptime}</dd>
                    </dl>
                    <dl className="list-row">
                      <dt>射频类型</dt>
                      <dd>{radio_type=="0"?"无射频":
                            radio_type=="1"?"2.4G":
                            radio_type=="2"?"5G":
                            radio_type=="3"?"2.4G+5G":"未知"}</dd>
                    </dl>
                    <dl className="list-row">
                      <dt>加入时间</dt>
                      <dd>{this.state.detail_apinfo.jointime}</dd>
                    </dl>
                    <dl className="list-row">
                      <dt>原因</dt>
                      <dd>{reason=="0"?"正常":
                            reason=="1"?"网络故障":
                            reason=="2"?"心跳失败":
                            reason=="3"?"数据错误":
                            reason=="4"?"重置":
                            reason=="5"?"重启":
                            reason=="6"?"升级":"未知"}</dd>
                    </dl>
                    <dl className="list-row">
                      <dt>运行状态</dt>
                      <dd>{runstate=="0"?"离线":
                            runstate=="1"?"发现":
                            runstate=="2"?"认证":
                            runstate=="3"?"加入":
                            runstate=="4"?"配置":
                            runstate=="5"?"数据检查":
                            runstate=="6"?"运行":
                            runstate=="7"?"升级中":
                            runstate=="8"?"重置中":
                            runstate=="9"?"重启中":"未知"}</dd>                      
                    </dl>

                </Panel>
              </Collapse>
            </TabPane>

            <TabPane tab="配置" key="2">            
              <Collapse defaultActiveKey={['1']} accordion onChange={this.callback}>
                <Panel header="基本" key="1">                
                  <Form>
                      <Form.Item  label="AP备注名称">
                      {getFieldDecorator('apname', {
                          rules: [
                              { required: true, message: '请输入AP名称!' }], 
                              initialValue:this.state.apname
                      })(
                          <Input ref={(input) => {this.apname = input}} />
                      )}
                      </Form.Item>
                      <Form.Item >
                          <Button type="primary" style={{width:132}} onClick={ ()=>this.handleSetApName(this.apname)}                        
                          >应用</Button>
                      </Form.Item>
                  </Form>
                </Panel>

                <Panel header="射频基本配置" key="2" >    
                  {
                    (this.state.radio0_config=={}||this.state.radio0_config==undefined)&&
                    (this.state.radio1_config=={}||this.state.radio1_config==undefined)?"没有需要显示的网卡":
                  <div>
                    选择网卡：
                    <Radio.Group defaultValue={this.state.radio0_config=={}||this.state.radio0_config==undefined?"1":"0"}
                    value={this.state.showRadio0==true?"0":"1"}
                    buttonStyle="solid"  size="small">
                      {
                        this.state.radio0_config=={}||this.state.radio0_config==undefined?null:
                        <Radio.Button style={{width:132,marginBottom:20,textAlign:"center"}} 
                        value="0" onClick={this.handleRadioClick0}
                        >2.4G</Radio.Button>
                        
                      
                      }
                    {
                      this.state.radio1_config=={}||this.state.radio1_config==undefined?null:
                      <Radio.Button style={{width:132,marginBottom:20,textAlign:"center"}}
                        value="1" onClick={this.handleRadioClick1}>
                        5G</Radio.Button>
                    }
                    </Radio.Group>
                    {
                      this.state.showRadio0==true?
                        <ApRadio 
                          showRadio0={true}
                          radio_config = {this.state.radio0_config}
                          handleRadio={this.handleRadio}
                          /*handleScanArpList = {this.handleScanArpList.bind(this)}*/
                          wrappedComponentRef={(inst)=>{this.handleRadioForm = inst;}}
                        />:this.state.showRadio1==true?
                        <ApRadio 
                          showRadio0={false}
                          radio_config = {this.state.radio1_config}
                          handleRadio={this.handleRadio}
                          wrappedComponentRef={(inst)=>{this.handleRadioForm = inst;}}
                        />:null//<Radio0/>
                      }
                  </div>
                }   
                </Panel>
              </Collapse>
            </TabPane>
          </Tabs>
          {/** 
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={this.props.onClose} type="primary">
              Submit
            </Button>
          </div>*/}
        </Drawer>
      </div>
    );
  }
}
  
  
export default  Form.create()(DrawerForm);


