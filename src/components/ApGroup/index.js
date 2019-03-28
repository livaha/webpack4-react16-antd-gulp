import React from 'react';
import { Modal,Radio, Button, Input } from 'antd';


export default class GroupSetting extends React.Component{

    state={
      addVisible:false,
      editVisible:false,
      deleteVisible:false,
      group_info:this.props.group_info,//[],
      //gid:'0',/**默认是ALL还是Default? 0是ALL */
      //groupname:'ALL',
      //gid:'1',/**默认是ALL还是Default? 1是default */
      gid:this.props.noHandle==true?"0":"1",
      groupname:this.props.noHandle==true?'ALL':'default',
      noHandle:this.props.noHandle,
      groupToDefalut:this.props.groupToDefalut,
    }
    
    componentWillReceiveProps(nextProps) {
      if (nextProps !== this.props ) {
          this.setState({
            group_info:nextProps.group_info,
          })
          if(nextProps.groupToDefalut !== this.props.groupToDefalut){
              
            this.setState({
                gid:this.props.noHandle==true?"0":"1",
            })
          }
      }
    }
      
    hideModal = () => {
      this.setState({
        addVisible:false,
        editVisible:false,
        deleteVisible:false,
      });
    }
    /**显示group的弹框处理 */
    handleAddGroup=()=>{
      this.setState({addVisible:true})
    }
    handleEditGroup=()=>{
      this.setState({editVisible:true})
    }
    handleDelteGroup=()=>{
      this.setState({deleteVisible:true})
    }
    
    /**显示group的弹框处理 */
    handleAddGroupItem=(groupname)=>{
      this.setState({addVisible:false})
      this.props.handleAddGroupItem(groupname)
    }
    handleEditGroupItem=(groupname)=>{
      this.setState({editVisible:false})
      this.props.handleEditGroupItem(groupname,this.state.gid)
    }
    handleDelteGroupItem=()=>{
      this.props.handleDelteGroupItem(this.state.groupname,this.state.gid)
      if(this.props.noHandle==true){
        //没有操作，只显示，有ALL
        this.setState({
            editVisible:false,
            deleteVisible:false,
            gid:"0",
            groupname:'ALL',
        })
      }else{
        this.setState({
          editVisible:false,
          deleteVisible:false,
          gid:"1",
          groupname:'default',
        })
      }
    }   
  
    renderGroupMsg=(groupMsg)=>{      
      return groupMsg.map((item)=>{      
        return (
          <Radio.Button value={item.gid} onClick={()=>this.handleGroupRadio(item)}>{item.groupname}</Radio.Button>
        )
      })
    }
    
    handleGroupRadio=(item)=>{
      //console.log(item)
      this.setState({gid:item.gid,groupname:item.groupname})    
      if(this.props.noHandle==true){//没有增删改操作的分组
        this.props.getApListmsg(item.gid)
      }else{
        this.props.getSSIDmsg(item.gid)
      }
    }
  
    render(){
      const {noHandle} = this.state
      return(
  
        <div className="top_bar">
        <div>
          <b>分组信息：</b>
          {
              noHandle==true?
              //如果是只显示的，则有ALL，默认ALL，如果可增删改，则没有ALL0，默认DEFALUT1
              <Radio.Group defaultValue="0" value={this.state.gid} buttonStyle="solid">
                { this.renderGroupMsg(this.state.group_info)}
              </Radio.Group>
              :
              <Radio.Group defaultValue="1" value={this.state.gid} buttonStyle="solid">
                { this.renderGroupMsg(this.state.group_info)}
              </Radio.Group>
            }
          {
              noHandle==true?null:
                <Button title="添加分组" icon="plus" type="primary" ghost style={{ marginLeft:20 }}
                    onClick={this.handleAddGroup}
                ></Button>
          }
          <br/>
          {
              noHandle==true?null:
              <div>
                <Button title="编辑分组" icon="edit" type="primary" ghost style={{ marginLeft:70,marginTop:20 }}
                    disabled={this.state.groupname=='default'||this.state.groupname=='ALL'?true:false} 
                    onClick={this.handleEditGroup}
                ></Button>
                <Button title="删除分组" icon="delete" type="danger" ghost style={{ marginLeft:20 }}
                    disabled={this.state.groupname=='default'||this.state.groupname=='ALL'?true:false} 
                    onClick={this.handleDelteGroup}
                ></Button>
        
                <Modal
                    title="添加分组"
                    visible={this.state.addVisible}
                    onOk={()=>this.handleAddGroupItem(this.groupname)}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                >
                    <p>请填入要增加的分组：</p>
                    <Input type="text" style={{width:220}} ref={(input) => {this.groupname=input}}/>
                </Modal>
        
                <Modal
                    title="修改分组"
                    visible={this.state.editVisible}
                    onOk={()=>this.handleEditGroupItem(this.groupname)}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                >
                    <p>原分组：{this.state.groupname}</p>
                    <p>新分组：</p>
                    <Input type="text" style={{width:220}} ref={(input) => {this.groupname=input}}/>
                </Modal>
        
                <Modal
                    title="删除分组"
                    visible={this.state.deleteVisible}
                    onOk={this.handleDelteGroupItem}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                >
                <p>确定要删除分组：'{this.state.groupname}' ？</p>
                </Modal>
            </div>  
            }
        </div>
  
      </div>
      )
    }
  }
  
  