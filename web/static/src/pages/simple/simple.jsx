import React, { useState, useEffect } from "react";

import { testPoint } from "../../components/test.js";
import Map from "../../components/map.jsx";

export default function Simple() {
  const [position, setPosition] = useState(0, 0);

  return (
    <div className="pages simulator">
      <div>simple</div>
      <section className="simulator-cont">
        <div className="simulator-card">
          <div className="simulator-car" />
        </div>
        <div className="simulator-card">
          <Map position={position} />
        </div>
        <div className="simulator-card" />
      </section>
    </div>
  );
}
