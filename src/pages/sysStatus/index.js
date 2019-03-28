
import React from 'react';
import { Card,Statistic, Row, Col, Icon } from 'antd';
import axios from '@/axios';
import {dayToFormatTime,secondsToFormatTime,totalTrafficByte,totalTrafficbps} from '@/utils/utils';
import {cgidata} from '@/pages/cgidata'
import './index.less'
import ClientDetailt from './clientDetailt'

import ReactEcharts from 'echarts-for-react';
import themeLight from './echartTheme'
// import echarts from 'echarts'
import echarts from 'echarts/lib/echarts'
// 引入饼图和折线图
import 'echarts/lib/chart/pie'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';

/**2处开启定时器：进来的时候开始定时器，子组件调用goback时开启定时器；
 * 2处清理定时器：unmount时，跳转到子组件的时候showClientDetail */
export default class NoMatch extends React.Component{     
  
  componentWillMount(){
    echarts.registerTheme('myecharts',themeLight);
  }

  state={
    showClient:false,
    systemInfo:	{
      "total_wtp":	3,// 总AP 数目
      "online_wtp":	1,// 在线AP数目
      "product_name":	"G101",// 产品名称
      "fw_version":	104, //软件版本
      "buildtime":	"2019-03-08 03:53:17",  //发布时间
      "company_website":	"www.totolink.com",//  官网地址
      "time_of_day":	1552003729,//  当前时间
      "uptime":	14900, //运行时间
      "cpu_rt_usage":	1, //cpu利用率%
      "mem_rt_usage":	35,// 内存利用率%
      "flash_usage":	6//   Flash利用率%
    },
    total_rx_bytes:	377660921,
		total_tx_bytes:	268001076,
		network_info:	[{
				"section":	"device_port0",
				"link":	1,
				"speed":	100,
				"mac_address":	"1A:F5:DD:03:46:36",
				"ip_address":	"192.168.7.1",
				"netmask":	"255.255.255.0",
				"client_num":	3
			}, {
				"section":	"device_port1",
				"link":	1,
				"speed":	10,
				"network_type":	0
			}, {
				"section":	"device_port2",
				"link":	1,
				"speed":	10,
				"network_type":	0
			}, {
				"section":	"device_port4",
				"link":	1,//  port up 
				"speed":	1000,
				"network_type":	1,//  networktyp==1 port is wan mode
				"mac_address":	"1A:F5:DD:03:46:37",
				"ip_address":	"192.168.5.127",
				"netmask":	"255.255.255.0",
				"gateway":	"192.168.5.1",
				"tx_bps":	1024,
				"rx_bps":	2048597
			}, {
				"section":	"device_port4",
				"link":	1,//  port up 
				"speed":	1000,
				"network_type":	1,//  networktyp==1 port is wan mode
				"mac_address":	"1A:F5:DD:03:46:37",
				"ip_address":	"192.168.5.127",
				"netmask":	"255.255.255.0",
				"gateway":	"192.168.5.1",
				"dns_server":	["202.96.134.133", "202.96.128.166"],
				"tx_bps":	424890,
				"rx_bps":	339877
      }],
      classNet: ["iconfont net-nolink",
                  "iconfont net-nolink",
                  "iconfont net-nolink",
                  "iconfont net-nolink",
                  "iconfont net-nolink"],
      classSpan:["LAN1","LAN2","LAN3","WAN2","WAN1"]
  }
  componentDidMount(){
    /**获取系统信息 */
    this.getSystemInfo()
    /**获取网络信息 */
    this.getNetworkInfo()
    /**定时获取数据 */
    this.intervalId = setInterval(() => {
      this.getSystemInfo()
      this.getNetworkInfo()
    }, 5000);
  }
  componentWillUnmount(){
    clearInterval(this.intervalId);
  }
  getSystemInfo=()=>{
    let data ={...cgidata.cgidata89};      
      axios.ajax_post({
        data:data
      }).then((res)=>{
        if(res.restcode == 2000){ 
         this.setState({systemInfo:res.result})
        }
      })
  }
  getNetworkInfo=()=>{
    let data ={...cgidata.cgidata90};      
      axios.ajax_post({
        data:data
      }).then((res)=>{
        if(res.restcode == 2000){ 
          let network_info = res.result.network_info;
          let classNet = []
          let classSpan = []
          let i = 1;
      
          if(network_info[0].link == 0){
            classNet[0] = "iconfont net-nolink"
            classSpan[0] = `LAN1`
          }else{            
            classNet[0] = "iconfont net-lan"
            classSpan[0] = `LAN1`
          }
      
          for(;i<network_info.length;i++){
      
      
            if(network_info[i].link == 0){
              classNet[i] = "iconfont net-nolink"
              if(network_info[i].network_type == 0){          
                classSpan[i] = `LAN${i+1}`
              }else{
                classSpan[i] = `WAN${Math.abs(i-network_info.length)}`
              }
      
            }else if((network_info[i].link == 1) && (network_info[i].network_type == 0)){            
              classNet[i] = "iconfont net-lan"
              classSpan[i] = `LAN${i+1}`
            }else if((network_info[i].link == 1) && (network_info[i].network_type == 1)){            
              classNet[i] = "iconfont net-wan"
              classSpan[i] = `WAN${Math.abs(i-network_info.length)}`
            }
          }
          this.setState({classNet,classSpan})


         this.setState({
           network_info:res.result.network_info,
           total_rx_bytes:	res.result.total_rx_bytes,
           total_tx_bytes:	res.result.total_tx_bytes,
           classNet,
           classSpan
          })
        }
      })
  }
  
 
  getApPie=()=> {
		let total_wtp =	this.state.systemInfo.total_wtp;
		let online_wtp=this.state.systemInfo.online_wtp;
    let offline_wtp = total_wtp-online_wtp;
    
    let option = {
        title: {
            text: 'AP数目',
            x: 'center',
            textStyle:{color:'#007'},
        },
        legend: {
            //orient: 'vertical',
            top: 30,
            data: [
                '在线',
                '离线',
            ]
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: 'AP数目',
                type: 'pie',
                avoidLabelOverlap: false,
                radius: ['40%', '70%'],
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    }
                },
                data: [
                    {
                        value: online_wtp,
                        name: '在线'
                    }, {
                        value: offline_wtp,
                        name: '离线'
                    }, 
                ],
            }
        ]
    }
    return option;
  }
  getMemusgPie=()=> {
      let mem_rt_usage =	this.state.systemInfo.mem_rt_usage;
      let mem_not_usage = 100-mem_rt_usage;
      
      let option = {
          title: {
              text: '内存使用率',
              x: 'center',
              textStyle:{color:'#007'},
          },
          legend: {
              //orient: 'vertical',
              top: 30,
              data: [
                  '已使用',
                  '未使用',
              ]
          },
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
              {
                  name: '内存使用率',
                  type: 'pie',
                  avoidLabelOverlap: false,
                  radius: ['40%', '70%'],
                  label: {
                      normal: {
                          show: false,
                          position: 'center'
                      },
                      emphasis: {
                          show: true,
                          textStyle: {
                              fontSize: '18',
                              fontWeight: 'bold'
                          }
                      }
                  },
                  data: [
                      {
                          value: mem_not_usage,
                          name: '未使用'
                      }, {
                          value: mem_rt_usage,
                          name: '已使用'
                      }, 
                  ],
              }
          ]
      }
      return option;
  }
  getFlashPie=()=> {
      let flash_usage =	this.state.systemInfo.flash_usage;
      let flash_not_usage = 100-flash_usage;
      
      let option = {
          title: {
              text: 'Flash利用率',
              x: 'center',
              textStyle:{color:'#007'},
          },
          legend: {
              //orient: 'vertical',
              top: 30,
              data: [
                  '已使用',
                  '未使用',
              ]
          },
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
              {
                  name: 'Flash利用率',
                  type: 'pie',
                  avoidLabelOverlap: false,
                  radius: ['40%', '70%'],
                  label: {
                      normal: {
                          show: false,
                          position: 'center'
                      },
                      emphasis: {
                          show: true,
                          textStyle: {
                              fontSize: '18',
                              fontWeight: 'bold'
                          }
                      }
                  },
                  data: [
                      {
                          value: flash_not_usage,
                          name: '未使用'
                      }, {
                          value: flash_usage,
                          name: '已使用'
                      }, 
                  ],
              }
          ]
      }
      return option;
  }
  getCpuPie=()=> {
      let cpu_rt_usage =	this.state.systemInfo.cpu_rt_usage;
      let cpu_rt_not_usage = 100-cpu_rt_usage;
      
      let option = {
          title: {
              text: 'CPU利用率',
              x: 'center',
              textStyle:{color:'#007'},
          },
          legend: {
              //orient: 'vertical',
              top: 30,
              data: [
                  '已使用',
                  '未使用',
              ]
          },
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
              {
                  name: 'CPU利用率',
                  type: 'pie',
                  avoidLabelOverlap: false,
                  radius: ['40%', '70%'],
                  label: {
                      normal: {
                          show: false,
                          position: 'center'
                      },
                      emphasis: {
                          show: true,
                          textStyle: {
                              fontSize: '18',
                              fontWeight: 'bold'
                          }
                      }
                  },
                  data: [
                      {
                          value: cpu_rt_not_usage,
                          name: '未使用'
                      }, {
                          value: cpu_rt_usage,
                          name: '已使用'
                      }, 
                  ],
              }
          ]
      }
      return option;
  }
  renderDns=(dnsArr)=>{
    if(!dnsArr || dnsArr.length==0) 
      return ;
    else  return dnsArr.map((item,index)=>{
        return(            
            <li>
                <div className="detail-form-left">DNS服务器{index+1} :</div>
                <div className="detail-form-content">{item}</div>
            </li>
        )
      })
  }
  
  renderLanUI=(network_info)=>{
    return network_info.map((item,index)=>{
      return (
        <i>
        <i className={this.state.classNet[index]}>&#xe86f;</i>
        {item.speed==100?
        <sup className="suplan-Qcolor">{item.speed}M</sup>:
        item.speed==1000?
        <sup className="suplan-Bcolor">{item.speed}M</sup>
        :null}
        </i>
      )
    })
  }
  renderWanMsg=(network_info)=>{
    
    return network_info.map((item,index)=>{
      //if(item.network_type == 1)     
      if(index != 0 && item.network_type == 1){

        return (
            <Col span={5}>
            <Card bordered={false}>                   
              <h4>{this.state.classSpan[index]}</h4> 
              
              <div className="sys-detail-items">
                <ul className="detail-form">
                  <li>
                      <div className="detail-form-left">MAC地址:</div>
                      <div className="detail-form-content">{network_info[index].mac_address}</div>
                  </li>
                  <li>
                      <div className="detail-form-left">IP地址:</div>
                      <div className="detail-form-content">{network_info[index].ip_address}</div>
                  </li>
                  <li>
                      <div className="detail-form-left">子网掩码:</div>
                      <div className="detail-form-content">{network_info[index].netmask}</div>
                  </li>
                  <li>
                      <div className="detail-form-left">网关:</div>
                      <div className="detail-form-content">{network_info[index].gateway}
                      </div>
                  </li>
                  {this.renderDns(network_info[index].dns_server)}
                </ul>
              </div>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="上行速率"
                    value={totalTrafficbps(network_info[index].tx_bps)}
                    //precision={2}
                    valueStyle={{ color: '#3f8600' ,fontSize:14}}
                    prefix={<Icon type="arrow-up" />}
                    suffix=""
                  />
                  </Col>
                  <Col span={8}>
                  <Statistic
                    title="下行速率"
                    value={totalTrafficbps(network_info[index].rx_bps)}
                    //precision={2}
                    valueStyle={{ color: '#cf1322' ,fontSize:14}}
                    prefix={<Icon type="arrow-down" />}
                    suffix=""
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          )
      }
      else if(index != 0 && item.network_type !== 1){
        
        return (          
          <Col span={3}>
          <Card bordered={false}>                   
            </Card>
          </Col>
          )
      }
    })
  }
  showClientDetail=()=>{
    /**跳转到用户状态：清除当前定时器 */
    clearInterval(this.intervalId);
    this.setState({showClient:true})
  }
  goback=()=>{
    /**用户回到当前页面：开启定时器 */
    /**定时获取数据 */
    this.intervalId = setInterval(() => {
      this.getSystemInfo()
      this.getNetworkInfo()
    }, 5000);
    this.setState({showClient:false})
  }
  render() {   
    const {systemInfo,network_info,classNet,classSpan} = this.state
    return (
      <div>
        {
          this.state.showClient==false?          
              <div>
              <Card >
              <h2>系统状态</h2> 
              <Row gutter={16}>
                <Col span={5}>
                  <div className="sys-detail-items">
                      <ul className="detail-form">
                          <li>
                              <div className="detail-form-left">产品名称:</div>
                              <div className="detail-form-content">{systemInfo.product_name}</div>
                          </li>
                          <li>
                              <div className="detail-form-left">软件版本:</div>
                              <div className="detail-form-content">{systemInfo.fw_version}</div>
                          </li>
                          <li>
                            <a href={`http://${systemInfo.company_website}`} target="blank">
                              <div className="detail-form-left">官网地址:</div>
                              <div className="detail-form-content">{systemInfo.company_website}</div>
                            </a>
                          </li>
                          <li>
                              <div className="detail-form-left">发布时间:</div>
                              <div className="detail-form-content">{systemInfo.buildtime}</div>
                          </li>
                          <li>
                              <div className="detail-form-left">当前时间:</div>
                              <div className="detail-form-content">{dayToFormatTime(systemInfo.time_of_day)}</div>
                          </li>
                          <li>
                              <div className="detail-form-left">运行时间:</div>
                              <div className="detail-form-content">{secondsToFormatTime(systemInfo.uptime)}</div>
                          </li>
                      </ul>
                  </div>        
                </Col>
                <Col span={14} style={{height:250}}>
                  <Col span={6}>
                    
                  <ReactEcharts style={{height:260}} 
                        option={this.getApPie()}
                        theme="myecharts"/>
                  </Col>
                  <Col span={6}>       
                  <ReactEcharts style={{height:260}} 
                            option={this.getCpuPie()}
                            theme="myecharts"/>
                  </Col>
                  <Col span={6}>
                  <ReactEcharts style={{height:260}} 
                          option={this.getMemusgPie()}
                          theme="myecharts"/>
                  </Col>
                  <Col span={6}>
                  <ReactEcharts style={{height:260}} 
                          option={this.getFlashPie()}
                          theme="myecharts"/>
                  </Col>
                </Col>
              </Row>
              </Card>
              <br/>

              <Card >
              <h2>网络信息</h2> 
                <Row gutter={16}>
                  <Col span={1}>
                  </Col>
                  <Col span={15}>
                    {this.renderLanUI(network_info)}
                    <br/>
                    <span style={{paddingRight:8}}></span>
                    <span className="net-span">{classSpan[0]}</span>
                    <span className="net-span">{classSpan[1]}</span>
                    <span className="net-span">{classSpan[2]}</span>
                    <span className="net-span">{classSpan[3]}</span>
                    <span className="net-span">{classSpan[4]}</span>
                  </Col>
                <Col span={8}>
                  <Row gutter={20}>
                    <Col span={10}>
                      <Statistic
                        title="上行总流量"
                        value={totalTrafficByte(this.state.total_tx_bytes)}
                        //precision={2}
                        valueStyle={{ color: '#3f8600'}}
                        prefix={<Icon type="arrow-up" />}
                        suffix=""
                      />
                      </Col>
                      <Col span={10}>
                      <Statistic
                        title="下行总流量"
                        value={totalTrafficByte(this.state.total_rx_bytes)}
                        //precision={2}
                        valueStyle={{ color: '#cf1322'}}
                        prefix={<Icon type="arrow-down" />}
                        suffix=""
                      />
                    </Col>
                  </Row>
                </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={5}>
                    <Card bordered={false}>                       
                      <h4>内网信息</h4> 
                      
                      <div className="sys-detail-items">
                        <ul className="detail-form">
                          <li>
                              <div className="detail-form-left">IP地址:</div>
                              <div className="detail-form-content">{network_info[0].ip_address}</div>
                          </li>
                          <li>
                              <div className="detail-form-left">MAC地址:</div>
                              <div className="detail-form-content">{network_info[0].mac_address}</div>
                          </li>
                          <li>
                              <div className="detail-form-left">子网掩码:</div>
                              <div className="detail-form-content">{network_info[0].netmask}</div>
                          </li>
                          <li>
                              <div className="detail-form-left">在线客户端:</div>
                              <div className="detail-form-content">{network_info[0].client_num}
                                <a onClick={this.showClientDetail}>  查看</a>
                              </div>
                          </li>
                        </ul>
                      </div>
                    </Card>
                  </Col>
                  {this.renderWanMsg(network_info)}
                </Row>
              </Card>

              </div>
              :
              <div>
                <ClientDetailt
                goback = {this.goback.bind(this)}
                />
              </div>
        }
    </div>
    )
  }
}
