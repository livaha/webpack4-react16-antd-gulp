import React from 'react';
import { Card, Form, Table, Input, Button,Modal,Switch} from 'antd';
import {actionCreater } from './store'
import {connect} from 'react-redux'
import {formItemLayout,tailFormItemLayout} from '@/config/input_layout'
import {ipPoolRange} from '@/utils/utils'

const arpcolumns = [{
    title: 'ip地址',
    dataIndex: 'ip',
  }, {
    title: 'mac地址',
    dataIndex: 'mac',
  }];
  
class Dhcp extends React.Component{    
    constructor(props) {
        super(props);

        this.dhcpcolumns = [{
            title: 'ip地址',
            dataIndex: 'ip',
          }, {
            title: 'mac地址',
            dataIndex: 'mac',
          }, {
            title: '主机名',
            dataIndex: 'name',
          }, {
            title: '租约时间',
            dataIndex: 'leasetime',
          }, {
            title: '操作',
            dataIndex: 'action',
            //render: () => <Button type="danger" >Delete</Button>,
            render: (text, record) => (
               this.props.dhcpList.length >= 1
                ? (
                <Button type="danger" onClick={() => this.handleDhcpDelete(record.key,this.props.dhcpList)} >删除</Button>
                ) : null
            ),
          }];
    }
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        ipaddr:'',
        macaddr:'',
    };

    /**整合一下要发送的数据格式 */
    combindDataFormat(data){   
        let enable = this.props.enable;
        let startip = this.props.startip
        let endip = this.props.endip
        let leasetime = this.props.leasetime
        let static_dhcp = data
        let values = {enable,startip,endip,leasetime,static_dhcp}
        return values
    }
    
    handleDhcpDelete = (key,dataList) => {
        Modal.confirm({
            title: '确认删除',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                dataList = dataList.filter(item => item.key !== key)
                let values = this.combindDataFormat(dataList)
                this.props.handleSetDhcpMsg(values)
                this.props.getDhcpmsg();
            },
            onCancel() {
              //console.log('Cancel');
            },
        });
        
    }

    handleDeleteDhcpSelectList = (selectList)=>{
        
        Modal.confirm({
            title: '确认删除',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                let selectedRowKeys = this.state.selectedRowKeys
                selectedRowKeys.forEach(function (value, index) {
                    selectList = selectList.filter(item => item.key !== value)
                    //console.log(selectList)
                })
                this.setState({selectedRowKeys: []})
                let values = this.combindDataFormat(selectList)
                this.props.handleSetDhcpMsg(values)
                this.props.getDhcpmsg();  
            },
            onCancel() {
              //console.log('Cancel');
            },
        });
    }
    
    hideModal1 = () => {
        this.setState({
            visible1: false,
        });
    }
    
    handleSetDhcpItem = () => {
        
        let static_dhcp = this.props.dhcpList;
        let flag = false
        
        /**判断书写格式是否正确，格式错误则返回 */
        let dchpItem={}
        let formatErr = false //false为格式正确
        this.dchpItemForm.props.form.validateFields((err, values) => {
            if (!err) {
                dchpItem = values
                formatErr = false
            }
            else{
                formatErr = true
            }
        });   
        //格式不对则返回重新
        if  (formatErr)  return false

        /**判断是否有重复的数据，重复则返回 */
        if(static_dhcp.length<1)
            flag = true
        else{
            flag = static_dhcp.every(item=>{
                if(item.ip == dchpItem.ip){
                    Modal.error({
                        title: '添加失败',
                        content: `IP ：${dchpItem.ip}已经存在!`,
                      });
                }
                else if(item.mac == dchpItem.mac){
                    Modal.error({
                        title: '添加失败',
                        content: `MAC ：${dchpItem.mac}已经存在!`,
                    });
                }
                return (item.ip != dchpItem.ip && item.mac != dchpItem.mac)
            })
        }
        if(flag){
            let value = {...dchpItem,key:static_dhcp.length}
            static_dhcp.push(value)
            
            let values = this.combindDataFormat(static_dhcp)
            this.props.handleSetDhcpMsg(values)

            this.setState({
                visible1: false,
            });
        }

    }    
    
    hideModal2 = () => {
        this.setState({
            visible2: false,
            visible1: true,
        });
    }
      
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    componentDidMount(){
        this.props.getDhcpmsg();
    }
    handleSetDhcpMsg=()=>{        
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(ipPoolRange(this.props.minip,this.props.maxip,values.startip,values.endip)){                            
                    let static_dhcp = this.props.dhcpList;
                    let enable = this.props.enable;
                    values = {enable,...values,static_dhcp}
                    this.props.handleSetDhcpMsg(values) 
                }else{
                    return false
                }
            }
        });         
    }
    handleSwitchChange=(checked)=>{ 
        let enable = checked;
        let startip = this.props.startip
        let endip = this.props.endip
        let leasetime = this.props.leasetime
        let static_dhcp = this.props.dhcpList
        let values = {enable,startip,endip,leasetime,static_dhcp}
        if(checked==true){     
            this.props.handleSetDhcpMsg(values)   
            this.props.handleSetSwitch(checked)
            //this.props.getDhcpmsg();
        }else if(checked==false){            
            this.props.handleSetDhcpMsg(values)
            this.props.handleSetSwitch(checked) 
        }
    }
    handleAddList=()=>{
        //this.showModal1()
        this.setState({
            visible1: true,
        });
    }
    handleScanArpList=()=>{
        this.setState({
            visible2: true,
            visible1:false
          });
        this.props.getArpListmsg()
    }
    
    onRowClick=(selectedRowKeys, selectedRows) => {
        this.setState({
            visible2: false,
            visible1: true,
            ipaddr:selectedRowKeys.ip,
            macaddr:selectedRowKeys.mac
        });
      }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {enable,startip,endip,leasetime,dhcpList,arpList,minip,maxip } = this.props;
        const {  selectedRowKeys } = this.state;
        const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
        };        
        const hasSelected = dhcpList.length!=0 && selectedRowKeys.length > 0;
        

        return(
            <div>
            <Card title="DHCP设置">
                <Form.Item {...formItemLayout} label="DHCP设置">                
                <Switch 
                    style={{marginBottom:20}}
                    checkedChildren="开" 
                    unCheckedChildren="关" 
                    defaultChecked
                    checked={enable}
                    onChange={this.handleSwitchChange}
                />
                </Form.Item>
                {enable==false?null:
                <Form >
                    <Form.Item {...formItemLayout} label="DHCP起始地址">
                    {getFieldDecorator('startip', {
                        rules: [
                            { required: true, message: 'DHCP起始地址不能为空!' },
                            {
                                pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                                message:'DHCP起始地址格式不正确！'
                           }], 
                        initialValue:startip
                    })(
                        <Input />
                    )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="DHCP结束地址">
                    {getFieldDecorator('endip', {
                        rules: [
                            { required: true, message: 'DHCP结束地址不能为空!' },
                            {
                                pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                                message:'DHCP结束地址格式不正确！'
                           }], 
                        initialValue:endip
                    })(
                        <Input />
                    )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="DHCP租约时间(s)">
                    {getFieldDecorator('leasetime', {
                        rules: [{ required: true, message: 'DHCP租约时间不能为空!' },
                        {
                            pattern:new RegExp('^([6-9]\\d|\\d{3,4}|[1-7]\\d{4}|8[0-5]\\d\\d\\d|86[0-3]\\d\\d|86400)$'),
                            message:'DHCP租约时间只能为60-86400'
                       }], 
                        initialValue:leasetime
                    })(                        
                        <Input />
                    )}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" onClick={this.handleSetDhcpMsg}>
                        应用
                    </Button>
                    </Form.Item>
                </Form>
                }
            </Card>
            {enable==false?null:
            <Card title="DHCP静态列表">
            
            <Table
                bordered
                columns={this.dhcpcolumns}
                dataSource={dhcpList}
                rowSelection={rowSelection}
                pagination={false}
                fixed={false}
                footer={() => 
                <div>
                    <Button style={{marginRight:20}}  
                        onClick={this.handleAddList}                            
                    >增加条目</Button>

                    <Button type="danger"  
                        onClick={()=>this.handleDeleteDhcpSelectList(dhcpList)} 
                        disabled={!hasSelected}
                    >删除所选</Button>
                </div>
                }
            />

            <Modal
                title="增加条目"
                visible={this.state.visible1}
                onOk={this.handleSetDhcpItem}
                onCancel={this.hideModal1}
                maskClosable={false}
                destroyOnClose={true}
                okText="确认"
                cancelText="取消"
            >
                <AddDhcpItem 
                    ipaddr={this.state.ipaddr} 
                    macaddr={this.state.macaddr} 
                    minip={this.props.minip}
                    maxip={this.props.maxip}
                    leasetime={this.props.leasetime}
                    handleScanArpList = {this.handleScanArpList.bind(this)}
                    wrappedComponentRef={(inst)=>{this.dchpItemForm = inst;}}
                />
            </Modal>

            <Modal
                title="ARP列表"
                visible={this.state.visible2}
                maskClosable={false}
                onCancel={this.hideModal2}
                destroyOnClose={true}
                footer={<Button onClick={this.hideModal2}                        
                >关闭</Button>}
            >
                
                <Table
                    bordered
                    columns={arpcolumns}
                    dataSource={arpList}
                    pagination={false}
                    onRowClick={this.onRowClick}
                />
            </Modal>
            </Card>
            }
            </div>
        )
    }
}

const mapState = (state)=>{
    let dhcpList = state.getIn(['dchp','dhcpList']);
    let arpList = state.getIn(['dchp','arpList']);
    if(dhcpList.size == 0) dhcpList = []
    if(arpList.size == 0) arpList = []
    return({

    enable:state.getIn(['dchp','enable']),
    minip:state.getIn(['dchp','minip']),
    maxip:state.getIn(['dchp','maxip']),
    startip:state.getIn(['dchp','startip']),
    endip:state.getIn(['dchp','endip']),
    leasetime:state.getIn(['dchp','leasetime']),
    dhcpList,//:state.getIn(['dchp','dhcpList']),
    arpList
  })}
  
const mapDispatch = (dispatch) =>({
    getDhcpmsg(){
        dispatch(actionCreater.getDhcpmsg())
    },
    getArpListmsg(){
        dispatch(actionCreater.getArpListmsg())
    },
    handleSetDhcpMsg(values){
        dispatch(actionCreater.handleSetDhcpMsg(values))
    },
    handleSetSwitch(value){
        dispatch(actionCreater.setSwitch(value))
    }

})

const Dhcp_ = Form.create()(Dhcp);
export default connect(mapState,mapDispatch)(Dhcp_)


class AddDhcpItem extends React.Component{

    state={
        ipaddr :this.props.ipaddr,
        macaddr:this.props.macaddr,
        leasetime:this.props.leasetime
      }
    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props ) {
            //this.props.form.resetFields();
            this.setState({
              ipaddr: nextProps.ipaddr,
              macaddr:nextProps.macaddr
            })
        }
    }
    render(){
        const { getFieldDecorator }  =this.props.form;
        const formItemLayoutModel = {
            labelCol: {span: 6},
            wrapperCol: {span: 16}
        };
        const tailFormItemLayoutModel = {
          wrapperCol:{
              span:14,
              offset:6
          }
        };
        
        return (
            <Form>
                    <Form.Item {...formItemLayoutModel} label="IP地址">
                    {getFieldDecorator('ip', {
                        rules: [
                            { required: true, message: 'ip地址不能为空!' },
                            {
                                pattern:new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'),
                                message:'IP地址格式不正确！'
                           }], 
                        initialValue:this.state.ipaddr
                    })(
                        <Input />
                    )}
                    </Form.Item>
                    <Form.Item {...formItemLayoutModel} label="MAC地址">
                    {getFieldDecorator('mac', {
                        rules: [{ required: true, message: 'MAC地址不能为空!' },
                        {
                            pattern:new RegExp('^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$'),
                            message:'MAC地址格式不正确！'
                       }], 
                        initialValue:this.state.macaddr
                    })(                        
                        <Input />
                    )}
                    </Form.Item>
                    <Form.Item {...formItemLayoutModel} label="主机名">
                    {getFieldDecorator('name', {
                        rules: [
                        {
                            //pattern:new RegExp('^[a-zA-Z0-9]{0,32}$'),
                            //message:'请输入不超过32位的数字或字母！',
                            pattern:new RegExp('^.{0,32}$'),
                            message:'请输入不超过32位的字符！'
                       }], 
                        initialValue:''
                    })(
                        <Input />
                    )}
                    </Form.Item>
                    <Form.Item {...formItemLayoutModel} label="租约时间(s)">
                    {getFieldDecorator('leasetime', {
                        rules: [{ required: true, message: '租约时间不能为空!' },
                        {
                            pattern:new RegExp('^([6-9]\\d|\\d{3,4}|[1-7]\\d{4}|8[0-5]\\d\\d\\d|86[0-3]\\d\\d|86400)$'),
                            message:'DHCP租约时间只能为60-86400'
                       }], 
                        initialValue:this.state.leasetime
                    })(                        
                        <Input />
                    )}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayoutModel}>
                        <Button onClick={this.props.handleScanArpList}                        
                        >扫描</Button>
                    </Form.Item>
                </Form>
        )
    }

}

AddDhcpItem = Form.create({})(AddDhcpItem);