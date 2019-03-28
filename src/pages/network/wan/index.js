import React from 'react';
import { Tabs ,Card,Modal,Progress} from 'antd';
import WanContent from './WanContent'
import axios from '@/axios';
import {cgidata} from '@/pages/cgidata'
import {countDown_toIp} from '@/utils/utils'

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

export default class Wan extends React.Component{    
    state={
        tabpane:"1",
        secondsToGo:"",
        visible:false,
        percent:0,
       // multiwan:[{},{},{},{}],
		multiwan:	[{
            "section":	"wan1",
            "proto":	"dhcp",
            "hostname":	"Vista",
            "def_macaddr":	"1a:f5:dd:03:46:37",
            "macaddr":	"1a:f5:dd:03:46:37",
            "ppp_mtu":	1492,
            "cc_mtu":	1500,
            "upbandw":	100,
            "downbandw":	100
        }, {
            "section":	"wan2",
            "proto":	"static",
            "ipaddr":	"10.6.165.10",
            "netmask":	"255.255.255.0",
            "gateway":	"10.6.165.1",
            "dns":	["114.114.114.114", "8.8.8.8"],
            "def_macaddr":	"1a:f5:dd:03:46:38",
            "macaddr":	"1a:f5:dd:03:46:38",
            "ppp_mtu":	1492,
            "cc_mtu":	1500,
            "upbandw":	100,
            "downbandw":	100
        }, {
            "section":	"wan3",
            "proto":	"disable",
            "def_macaddr":	"1a:f5:dd:03:46:39",
            "macaddr":	"1a:f5:dd:03:46:39",
            "ppp_mtu":	1492,
            "cc_mtu":	1500,
            "upbandw":	100,
            "downbandw":	100
        }, {
            "section":	"wan4",
            "proto":	"pppoe",
            "username":	"1234",
            "password":	"1235",
            "ac":	"123",
            "service":	"aaa",
            "def_macaddr":	"1a:f5:dd:03:46:3a",
            "macaddr":	"1a:f5:dd:03:46:3a",
            "ppp_mtu":	1492,
            "cc_mtu":	1500,
            "upbandw":	100,
            "downbandw":	100
        }]
        
    }
    componentDidMount(){
        this.getWanmsg();
    }

    getWanmsg =()=>{    
        let values ={...cgidata.cgidata17};     
        axios.ajax_post({
          data:values
        }).then((res)=>{
            if(res.restcode == 2000){                  
                this.setState({
                    multiwan:res.result.multiwan,
                })                
            }
        })                  
    }
    
    /**参数 
     * values:保存的单个wan，
     * key：表示第几个wan，
     * send:是否点击应用（点保存为false,应用为true)*/ 
    handlechangeBaseData=(values,key,send)=>{
        /**将MAC地址转为大写发送给后台 */
        values.macaddr = values.macaddr.toUpperCase()
        let multiwan = this.state.multiwan;
        multiwan[key-1]=values;
        this.setState({multiwan:multiwan})

        if(send){//是否点击应用
            let data ={...cgidata.cgidata18,multiwan};   
            axios.ajax_post({
                data
            }).then((res)=>{
                if(res.restcode == 2000){         
                    this.setState({
                        visible:true,
                        secondsToGo:res.locktime
                    })
                    if(res.locktime!=0/* && response.data.redir==true*/ ){
                        countDown_toIp.bind(this)(res.locktime);
                    }
                }
            })   
        }
    }

    render(){
        return(
            <Card title="外网设置">

            <Tabs onChange={this.callback} animated={false}  defaultActiveKey="1">
                <TabPane tab="WAN4" key="4" >
                    <WanContent
                        tabpane={this.state.tabpane}
                        section="wan4"
                        wan_content = {this.state.multiwan[3]}
                        handlechangeBaseData={this.handlechangeBaseData}
                    />
                </TabPane>


                <TabPane tab="WAN3" key="3" >
                    <WanContent
                        tabpane={this.state.tabpane}
                        section="wan3"
                        wan_content = {this.state.multiwan[2]}
                        handlechangeBaseData={this.handlechangeBaseData}
                    />
                </TabPane>


                <TabPane tab="WAN2" key="2" >
                    <WanContent
                        tabpane={this.state.tabpane}
                        section="wan2"
                        wan_content = {this.state.multiwan[1]}
                        handlechangeBaseData={this.handlechangeBaseData}
                    />
                </TabPane>

                <TabPane tab="WAN1" key="1" >
                    <WanContent
                        tabpane={this.state.tabpane}
                        section="wan1"
                        wan_content = {this.state.multiwan[0]}
                        handlechangeBaseData={this.handlechangeBaseData}
                    />
                </TabPane> 

            </Tabs>
            
            <Modal
                title="设置中"
                closable={false}
                footer={null}
                visible={this.state.visible}
            >
                <p>设置中，请稍后，还有{this.state.secondsToGo}秒设置完成...</p>
                <Progress  percent={this.state.percent} 
                    status="active"
                    strokeWidth={10}
                />
            </Modal>
            </Card>
        )
    }
   
    callback=(key)=> {           
        return this.setState({tabpane:key});
        confirm({
            title: `请先保存`,
            content: '注意：切换WAN后，本页内容将不作保存！',
            okText:'确定',
            cancelText:'取消',
            onOk:()=> {
                this.setState({tabpane:key});
            },
            onCancel:()=> {
            }
        })
    }
}


