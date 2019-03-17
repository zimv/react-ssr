import React from "react";
export default class Base extends React.Component {
  //override 获取需要服务端首次渲染的异步数据
  static async getInitialProps() {
    return null;
  }
  static title = "react ssr";
  //page组件中不要重写constructor
  constructor(props) {
    super(props);

    //如果定义了静态state,按照生命周期，state应该优先于ssrData
    if (this.constructor.state) {
      this.state = {
        ...this.constructor.state
      };
    }
    //如果是首次渲染，会拿到ssrData
    if (props.ssrData) {
      if (this.state) {
        this.state = {
          ...this.state,
          ...props.ssrData
        };
      } else {
        this.state = {
          ...props.ssrData
        };
      }
    }
  }
  async componentWillMount() {
    //客户端运行时
    if (typeof window != "undefined") {
      if (!this.props.ssrData) {
        //非首次渲染，也就是单页面路由状态改变，直接调用静态方法
        //我们不确定有没有异步代码，如果getInitialProps直接返回一个初始化state，这样会造成本身应该同步执行的，因为await没有同步执行，造成状态混乱
        //所以建议初始化state需要写在class属性中,用static静态方法定义，constructor时会将其合并到实例中。
        //为什么不直接写state属性而要加static，因为默认属性会执行在constructor之后，这样会覆盖constructor定义的state
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
