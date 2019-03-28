
import React from 'react';
import { Table,Modal,Button } from 'antd';
/***一个增删的列表组件
 * 表头可以修改
 * 添加项目也是，
 * 删除的主要步骤在这里，最后一步实际操作才用父组件的
 */


export default class ListOfCR extends React.Component{   
  state={
    columns:this.props.columns,
    dataSource:this.props.dataSource,
    selectedRowKeys:[]
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props ) {   //刷新form表单
      this.setState({
        columns: nextProps.columns,
        dataSource:nextProps.dataSource
      })
    }
  }

  
  handleDeleteSelectList = ()=>{    
    let selectList = this.state.dataSource;
    Modal.confirm({
      title: '确认删除',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk:() =>{
        let selectedRowKeys = this.state.selectedRowKeys
        //删除指定多个下标的数组 如arr[,,,,,] 删除下标为[1,3,4]
        //通过给定key，过滤掉下标与key相同的值 
        selectList.map((item,index)=>{item.key =index;return item; })
        selectedRowKeys.forEach(function (value,index) {   
            selectList = selectList.filter((item) => {  
              return (item.key !== (value))
            })    
        })
        this.setState({selectedRowKeys: []})

        this.props.handleDeleteSelectList(selectList)      
      },
      onCancel() {
      },
    });    
  }

  onSelectChange = (selectedRowKeys) => {
    //console.log(selectedRowKeys)
    this.setState({ selectedRowKeys });
  }

  render() {   
    const {columns,dataSource,selectedRowKeys} = this.state;
    const rowSelection = {
    selectedRowKeys,
    onChange: this.onSelectChange,
    };      
    const hasSelected = dataSource.length!=0 && selectedRowKeys.length > 0;
   
    return (
          <div>
            
          <Table
              bordered
              columns={columns}
              dataSource={dataSource}
              rowSelection={rowSelection}
              pagination={false}
              fixed={false}
              footer={() => 
              <div>
                  <Button style={{marginRight:20}}  
                      onClick={this.props.handleAddListItem}                            
                  >增加条目</Button>

                  <Button type="danger"  
                      onClick={this.handleDeleteSelectList} 
                      disabled={!hasSelected}
                  >删除所选</Button>
              </div>
              }
          />
          </div>
    )
  }
}
