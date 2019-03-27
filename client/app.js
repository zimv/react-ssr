import React from "react";
import { hydrate } from "react-dom";
import Router from "./router";
function App(props) {
  return <Router ssrData={props.ssrData} ssrPath={props.ssrPath} />;
}

hydrate(
  <App ssrData={window.ssrData} ssrPath={window.ssrPath} />,
  document.getElementById("root")
);
