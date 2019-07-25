import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";

class NotFound extends React.Component {
  render() {
    return <div className="pages not-found" />;
  }
}

export default injectIntl(NotFound);
