import React,{ useState } from "react";
import ProcessSsrStyle from "./../../../../components/ProcessSsrStyle";
import style from "./index.less";
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
