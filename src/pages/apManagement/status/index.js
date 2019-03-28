import React from 'react';
import axios from '@/axios';
import {cgidata,cgi_url} from '@/pages/cgidata'
import GroupSetting from '@/components/ApGroup'
import ApButton from '@/components/ApButton'
import ApList from '@/components/ApList'
import DrawerForm from '@/components/ApDetailDrawer'
import './index.css'
import { Card,Divider } from 'antd';

export default class ApStatus extends React.Component{    
    
    state={
      drawerVisible:false,/**用于显示抽屉 */
      addVisible:false,
      editVisible:false,
      deleteVisible:false,
      searchText: '',
      groupToDefalut:false,//用于重新渲染组
      /**group_info数据可以为空，只用于测试 */
      group_info:	[/*{
          "gid":	"0",
          "groupname":	"ALL"
        },{
          "gid":	"1",
          "groupname":	"default"
        }, {
          "gid":	"2",
          "groupname":	"xavier"
        }, {
          "gid":	"3",
          "groupname":	"hpluo"
        },*/],
        src_group_info:	[/*{
          "gid":	"1",
          "groupname":	"default"
        }, {
          "gid":	"2",
          "groupname":	"xavier"
        }, {
          "gid":	"3",
          "groupname":	"hpluo"
        },*/],
      gid:'0',
      apid:'1',
      apid_forSelect:'',//用于给AP升级，字符串形式如"1", "1,3,4,8"
      groupname:'ALL',
      apname:'',
      /**breaf_apinfo数据可以为空，只用于测试 */
      breaf_apinfo: [/*{
				apid:	"1",
				apname:	"aa",
				ipaddr:	"192.168.208.130",
				mac:	"00:19:BE:21:03:EF",
				model:	"v2c",
				version:	"155",
				uptime:	"3000000",
				jointime:	"02-15 13:47",
				runstate:	"0"
      }, {
				apid:	"2",
				apname:	"bb",
				ipaddr:	"192.168.208.133",
				mac:	"00:19:BE:22:03:EF",
				model:	"v2c",
				version:	"155",
				uptime:	"120000",
				jointime:	"02-15 13:47",
				runstate:	"1"
      }, {
				apid:	"3",
				apname:	"cc",
				ipaddr:	"192.168.208.131",
				mac:	"00:19:BE:23:03:EF",
				model:	"v2c",
				version:	"155",
				uptime:	"36001",
				jointime:	"02-15 13:47",
				runstate:	"2"
      }, {
				apid:	"4",
				apname:	"dd",
				ipaddr:	"192.168.208.132",
				mac:	"00:19:BE:20:03:EF",
				model:	"v2c",
				version:	"155",
				uptime:	"1119330",
				jointime:	"02-15 13:47",
				runstate:	"6"
      }*/],
      breaf_apinfo_src: [/*{
				apid:	"1",
				apname:	"aa",
				ipaddr:	"192.168.208.130",
				mac:	"00:19:BE:21:03:EF",
				model:	"v2c",
				version:	"155",
				uptime:	"3000000",
				jointime:	"02-15 13:47",
				runstate:	"0"
      }, {
				apid:	"2",
				apname:	"bb",
				ipaddr:	"192.168.208.133",
				mac:	"00:19:BE:22:03:EF",
				model:	"v2c",
				version:	"155",
				uptime:	"120000",
				jointime:	"02-15 13:47",
				runstate:	"1"
      }, {
				apid:	"3",
				apname:	"cc",
				ipaddr:	"192.168.208.131",
				mac:	"00:19:BE:23:03:EF",
				model:	"v2c",
				version:	"155",
				uptime:	"36001",
				jointime:	"02-15 13:47",
				runstate:	"2"
      }, {
				apid:	"4",
				apname:	"dd",
				ipaddr:	"192.168.208.132",
				mac:	"00:19:BE:20:03:EF",
				model:	"v2c",
				version:	"155",
				uptime:	"1119330",
				jointime:	"02-15 13:47",
				runstate:	"6"
      }*/],
    
    /**radio0_config radio1_config detail_apinfo basic_config数据可以为空，只用于测试 */
		radio0_config:	{/*
			"if_admin":"1",
			"country":	"CN",
			"wirelessmode":	"9",
			"htmode":	"0",
			"channel":	"0",
			"txpower":	"100",
			"beacon":	"100"
    */},
		radio1_config:	{/*
			"if_admin":"1",
			"country":	"CN",
			"wirelessmode":	"14",
			"htmode":	"2",
			"channel":	"0",
			"txpower":	"100",
			"beacon":	"100"
    */},
		detail_apinfo:	{/*
			"mac":	"00:19:BE:20:03:EF",
			"ipaddr":	"192.168.208.130",
			"model":	"v2c",
			"version":	"155",
			"uptime":	"1190",
			"radio_type":	"3",
			"jointime":	"02-15 13:47",
			"reason":	"0",
			"runstate":	"6"
    */},
		basic_config:	{
			"apname":	""
    },  
    /**end-- ap 详细信息 */
    }
    componentDidMount(){
      /**1 获取分组信息
       * 2 获取AP概览信息：得知显示哪个组的信息
       */
      this.getGroupmsg();
      this.getApListmsg()
    }

  getGroupmsg=()=>{
    let values ={...cgidata.cgidata26};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
            let group_info = res.result.group_info;
            group_info.unshift({
                "gid":	"0",
                "groupname":	"ALL"
            })
            this.setState({group_info,
              src_group_info:res.result.group_info})
          }
      })
  }
/**ALL 0 分组的信息 */
  getApListmsg=(gid = "0")=>{
    this.setState({
      gid:gid
    })
    let values ={gid,...cgidata.cgidata30};      
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
  changeApidSelect=(value)=>{
    this.setState({apid_forSelect:value})
  }
    
    onClose = () => {
      this.setState({
        drawerVisible: false,
      });
    };

    handleDeleteSelectAp=(apid) =>{
      let values ={apid,...cgidata.cgidata37};      
        axios.ajax_post({
          data:values
        }).then((res)=>{
            if(res.restcode == 2000){
              this.getApListmsg()
              this.setState({groupToDefalut:!this.state.groupToDefalut})//删掉后组id重新回到0或1
            }
        })
    }
    
    showDetail=(apid,apname)=>{
      this.setState({
        drawerVisible:true,
        apid:apid,
        apname:apname
      },function(){
              
        this.getDetailApinfo(apid,apname)
      })

    }
    
  getDetailApinfo=(apid,apname)=>{
    //注意：TEST:apid是点击之后需要发送的apid，请把默认值删掉
    let values ={apid,...cgidata.cgidata31};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
            this.setState({
              radio0_config:res.result.radio0_config,
              radio1_config:res.result.radio1_config,
              detail_apinfo:res.result.detail_apinfo,
              basic_config:res.result.basic_config,
            })
          }
      })
  }
  
  handleSetApName=(apid,apname)=>{
    let values ={apname,apid,...cgidata.cgidata32};  
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){       
            //console.log('success')
            
          }
      }).then((res)=>{
        this.getApListmsg()
      })
  }
  handleMoveSelectAp=(gid,apid)=>{

    let values ={gid,apid,...cgidata.cgidata36};   
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){       
            //console.log('success')
            this.setState({groupToDefalut:!this.state.groupToDefalut})//删掉后组id重新回到0或1
            
          }
      }).then((res)=>{
        this.getGroupmsg();
        this.getApListmsg()
      })
  }

  handleFilterList=(newList,srcflage)=>{
    if(srcflage){
      let newList = this.state.breaf_apinfo_src;
      this.setState({breaf_apinfo:newList})
    }else{      
      this.setState({breaf_apinfo:newList})
    }
  }
  getGroupMsg=()=>{
    this.getApListmsg(this.state.gid)
  }
    render(){

      return (
        <div className="wrap">
        <div className="left ">
        <Card title="AP状态">
        
          <GroupSetting group_info={this.state.group_info}
          noHandle = {true}
          getApListmsg={this.getApListmsg}
          groupToDefalut={this.state.groupToDefalut}
          />
          
          <Divider/>
          <ApButton apid={this.state.apid_forSelect}     
                    getGroupMsg={this.getGroupMsg}     
                    breaf_apinfo={this.state.breaf_apinfo}
                    handleFilterList={this.handleFilterList}/>

          <ApList
            breaf_apinfo={this.state.breaf_apinfo}
            showDetail={this.showDetail}
            changeApidSelect={this.changeApidSelect}
            handleDeleteSelectAp={this.handleDeleteSelectAp}
            group_info={this.state.src_group_info}
            handleMoveSelectAp={this.handleMoveSelectAp}
          />
        
        </Card>
        
        </div>
          {
            this.state.drawerVisible==false?null:
            <div className="right">
            <DrawerForm 
              visible={this.state.drawerVisible}
              onClose={this.onClose}
              apid={this.state.apid}
              apname={this.state.apname}
              radio0_config={this.state.radio0_config}
              radio1_config={this.state.radio1_config}
              detail_apinfo={this.state.detail_apinfo}
              showRadio0={this.state.radio0_config==undefined?false:true}
              showRadio1={this.state.radio1_config==undefined?false:true}
              handleSetApName={this.handleSetApName}
              //gid={this.state.gid}
            />
            </div>
          }
        </div>
    
        )
        
    }

}

