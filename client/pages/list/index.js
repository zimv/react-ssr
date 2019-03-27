import React, { useState, useEffect } from "react";
import request from "./../../model/request";
import {getProps, requestInitialData} from "./../base";

import ProcessSsrStyle from "./../../components/ProcessSsrStyle";
import style from "./index.less";

function List(props) {
  const [desc, setDesc] = useState("惹不起");
  
  //getProps获取props中的ssrData，重构和服务端渲染时props有值，第三个参数为默认值
  const [list, setList] = useState(getProps(props, 'list', []));
  //在单页面路由页面跳转，渲染组件时，requestInitialData调用getInitialProps
  requestInitialData(props, List, {list: setList});

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
List.getInitialProps = async () => {
  let list = [];
  const res = await request.get("/api/getList");
  if (!res.errCode) list = res.data;
  return {
    list
  };
};
List.title = 'list';
export default List;
