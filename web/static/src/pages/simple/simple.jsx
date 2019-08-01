import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, SelectOption } from 'eds-react/lib/components/select';

import { CONF } from '../../../../config/config.js';
import { TRIP_ONE } from '../../components/trip_path_20190713154335.js';
import { TRIP_TWO } from '../../components/trip_path_20190714180533.js';
import { TRIP_THREE } from '../../components/trip_path_20190729201805.js';

import Map from '../../components/map.jsx';
import { decode } from '../../utils/decode';

const TRIP = [TRIP_ONE, TRIP_TWO, TRIP_THREE];

export default function Simulator() {
  const [startPoint, setStartPoint] = useState([0, 0]);
  const [endPoint, setEndPoint] = useState([0, 0]);

  const [tripNum, setTripNum] = useState('1');

  const [optimizedTrip, setOptimizedTrip] = useState([]);
  const [originalTrip, setOriginalTrip] = useState(transferTrip(1));

  useEffect(() => {
    setOptimizedTrip([]);
    setOriginalTrip(transferTrip(tripNum));
    getServersPoint();
  }, [tripNum]);

  return (
    <div className="pages home simulator">
      <section className="simple-cont">
        <div className="simple-select">
          <p>Select a trip</p>
          <Select
            value={tripNum}
            onChange={value => {
              setTripNum(value[0]);
            }}
            placeholder="Select trip"
          >
            <SelectOption key={'0'}>Trip 1</SelectOption>
            <SelectOption key={'1'}>Trip 2</SelectOption>
            <SelectOption key={'2'}>Trip 3</SelectOption>
          </Select>
        </div>
        <div className="simple-map">
          <Map
            originalTrip={originalTrip}
            optimizedTrip={optimizedTrip}
            startPoint={originalTrip[0]}
            endPoint={originalTrip[originalTrip.length - 1]}
          />
        </div>
      </section>
    </div>
  );

  function transferTrip(tripNum) {
    const positions = TRIP[tripNum].VehicleSpecification.Basic.position;
    const positionValues = Object.values(positions).map(item => {
      return [Number(item.latitude), Number(item.longitude)];
    });
    return positionValues;
  }

  function getServersPoint() {
    axios
      .post(`${CONF.HOST}:${CONF.PORT}/${CONF.PATH_TRIP}`, TRIP[tripNum])
      .then(res => {
        if (res.data && res.data.paths && res.data.paths.length > 0) {
          setOptimizedTrip(decode(res.data.paths[0].points, false));
        } else {
          console.warn('get path problem');
        }
      });
  }

  function getLocalPoint() {}
}
