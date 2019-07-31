import React, { useState, useEffect } from 'react';

import { testPoint } from '../../components/test.js';

import Map from '../../components/map.jsx';

export default function Simulator() {
  const [position, setPosition] = useState({ lat: 0, lon: 0 });

  useEffect(() => {
    const point = testPoint[0].point;
    setPosition({ lat: Number(point.lat), lon: Number(point.lon) });
  });

  return (
    <div className="pages home simulator">
      <section className="simulator-cont">
        <div className="simulator-card">
          <Map position={position} trip={transferTrip(testPoint)} />
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
}
