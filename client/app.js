import React from "react";
import { hydrate } from "react-dom";
import Router from "./router";
class App extends React.Component {
  render() {
    return <Router ssrData={this.props.ssrData} ssrPath={this.props.ssrPath} />;
  }
}

hydrate(
  <App ssrData={window.ssrData} ssrPath={window.ssrPath} />,
  document.getElementById("root")
);
