import React from "react";
import ProcessSsrStyle from "./../../../../components/ProcessSsrStyle";
import style from "./index.less";
//注意非page组件直接继承react component
export default class Intro extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setState({
      intro: "intro component of Index."
    });
  }
  render() {
    return (
      <div className="intro">
        {this.state && this.state.intro}
        {ProcessSsrStyle(style)}
      </div>
    );
  }
}
