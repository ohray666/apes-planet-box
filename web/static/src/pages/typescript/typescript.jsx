import React from "react";
import { formatMessage, injectIntl } from "react-intl";
// import Ts from "./ts.tsx";

class Typescript extends React.Component {
  render() {
    return <div className="pages home">{/* <Ts /> */}</div>;
  }
}

export default injectIntl(Typescript);
