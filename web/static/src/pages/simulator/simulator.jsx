import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

import { CONF } from "../../../../config/config.js";
import { testPoint } from "../../components/test.js";
import SelectTrip from "../../components/selectTrip.jsx";
import Map from "../../components/map.jsx";
import reducer from "./simulator.reducer";

import Points from "./points";
import { TRIP_ONE } from "../../components/trip_path_20190713154335.js";
import { TRIP_TWO } from "../../components/trip_path_20190714180533.js";
import { TRIP_THREE } from "../../components/trip_path_20190729201805";
import { POST } from "./post.js";

export default function Simulator() {
  const [redux, dispatch] = useReducer(reducer, {});

  const [play, setPlay] = useState(false);
  const [random, setRandom] = useState();
  const [count, setCount] = useState(0);
  const [position, setPosition] = useState([0, 0]);
  const [msg, setMsg] = useState([0]);
  const [actionClass, setActionClass] = useState("");

  const Trips = [TRIP_ONE, TRIP_TWO, TRIP_THREE];

  useEffect(() => {
    getLocalPoint();
  }, []);

  useEffect(() => {
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
    if ([count]) {
      setCount(count + 1);
      if (redux.localPoint) {
        setPosition(redux.localPoint[count]);
        sendLocalPoint(redux.localPoint[count]);
      }
    } else {
      goback();
    }
  }, [random]);

  function sendLocalPoint(point) {
    const postData = POST;
    console.log(POST);
    postData.body.serviceData.telemetry[0].position.latitude = point[0];
    postData.body.serviceData.telemetry[0].position.longitude = point[1];
    axios
      .post(`${CONF.HOST}:${CONF.PORT}/${CONF.PATH_SNAP}`, postData)
      .then(res => {
        const data = res.data;
        dispatch({ type: "SERVERS_POINT", data });
      });
  }

  function getServersPoint() {
    axios
      .post(`${CONF.HOST}:${CONF.PORT}/${CONF.PATH_SNAP}`, POST)
      .then(res => {
        const data = res.data;
        dispatch({ type: "SERVERS_POINT", data });
      });
  }

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

  function handPlay() {
    setPlay(!play);
  }

  function goback() {
    if (redux.localPoint && redux.localPoint[0]) {
      setPosition(redux.localPoint[0]);
    }
    handPlay();
  }

  function handTrip(e) {
    getLocalPoint(e.target.value);
  }

  function getLocalPoint(num) {
    const routeNum = num || 0;
    const positions = Trips[routeNum].VehicleSpecification.Basic.position;
    const positionValues = Object.values(positions).map(item => {
      return [Number(item.latitude), Number(item.longitude)];
    });

    const pathStep = 0.00001;
    const pointObj = new Points(positionValues, pathStep);
    const points = pointObj.get(positionValues);

    dispatch({ type: "LOCAL_POINT", data: points });
  }

  return (
    <div className="pages home simulator">
      <section className="simulator-cont">
        <div className="simulator-card">
          <div className="simulator-car" />
        </div>
        <div className="simulator-card">
          <Map center={position} currentPoint={position} />
        </div>
        <div className="simulator-card">
          <ul className="simulator-log">{renderMsg()}</ul>
        </div>
      </section>

      {/* <button onClick={getServersPoint}>Get Servers Point</button> */}

      <div className="simulator-play">
        <select className="simulator-select" onChange={handTrip}>
          <option value="0">Route one</option>
          <option value="1">Route two</option>
          <option value="2">Route three</option>
        </select>

        <div onClick={handPlay} className={play ? "stop" : "start"}>
          {play ? "Stop" : "Start"}
        </div>
      </div>
    </div>
  );
}
