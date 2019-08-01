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
  const [count, setCount] = useState(-1);
  const [localPoints, setLocalPoints] = useState();
  const [localPosition, setLocalPosition] = useState([0, 0]);
  const [serversPoints, setServersPoints] = useState();
  const [serversPosition, setServersPosition] = useState([0, 0]);
  const [msg, setMsg] = useState([]);
  const [actionClass, setActionClass] = useState("");

  const Trips = [TRIP_ONE, TRIP_TWO, TRIP_THREE];

  // console.log(serversPoints);
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
    if (serversPoints && serversPoints.length < count) {
      setPlay(!play);
    } else if (serversPoints && serversPoints[count + 1]) {
      setCount(count + 1);
    }
  }, [random]);

  useEffect(() => {
    if (serversPoints && serversPoints[count]) {
      creatMsg();
      setLocalPosition(localPoints[count]);
      setServersPosition(serversPoints[count]);
    }
  }, [count]);

  function getAPIInit() {
    axios.get(`${CONF.HOST}:${CONF.PORT}/${CONF.PATH_INIT}`);
  }

  function getServersPoint(num) {
    const routeNum = num;
    const positions = Trips[routeNum];
    axios
      .post(`${CONF.HOST}:${CONF.PORT}/${CONF.PATH_TRIP}`, positions)
      .then(res => {
        if (res.data && res.data.paths && res.data.paths.length > 0) {
          const instructions = res.data.paths[0].instructions
            .slice(1, -1)
            .match(/[^\(\)]+(?=\))/g);

          const decodePoints = decode(res.data.paths[0].points, false);
          decodePoints.map((item, key) => {
            if (!instructions[key]) {
              return;
            }
            const text = instructions[key].split(",");
            let textState;

            switch (text[0]) {
              case "0":
                textState = "起点:";
                break;
              case "2":
                textState = "右转";
                break;
              case "-2":
                textState = "左转";
                break;
              case "4":
                textState = "到达终点";
                break;
            }
            const tips = `${textState || ""}${text[1]}`;
            item.push(tips);
          });
          console.log(decodePoints);
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
    if (serversPoints && serversPoints[count] && serversPoints[count][2]) {
      setActionClass("action");
      setTimeout(() => {
        setActionClass("");
      }, 40);

      const msgText = serversPoints[count][2];
      setMsg([msgText].concat(msg));
    }
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
    const num = e.target.value;
    getAPIInit();
    getLocalPoint(num);
    getServersPoint(num);
  }

  function getLocalPoint(num) {
    const routeNum = num;
    const positions = Trips[routeNum].VehicleSpecification.Basic.position;
    const positionValues = Object.values(positions).map(item => {
      return [Number(item.latitude), Number(item.longitude)];
    });

    const pathStep = 0.00002;
    const pointObj = new Points(positionValues, pathStep);
    const points = pointObj.get(positionValues);

    setLocalPoints(points);
    getServersPoint(routeNum);
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
