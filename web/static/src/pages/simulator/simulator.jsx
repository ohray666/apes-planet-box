import React, { useState, useEffect, useLayoutEffect } from "react";
import SimulatorMap from "./map.jsx";

export default function Simulator() {
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState([123]);
  const [actionClass, setActionClass] = useState("");

  useEffect(() => {
    const start = setInterval(() => {
      setCount(Math.random());
    }, 1000);
    return () => {
      clearInterval(start);
    };
  }, []);

  useLayoutEffect(() => {
    creatMsg();
  }, [count]);

  function creatMsg() {
    setActionClass("action");
    setTimeout(() => {
      setActionClass("");
    }, 400);
    console.log("renderMsg f", msg[0], actionClass);
    const msgText = [msg[0] + 1];
    setMsg(msgText.concat(msg));
  }

  function renderMsg() {
    return msg.map((item, key) => {
      return (
        <li className={key === 0 ? actionClass : ""} key={key}>
          {item}
        </li>
      );
    });
  }

  return (
    <div className="pages home simulator">
      <section className="simulator-cont">
        <div className="simulator-card">
          <div className="simulator-car" />
        </div>
        <div className="simulator-card">
          <SimulatorMap />
        </div>
        <div className="simulator-card">
          <ul className="simulator-log">{renderMsg()}</ul>
        </div>
      </section>
    </div>
  );
}
