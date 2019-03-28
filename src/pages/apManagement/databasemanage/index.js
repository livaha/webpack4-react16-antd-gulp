import React from 'react'
import axios from '@/axios'
import {showConfirm,countDown_toLogin} from '@/utils/utils'
import { Card, Upload, message, Button, Icon,Modal,Progress} from 'antd';
import {cgidata} from '@/pages/cgidata'
import reqwest from 'reqwest';

export default class APDatabaseManage extends React.Component {
  
  render(){
    
    return(
      <div>
        
        <Card  title="保存数据库配置">
          <SaveAcDatebase />
        </Card>
<br />
        
        <Card  title="重置数据库">
          <ResetDatebase />
        </Card>
<br />
        <Card title="备份下载数据库">
            <Download_Config />
        </Card>
<br />
        <Card title="恢复数据库">
            <Upload_Config />
        </Card>

      </div>

    )
  }
}

class SaveAcDatebase extends React.Component{
  
  handleSaveAcDatebase=()=>{
    //发送请求并获取时间
    let values ={...cgidata.cgidata48};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
              //console.log(res);
          }
      })
  }

  render(){
    return(
    <Button onClick={this.handleSaveAcDatebase}  type="primary">
      保存数据库配置
    </Button>
    )
  }
}

class ResetDatebase extends React.Component{
  
  state={
    secondsToGo:"",
    percent:0
  }
  handleResetDatebase=()=>{
    //发送请求并获取时间
    let values ={...cgidata.cgidata49};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          if(res.restcode == 2000){   
              this.setState({
                secondsToGo:res.locktime,
                visible:true
              })
              countDown_toLogin.bind(this)(res.locktime);
          }
      })
  }

  render(){
    return(
      <div>
        <Button onClick={()=>showConfirm('重置数据库',this.handleResetDatebase)}  type="primary">
          重置数据库
        </Button>
        
        <Modal
        title="重置中"
        closable={false}
        footer={null}
        visible={this.state.visible}
      >
        <p>设备正在重启，请不要断电，还有{this.state.secondsToGo}秒重启完成...</p>
        <Progress  percent={this.state.percent} 
            status="active"
            strokeWidth={10}
        />
      </Modal>
      </div>
    )
  }
}



class Download_Config extends React.Component {
  render(){
    return(
    <a href="cgi-bin/cgi_stream.cgi?streamid=6" download="备份下载数据库">
      <Button type="primary">
        <Icon type="download" /> 备份下载数据库
      </Button>
    </a>
    )
  }
}

class Upload_Config extends React.Component {
  state = {
    fileList: [],
    uploading: false,
    secondsToGo:"",
    percent:0
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
    });

    // You can use any AJAX library you like
    reqwest({
      //url: '//jsonplaceholder.typicode.com/posts/',
      url:'cgi-bin/cgi_stream.cgi?streamid=7',
      method: 'post',
      processData: false,
      data: formData,
      success: (resp) => {
        this.setState({
          fileList: [],
          uploading: false,
          visible:true,
        });
        let res = JSON.parse(resp)
        if(res.restcode === 2000){
          this.setState({
            secondsToGo:res.locktime,
          });
          countDown_toLogin.bind(this)(res.locktime);
        }else if(res.restcode == 4008){            
            message.error('文件格式错误.');
        }
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('upload failed.');
      },
    });
  }

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(state => ({
          //fileList: [...state.fileList, file],
          fileList:[file]
        }));
        return false;
      },
      fileList,
      accept:".tar.gz",
      onChange(info) {
        //console.log(info.file.name);
        //console.log(info.fileList);
      },
    };
    return (
      <div>
        <Upload {...props} >
          <Button type="primary">
            <Icon type="upload" /> 上传配置文件
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={()=>showConfirm('重启',this.handleUpload)}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? '上传中' : '开始上传' }
        </Button>
        
        <Modal
          title="上传中"
          closable={false}
          footer={null}
          visible={this.state.visible}
          >
          <p>设备正在重启，请不要断电，还有{this.state.secondsToGo}秒重启完成...</p>
          <Progress  percent={this.state.percent} 
              status="active"
              strokeWidth={10}
          />
        </Modal>
      </div>
    );
  }
}