import { default as PolylineText } from "./polyLine";

import React from "react";
import { Map as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";

const myIcon = {
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  className: "icon-car",
  html: `<span></span>`
};
const startIconStyle = {
  className: "start-icon",
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  html: `<div style="background:#ffffff;width:20px;height:20px;border-radius:50%;border:#0082f0 solid 4px" />`
};
const endIconStyle = {
  className: "end-icon",
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  html: `<div style="background:#0082f0;width:24px;height:24px;border-radius:50%;border:#ffffff solid 4px" />`
};

export default function SimulatorMap({
  center,
  trip,
  currentPoint,
  startPoint,
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
        url="https://osmmaps.ecf.cloud/osm_tiles//11/1340/875.png?access_token=b3NtOjFxMnczZTRy7"
      />
      <CurrentMarker point={currentPoint} />
      <TripStartMarker point={startPoint} />
      <TripEndMarker point={endPoint} />
      <TripPath path={trip} />
    </LeafletMap>
  );

  function getBound() {
    if (trip) {
      return trip;
    }
    // 若起止点坐标相同，则map的fixBounds会报错，rta引用leaflet的_getBoundsCenterZoom方法与dev不同 lixiaojia
    if (
      startPoint &&
      endPoint &&
      startPoint.lat !== endPosition.lat &&
      startPoint.lon !== endPosition.lon
    ) {
      // 没有中途点的时候，先默认按起始点显示边界
      const startBounds = [startPoint.lat, startPoint.lon];
      const endBounds = [endPoint.lat, endPoint.lon];
      return [startBounds, endBounds];
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
      key={1}
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
      key={1}
    >
      <Popup>
        <div>Trip start point</div>
      </Popup>
    </Marker>
  ) : null;
}

function TripEndMarker({ point }) {
  return point ? (
    <Marker
      animate={true}
      duration={1000}
      position={point}
      icon={divIcon(endIconStyle)}
      key={1}
    >
      <Popup>
        <div>Trip end point</div>
      </Popup>
    </Marker>
  ) : null;
}

function TripPath({ path }) {
  return path && path.length ? (
    <PolylineText
      positions={path}
      weight={8}
      textPathOptions={{
        repeat: true,
        offset: 6,
        attributes: {
          fill: "white",
          "font-size": "16px"
        }
      }}
    />
  ) : null;
}
