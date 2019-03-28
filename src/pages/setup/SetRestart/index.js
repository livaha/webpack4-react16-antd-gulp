import React from 'react'
import axios from '@/axios'
import {showConfirm,countDown_toLogin} from '@/utils/utils'
import { Card, Upload, message, Button, Icon,Modal,Progress} from 'antd';
import {cgidata} from '@/pages/cgidata'
import reqwest from 'reqwest';

export default class SetRestart extends React.Component {
  
  render(){
    
    return(
      <div>
        
        <Card  title="重启">
          <Restar />
        </Card>
<br />
        
        <Card  title="恢复出厂设置">
          <Reset />
        </Card>
<br />
        <Card title="下载文件备份">
            <Download_Config />
        </Card>
<br />
        <Card title="上传配置文件">
            <Upload_Config />
        </Card>

      </div>

    )
  }
}

class Reset extends React.Component{
  
  state={
    secondsToGo:"",
    percent:0
  }
  
  handleReset=()=>{
    //发送请求并获取时间
    let values ={...cgidata.cgidata12};      
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
        <Button onClick={()=>showConfirm('重置',this.handleReset)}  type="primary">
          恢复出厂设置
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


class Restar extends React.Component{
  state={
    secondsToGo:"",
    percent:0
  }

  handleRestart=()=>{
   
   //发送请求并获取时间
   let values ={...cgidata.cgidata11};      
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
        <Button onClick={()=>showConfirm('重启',this.handleRestart)}  type="primary">
          重启
        </Button>
        
          <Modal
            title="重启中"
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
    <a href="cgi-bin/cgi_stream.cgi?streamid=2" download="备份文件">
      <Button type="primary">
        <Icon type="download" /> 下载文件
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
      url:'cgi-bin/cgi_stream.cgi?streamid=3',
      method: 'post',
      processData: false,
      data: formData,
      success: (resp) => {
        this.setState({
          fileList: [],
          uploading: false,
          visible:true,
          secondsToGo:res.locktime
        });
        let res = JSON.parse(resp)
        if(res.restcode === 2000){
          countDown_toLogin.bind(this)(res.locktime);
        }else if(res.restcode == 4008){            
            message.error('文件格式错误.');
        }
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('上传失败');
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
          title="升级中"
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