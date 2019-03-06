import React from "react";
import request from "./../../model/request";
import Base from "./../base";

import ProcessSsrStyle from "./../../components/ProcessSsrStyle";
import style from "./index.less";
//注意page组件继承Base
export default class List extends Base {
  //注意看看：base关于getInitialProps的注释
  static state = {
    desc: "惹不起"
  }
  static async getInitialProps() {
    let list = [];
    const res = await request.get("/api/getList");
    if (!res.errCode) list = res.data;
    return {
      list
    };
  }
  componentDidMount() {}

  //当从首页单页面路由跳转到List页面时，getInitialProps如同willMount，就会出现异步请求，注意render中判断state的值是否存在，避免报错
  render() {
    console.log(this.state)
    const { desc, list } = this.state || {};
    return (
      <div className="list">
        <div>{desc}</div>
        <ul>
          {list &&
            list.map(item => {
              return <li key={item}>{item}</li>;
            })}
        </ul>

        {ProcessSsrStyle(style)}
      </div>
    );
  }
}
