import React, { useState, useEffect } from 'react';

import { testPoint } from "../../components/test.js";
import SelectTrip from "../../components/selectTrip.jsx";
import Map from "../../components/map.jsx";
import Points from "./points.js";

const pathStep = 0.00002;
const testPointObj = new Points(testPoint, pathStep);
const points = testPointObj.get(testPoint);
console.log(points);

export default function Simulator() {
  const [play, setPlay] = useState(false);
  const [random, setRandom] = useState();
  const [count, setCount] = useState(0);
  const [position, setPosition] = useState({ lat: 0, lon: 0 });
  const [msg, setMsg] = useState([0]);
  const [actionClass, setActionClass] = useState('');

  useEffect(() => {
    console.log(play);

    if (play) {
      const startMove = setInterval(() => {
        setRandom(Math.random());
      }, 100);
      return () => {
        clearInterval(startMove);
      };
    }
  }, [play]);

  useEffect(() => {
    // setCount(count + 1);
    // creatMsg();
    // const point = testPoint[count % 200].point;
    // setPosition({ lat: Number(point.lat), lon: Number(point.lon) });
    if (points[count]) {
      setCount(count + 1);
      // creatMsg();
      setPosition(points[count].point);
    } else {
      goback();
    }
  }, [random]);

  function creatMsg() {
    setActionClass('action');
    setTimeout(() => {
      setActionClass("");
    }, 40);

    const msgText = [msg[0] + 10];
    setMsg(msgText.concat(msg));
  }

  function renderMsg() {
    return msg.map((item, key) => {
      return (
        <li className={key === 0 ? actionClass : ''} key={key}>
          {item}
        </li>
      );
    });
  }

  function handPlay() {
    console.log(play);
    setPlay(!play);
  }

  function goback() {
    setPosition(points[0].point);
    handPlay();
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

      <div className="simulator-play">
        <div onClick={handPlay} className={play ? "stop" : "start"}>
          {play ? "Stop" : "Start"}
        </div>
      </div>

      <SelectTrip />
    </div>
  );
}
