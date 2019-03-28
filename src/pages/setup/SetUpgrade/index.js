import React from 'react'
import axios from '@/axios'
import { Card, Upload, message, Button, Icon,Modal, Checkbox,Progress} from 'antd';
import {cgidata} from '@/pages/cgidata'
import reqwest from 'reqwest';
import {showConfirm,countDown_toLogin} from '@/utils/utils'
import './index.less'

export default class SetRestart extends React.Component {
  state={
    product_model:'',
    fw_version:'',
    buildtime:''
  }

  componentDidMount(){
    
      let values ={...cgidata.cgidata13};      
      axios.ajax_post({
        data:values
      }).then((res)=>{
          console.log(res.result)
          if(res.restcode == 2000){    
              this.setState({                
                product_model:res.result.product_model,
                fw_version:res.result.fw_version,
                buildtime:res.result.buildtime
              })
          }
      })
  }

  render(){  
    return(
      <div>        
        <Card  title="版本信息">          
            <div className="detail-items">
                <ul className="detail-form">
                    <li>
                        <div className="detail-form-left">产品型号:</div>
                        <div className="detail-form-content">{this.state.product_model}</div>
                    </li>
                    <li>
                        <div className="detail-form-left">固件版本:</div>
                        <div className="detail-form-content">{this.state.fw_version}</div>
                    </li>
                    <li>
                        <div className="detail-form-left">发布时间:</div>
                        <div className="detail-form-content">{this.state.buildtime}</div>
                    </li>
                </ul>
            </div>        
        </Card>
        <br />
        <Card  title="固件升级">
            <Upload_Config />
        </Card>
      </div>
    )
  }
}


class Upload_Config extends React.Component {
  state = {
    fileList: [],
    uploading: false,
    secondsToGo:"",
    percent:0,
    upgradeurl:'cgi-bin/cgi_stream.cgi?streamid=4&keep_setting=1'
  }

  onChange=(e)=> {
    if(e.target.checked == true){
      let upgradeurl = 'cgi-bin/cgi_stream.cgi?streamid=4&keep_setting=1'
      this.setState({
        upgradeurl
      })
    }else{
      let upgradeurl = 'cgi-bin/cgi_stream.cgi?streamid=4&keep_setting=0'
      this.setState({
        upgradeurl
      })
    }
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

    let upgradeurl = this.state.upgradeurl

    // You can use any AJAX library you like
    reqwest({
      //url: '//jsonplaceholder.typicode.com/posts/',
      url: upgradeurl,
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
      accept:".bin",
      onChange(info) {
        //console.log(info.file.name);
        //console.log(info.fileList);
      },
    };
    return (
      <div>
        <Checkbox onChange={this.onChange} defaultChecked={true}>保留配置</Checkbox>
        <Upload {...props} >
          <Button type="primary">
            <Icon type="upload" /> 上传固件
          </Button>

        </Upload>
        <Button
          type="primary"
          onClick={()=>showConfirm('重启',this.handleUpload)}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginLeft: 88 ,marginTop: 12,    width: 112 }}
        >
          {uploading ? '上传中' : '开始升级' }
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