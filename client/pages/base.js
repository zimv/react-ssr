import React from "react";
export default class Base extends React.Component {
  //override
  static async getInitialProps() {
    return null;
  }
  static title = "react ssr";
  constructor(props) {
    super(props);
    if (props.ssrData) {
      //如果是首次渲染，会拿到ssrData,把ssrData直接传递给state来使用
      this.state = {
        ...props.ssrData
      };
    }
  }
  async componentWillMount() {
    if (typeof window != "undefined") {
      //客户端运行时
      if (!this.props.ssrData) {
        //非首次渲染，也就是单页面路由状态改变，直接调用静态方法
        const data = await this.constructor.getInitialProps(); //静态方法，通过构造函数获取
        if (data) {
          this.setState({ ...data });
        }
      }
      //设置标题
      document.title = this.constructor.title;
    }
  }
}
