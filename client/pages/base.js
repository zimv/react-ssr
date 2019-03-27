import React, { useState, useEffect } from "react";
export function getProps(props, dataVar, defaultValue) {
  if (props.ssrData) {
    return props.ssrData[dataVar];
  }
  return defaultValue;
}

export function requestInitialData(props, component, setFunctions) {
  useEffect(() => {
    //客户端运行时
    if (typeof window != "undefined") {
      //非同构时，并且getInitialProps存在
      if (!props.ssrData && component.getInitialProps) {
        component.getInitialProps().then(data => {
          if (data) {
            //遍历结果，执行set赋值
            for (let key in setFunctions) {
              for (let dataKey in data) {
                if (key == dataKey) {
                  setFunctions[key](data[dataKey]);
                  break;
                }
              }
            }
          }
        });
      }
      if(component.title) document.title = component.title;
    }
  },[1]);
}
