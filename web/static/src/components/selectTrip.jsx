import React, { useState, useEffect, useReducer } from "react";

import Points from "../pages/simulator/points";
import { TRIP_ONE } from "./trip_path_20190713154335.js";
import { TRIP_TWO } from "./trip_path_20190714180533.js";
import { TRIP_THREE } from "./trip_path_20190729201805";
import reducer from "../pages/simulator/simulator.reducer";

export default function SelectTrip() {
  const [redux, dispatch] = useReducer(reducer);
  const Trips = [TRIP_ONE, TRIP_TWO, TRIP_THREE];

  useEffect(() => {
    getLocalPoint();
  }, []);

  function getLocalPoint(num) {
    const routeNum = num || 0;
    const positions = Trips[routeNum].VehicleSpecification.Basic.position;
    const positionValues = Object.values(positions).map(item => {
      return [Number(item.latitude), Number(item.longitude)];
    });

    const pathStep = 0.000001;
    const pointObj = new Points(positionValues, pathStep);
    const points = pointObj.get(positionValues);

    dispatch({ type: "LOCAL_POINT", data: points });
  }
  function handTrip(e) {
    getLocalPoint(e.target.value);
  }
  return (
    <select onChange={handTrip}>
      <option value="0">Route one</option>
      <option value="1">Route two</option>
      <option value="2">Route three</option>
    </select>
  );
}
