import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";

class Format extends React.Component {
  state = {
    msg: "",
    data: "",
    result: ""
  };

  formatData = () => {
    const { data } = this.state;
    const dataTemp = JSON.parse(data);
    if (!dataTemp) {
      this.setState({
        msg: "Data error"
      });
    }
    const result = {};
    for (let k of Object.keys(dataTemp)) {
      result[k] = k;
    }
    const resultString = JSON.stringify(result);
    this.setState({
      msg: "Success~!",
      data: resultString
    });
  };

  handChange = e => {
    this.setState({
      data: e.target.value,
      result: ""
    });
  };

  render = () => {
    return (
      <div className="pages format">
        <h2 className="title">对象转换：输出想要的键值,你大爷的的大奶奶</h2>
        <div className="msg">{this.state.msg}</div>
        <div className="text">
          <textarea
            style={{ width: "50%", minHeight: "100px" }}
            defaultValue={this.state.data}
            onChange={this.handChange}
          />
        </div>
        <div className="buttons">
          <button onClick={this.formatData}>Format</button>
        </div>
        <div className="text">
          <textarea
            style={{ width: "50%", minHeight: "100px" }}
            value={this.state.result}
            onChange={() => {}}
          />
        </div>
      </div>
    );
  };
}

export default injectIntl(Format);
