import React, { useState, useEffect } from "react";

import { testPoint } from "../../components/test.js";
import Map from "../../components/map.jsx";
import Points from "./points.js";

const pathStep = 0.00001;
const testPointObj = new Points(testPoint, pathStep);
const points = testPointObj.get(testPoint);
console.log(points);

export default function Simulator() {
  const [start, setStart] = useState(false);
  const [random, setRandom] = useState();
  const [count, setCount] = useState(0);
  const [position, setPosition] = useState(0, 0);
  const [msg, setMsg] = useState([0]);
  const [actionClass, setActionClass] = useState("");

  useEffect(() => {
    console.log(start);

    if (start) {
      const startMove = setInterval(() => {
        setRandom(Math.random());
      }, 100);
      return () => {
        clearInterval(startMove);
      };
    }
  }, [start]);

  useEffect(() => {
    if (points[count]) {
      setCount(count + 1);
      // creatMsg();
      setPosition(points[count].point);
    } else {
      goback();
    }
  }, [random]);

  function creatMsg() {
    setActionClass("action");
    setTimeout(() => {
      setActionClass("");
    }, 40);

    const msgText = [msg[0] + 10];
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

  function handStart() {
    console.log(start);
    setStart(!start);
  }

  function goback() {
    setPosition(points[0].point);
    handStart();
  }

  return (
    <div className="pages home simulator">
      <section className="simulator-cont">
        <div className="simulator-card">
          <div className="simulator-car" />
        </div>
        <div className="simulator-card">
          <Map position={position} />
        </div>
        <div className="simulator-card">
          <ul className="simulator-log">{renderMsg()}</ul>
        </div>
      </section>

      <div className="simulator-start" onClick={handStart}>
        {start ? "Stop" : "Start"}
      </div>
    </div>
  );
}
