import React from 'react';
import request from './../../model/request';
import Base from './../base';

import Intro from './components/intro';
import ProcessSsrStyle from './../../components/ProcessSsrStyle';
import _fire from './../../assets/image/fire.svg';
import _zimv from './../../assets/image/zimv.jpeg';
import style from './index.less';
//注意page组件继承Base
export default class Index extends Base{
  static async getInitialProps(){//替代componentWillMount
    let data;
    const res = await request.get('/api/getData');
    if(!res.errCode) data = res.data;
    return {
      desc: 'Hello world~',
      data
    }
  }
  goList(){
    this.props.history.push('list');
  }
  
  render(){
    const {desc,data} = this.state || {};
    
    return (
        <div className="index">
          <div><img src={_zimv} alt="zimv"></img>{desc}</div>
          <div>
            <span dangerouslySetInnerHTML={{__html: _fire}}></span>
            {data}
          </div>
          <div onClick={this.goList.bind(this)}>click to go List</div>
          <Intro></Intro>
          {ProcessSsrStyle(style)}
        </div>
    );
  }
}
