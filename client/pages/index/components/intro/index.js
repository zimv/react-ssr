import React,{ useState } from "react";
import ProcessSsrStyle from "./../../../../components/ProcessSsrStyle";
import style from "./index.less";
//注意非page组件直接继承react component
function Intro() {
  const [intro, setIntro] = useState("intro component of Index.");
  return (
    <div className="intro">
      {intro}
      {ProcessSsrStyle(style)}
    </div>
  );
}
export default Intro;
