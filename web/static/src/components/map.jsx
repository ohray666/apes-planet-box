import { default as PolylineText } from './polyLine';

import React from 'react';
import {
  Map as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  Tooltip
} from 'react-leaflet';
import { divIcon } from 'leaflet';

const myIcon = {
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  className: 'icon-car',
  html: `<span></span>`
};
const startIconStyle = {
  className: 'start-icon',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  html: `<div style="background:#ffffff;width:20px;height:20px;border-radius:50%;border:#0082f0 solid 4px" />`
};
const middleIconStyle = {
  className: 'mid-icon',
  iconSize: [8, 8],
  iconAnchor: [4, 4],
  html: `<div style="border:3px solid white;background:#4990e2;width:8px;height:8px;border-radius:50%" />`
};
const endIconStyle = {
  className: 'end-icon',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  html: `<div style="background:#0082f0;width:24px;height:24px;border-radius:50%;border:#ffffff solid 4px" />`
};

export default function SimulatorMap({
  center,
  originalTrip,
  optimizedTrip,
  currentPoint,
  startPoint,
  middlePoint,
  endPoint
}) {
  return (
    <LeafletMap
      center={center}
      animation={true}
      duration={1000}
      zoom={getBound() ? undefined : 18}
      zoomControl={false}
      // scrollWheelZoom={false}
      bounds={getBound()}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://osmmaps.ecf.cloud/osm_tiles//{z}/{x}/{y}.png?access_token=b3NtOjFxMnczZTRy7"
      />
      <CurrentMarker point={currentPoint} />
      <TripStartMarker point={startPoint} />
      <TripEndMarker point={endPoint} />
      <TripPath path={originalTrip} color={'red'} />
      <TripPath path={optimizedTrip} />
    </LeafletMap>
  );

  function getBound() {
    if (originalTrip && optimizedTrip) {
      return originalTrip.concat(optimizedTrip);
    } else if (originalTrip) {
      return originalTrip;
    }
    // 若起止点坐标相同，则map的fixBounds会报错，rta引用leaflet的_getBoundsCenterZoom方法与dev不同 lixiaojia
    if (
      startPoint &&
      endPoint &&
      startPoint[0] !== endPosition[0] &&
      startPoint[1] !== endPosition[1]
    ) {
      // 没有中途点的时候，先默认按起始点显示边界
      return [startPoint, endPosition];
    } else {
      return undefined;
    }
  }
}

function CurrentMarker({ point }) {
  return point ? (
    <Marker
      animate={true}
      duration={1000}
      position={point}
      icon={divIcon(myIcon)}
      key={'current'}
    >
      <Popup>
        <div>Current point</div>
      </Popup>
    </Marker>
  ) : null;
}

function TripStartMarker({ point }) {
  return point ? (
    <Marker
      animate={true}
      duration={1000}
      position={point}
      icon={divIcon(startIconStyle)}
      key={'start'}
    >
      <Popup>
        <div>Trip start point</div>
      </Popup>
    </Marker>
  ) : null;
}

function TripMiddleMarker({ trip }) {
  return trip && trip.length ? (
    <div>
      {trip.map((point, index) => (
        <Marker
          key={`middle_${index}`}
          position={point}
          icon={divIcon(middleIconStyle)}
        >
          <Tooltip>
            <span>Trip middle point</span>
          </Tooltip>
        </Marker>
      ))}
    </div>
  ) : null;
}

function TripEndMarker({ point }) {
  return point ? (
    <Marker
      animate={true}
      duration={1000}
      position={point}
      icon={divIcon(endIconStyle)}
      key={'end'}
    >
      <Popup>
        <div>Trip end point</div>
      </Popup>
    </Marker>
  ) : null;
}

function TripPath({ path, color }) {
  return path && path.length ? (
    <>
      <PolylineText
        positions={path}
        weight={8}
        textPathOptions={{
          text: '     >     ',
          repeat: true,
          offset: 6,
          attributes: {
            fill: 'white',
            'font-size': '16px'
          },
          style: color
            ? {
                color: color,
                opacity: 0.8,
                weight: 5
              }
            : { weight: 5 }
        }}
      />
      <TripMiddleMarker trip={path} />
    </>
  ) : null;
}
