import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

import { CONF } from "../../../../config/config.js";
import { decode } from "../../utils/decode";
import Map from "../../components/map.jsx";

import Points from "./points";
import { TRIP_ONE } from "../../components/trip_path_20190713154335.js";
import { TRIP_TWO } from "../../components/trip_path_20190714180533.js";
import { TRIP_THREE } from "../../components/trip_path_20190729201805";

export default function Simulator() {
  const [play, setPlay] = useState(false);
  const [random, setRandom] = useState();
  const [count, setCount] = useState(0);
  const [localPoints, setLocalPoints] = useState();
  const [localPosition, setLocalPosition] = useState([0, 0]);
  const [serversPoints, setServersPoints] = useState();
  const [serversPosition, setServersPosition] = useState([0, 0]);
  const [msg, setMsg] = useState([0]);
  const [actionClass, setActionClass] = useState("");

  const Trips = [TRIP_ONE, TRIP_TWO, TRIP_THREE];

  useEffect(() => {
    getAPIInit();
    getLocalPoint(0);
  }, []);

  useEffect(() => {
    if (play) {
      const startMove = setInterval(() => {
        setRandom(Math.random());
      }, 200);
      return () => {
        clearInterval(startMove);
      };
    }
  }, [play]);

  useEffect(() => {
    if (localPoints && localPoints.length < count) {
      setPlay(!play);
    } else if (localPoints && localPoints[count + 1]) {
      setCount(count + 1);
    }
  }, [random]);

  useEffect(() => {
    if (localPoints && localPoints[count]) {
      setLocalPosition(localPoints[count]);
      setServersPosition(serversPoints[count]);
    }
  }, [count]);

  function getAPIInit() {
    axios.get(`${CONF.HOST}:${CONF.PORT}/${CONF.PATH_INIT}`);
  }

  function getServersPoint(localPoint) {
    axios
      .post(`${CONF.HOST}:${CONF.PORT}/${CONF.PATH_TRIP}`, localPoint)
      .then(res => {
        if (res.data && res.data.paths && res.data.paths.length > 0) {
          const instructions = res.data.paths[0].instructions
            .slice(1, -1)
            .match(/[^\(\)]+(?=\))/g);
          // [(0, 龙口中路, 161.58377057248714, 11632), (2,, 99.86226513671605, 11981), (4,, 0.0, 0)];
          const decodePoints = decode(res.data.paths[0].points, false);
          // decodePoints.map((item, key) => {
          //   return { ...item, instruction: instruction[key] };
          // });
          const pathStep = 0.00002;
          const pointServersObj = new Points(decodePoints, pathStep);
          const points = pointServersObj.get(decodePoints);

          setServersPoints(points);
        } else {
          console.warn("get path problem");
        }
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
    getAPIInit();
    goback();
    setPlay(!play);
  }

  function goback() {
    getAPIInit();
    setCount(0);
  }

  function handTrip(e) {
    getAPIInit();
    getLocalPoint(e.target.value);
  }

  function getLocalPoint(num) {
    const routeNum = num;
    getServersPoint(Trips[routeNum]);
    const positions = Trips[routeNum].VehicleSpecification.Basic.position;
    const positionValues = Object.values(positions).map(item => {
      return [Number(item.latitude), Number(item.longitude)];
    });

    const pathStep = 0.00002;
    const pointObj = new Points(positionValues, pathStep);
    const points = pointObj.get(positionValues);

    setLocalPoints(points);
  }

  return (
    <div className="pages home simulator">
      <section className="simulator-cont">
        <div className="simulator-card">
          <Map center={localPosition} currentPoint={localPosition} />
        </div>
        <div className="simulator-card">
          <Map center={serversPosition} currentPoint={serversPosition} />
        </div>
        <div className="simulator-card">
          <ul className="simulator-log">{renderMsg()}</ul>
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
      </section>
    </div>
  );
}
