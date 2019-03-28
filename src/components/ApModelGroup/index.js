import React from 'react';
import { Radio} from 'antd';


export default class ApModelGroup extends React.Component{

    state={
      model_info:this.props.model_info,
      
    }
    
    componentWillReceiveProps(nextProps) {
      if (nextProps !== this.props ) {
          this.setState({
            model_info:nextProps.model_info,
          })
      }
    }
      
    renderGroupMsg=(model_info)=>{      
      return model_info.map((item)=>{      
        return (
          <Radio.Button value={item.model} onClick={()=>this.handleGroupRadio(item)}>{item.model}</Radio.Button>
        )
      })
    }
    
    handleGroupRadio=(item)=>{
      this.props.getApListFromModel(item.model)
    }
  
    render(){
      const {model_info} = this.state
      return(
        <div className="top_bar">
        <div>
          <b>型号信息：</b>
          <Radio.Group defaultValue={model_info.length>0?model_info[0].model:''} buttonStyle="solid">
              { this.renderGroupMsg(this.state.model_info)}
          </Radio.Group>
              
            
        </div>
  
      </div>
      )
    }
  }
  
  