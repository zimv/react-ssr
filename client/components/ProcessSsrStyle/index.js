import React from "react";
export default style => {
  if (typeof window != "undefined") {
    //客户端
    return;
  }
  return <style>{style}</style>;
};
