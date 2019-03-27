//首页 状态
import React from 'react';

import '../css/index.scss';
import {Button} from 'antd';


class Index extends React.Component {
    // 构造
    constructor(props) {
        super(props);
       // this.state = {
       //     index:"a"
       // }
    }
    state = {
        index:"a"
    }

    render() {
        return (<div>
            
            <Button type="primary">antd测试{this.state.index}</Button>

            <div className="bg">css测试</div>



        </div>);
    }

}

export default Index;