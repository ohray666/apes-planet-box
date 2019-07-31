import React, { useState, useEffect } from 'react';

import { testPoint } from '../../components/test.js';

import Map from '../../components/map.jsx';

export default function Simulator() {
  const [centerPoint, setCenterPoint] = useState({ lat: 0, lon: 0 });
  const [startPoint, setStartPoint] = useState({ lat: 0, lon: 0 });
  const [endPoint, setEndPoint] = useState({ lat: 0, lon: 0 });

  useEffect(() => {
    setStartPoint(testPoint[0].point);
    setEndPoint(testPoint[testPoint.length - 1].point);
    if (startPoint && endPoint) {
      setCenterPoint({
        lat: (Number(startPoint.lat) + Number(endPoint.lat)) / 2,
        lon: (Number(startPoint.lon) + Number(endPoint.lon)) / 2
      });
    } else if (startPoint) {
      setCenterPoint(startPoint);
    }
  });

  return (
    <div className="pages home simulator">
      <section className="simulator-cont">
        <div className="simulator-card">
          <Map
            center={centerPoint}
            trip={transferTrip(testPoint)}
            startPoint={startPoint}
            endPoint={endPoint}
          />
        </div>
      </section>
    </div>
  );

  function transferTrip(data) {
    const trip = [];
    testPoint.forEach(val => {
      trip.push([Number(val.point.lat), Number(val.point.lon)]);
    });
    return trip;
  }

  function getCenterPoint() {}
}
