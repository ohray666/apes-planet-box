import React from "react";
import Theme from "./theme.jsx";
import Demo from "./demo.jsx";

function Hook() {
  return (
    <div className="pages hook">
      <Theme.Provider value="moon">
        <Demo text="Demo" />
      </Theme.Provider>
    </div>
  );
}

export default Hook;
