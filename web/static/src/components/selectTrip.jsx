import React, { useState } from "react";

import Points from "../pages/simulator/points";
import { TRIP_ONE } from "./trip_path_20190713154335.js";
import { TRIP_TWO } from "./trip_path_20190714180533.js";
import { TRIP_THREE } from "./trip_path_20190729201805";

export default function SelectTrip() {
  const [positionAll, setPositionAll] = useState();
  const Trips = {
    TRIP_ONE,
    TRIP_TWO,
    TRIP_THREE
  };

  console.log(Trips);

  function handTrip(e) {
    console.log(e.target.value);
    const positions = Trips[e.target.value].VehicleSpecification.Basic.position;
    const positionValues = Object.values(positions).map(item => {
      return { point: { lat: item.latitude, lon: item.longitude } };
    });

    const pathStep = 0.00001;
    const pointObj = new Points(positionValues, pathStep);
    const points = pointObj.get(positionValues);
    console.log(points);

    setPositionAll(positionValues);
  }

  console.log(positionAll);

  return (
    <select onChange={handTrip}>
      <option value="TRIP_ONE">Trip one</option>
      <option value="TRIP_TWO">Trip two</option>
      <option value="TRIP_THREE">Trip three</option>
    </select>
  );
}
