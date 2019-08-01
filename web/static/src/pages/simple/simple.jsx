<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// import { testPoint } from '../../components/test.js';
import { TRIP_ONE } from '../../components/trip_path_20190713154335.js';
import { TRIP_TWO } from '../../components/trip_path_20190714180533.js';

import Map from '../../components/map.jsx';
import { decode } from '../../utils/decode';
=======
import React, { useState, useEffect } from "react";

import Map from "../../components/map.jsx";
>>>>>>> Stashed changes

export default function Simulator() {
  const [centerPoint, setCenterPoint] = useState([0, 0]);
  const [startPoint, setStartPoint] = useState([0, 0]);
  const [endPoint, setEndPoint] = useState([0, 0]);
  const [optimizedTrip, setOptimizedTrip] = useState([]);
  const [originalTrip, setOriginalTrip] = useState(transferTrip());

  useEffect(() => {
    setOriginalTrip(transferTrip());
    getServersPoint();
  }, []);

  useEffect(() => {
    setStartPoint(originalTrip[0]);
    setEndPoint(originalTrip[originalTrip.length - 1]);
    if (startPoint && endPoint) {
      setCenterPoint([
        (startPoint[0] + endPoint[0]) / 2,
        (startPoint[1] + endPoint[1]) / 2
      ]);
    } else if (startPoint) {
      setCenterPoint(startPoint);
    }
  });
  return (
    <div className="pages home simulator">
      <section className="simple-cont">
        <div className="simulator-card">
          <Map
            center={centerPoint}
            originalTrip={originalTrip}
            optimizedTrip={optimizedTrip}
            startPoint={startPoint}
            endPoint={endPoint}
          />
        </div>
      </section>
    </div>
  );

  function transferTrip() {
    // const trip = [];
    // testPoint.forEach(val => {
    //   trip.push([Number(val.point.lat), Number(val.point.lon)]);
    // });
    // return trip;
    const positions = TRIP_TWO.VehicleSpecification.Basic.position;
    const positionValues = Object.values(positions).map(item => {
      return [Number(item.latitude), Number(item.longitude)];
    });
    return positionValues;
  }

  function getServersPoint() {
    axios
      .post('http://100.98.137.10:8879/v1/pos-match/123?type=poi', TRIP_TWO)
      .then(res => {
        res.data && res.data.paths && res.data.paths.length > 0
          ? setOptimizedTrip(decode(res.data.paths[0].points, false))
          : console.warn('get path problem');
      });
  }

  function getLocalPoint() {}
}
