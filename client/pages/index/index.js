import React from "react";
import request from "./../../model/request";
import Base from "./../base";

import Intro from "./components/intro";
import ProcessSsrStyle from "./../../components/ProcessSsrStyle";
import _fire from "./../../assets/image/fire.svg";
import _zimv from "./../../assets/image/zimv.jpeg";
import style from "./index.less";
//注意page组件继承Base
export default class Index extends Base {
  //注意看看：base关于getInitialProps的注释
  static state = {
    desc: "Hello world~"
  };
  //替代componentWillMount
  static async getInitialProps() {
    let data;
    const res = await request.get("/api/getData");
    if (!res.errCode) data = res.data;
    return {
      data
    };
  }
  goList() {
    this.props.history.push("list");
  }

  render() {
    const { desc, data } = this.state || {};

    return (
      <div className="index">
        <div>
          <img src={_zimv} alt="zimv" />
          {desc}
        </div>
        <div>
          <span dangerouslySetInnerHTML={{ __html: _fire }} />
          {data}
        </div>
        <div onClick={this.goList.bind(this)} className="forward">click to go List</div>
        <Intro />
        {ProcessSsrStyle(style)}
      </div>
    );
  }
}
