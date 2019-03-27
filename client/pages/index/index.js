import React, { useState, useEffect } from "react";
import request from "../../model/request";
import { getProps, requestInitialData } from "../base";

import Intro from "./components/intro";
import ProcessSsrStyle from "../../components/ProcessSsrStyle";
import _fire from "./../../assets/image/fire.svg";
import _zimv from "./../../assets/image/zimv.jpeg";
import style from "./index.less";

function Index(props) {
  const [desc, setDesc] = useState("Hello world~");

  //getProps获取props中的ssrData，重构和服务端渲染时props有值，第三个参数为默认值
  const [data, setData] = useState(getProps(props, "data", ""));
  //在单页面路由页面跳转，渲染组件时，requestInitialData调用getInitialProps
  requestInitialData(props, Index, { data: setData });

  function goList() {
    props.history.push("list");
  }

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
      <div onClick={goList} className="forward">
        click to go List
      </div>
      <Intro />
      {ProcessSsrStyle(style)}
    </div>
  );
}
Index.getInitialProps = async () => {
  let data;
  const res = await request.get("/api/getData");
  if (!res.errCode) data = res.data;
  return {
    data
  };
};
Index.title = "index";
export default Index;
