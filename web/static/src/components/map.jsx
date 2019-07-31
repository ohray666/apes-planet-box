import { default as PolylineText } from './polyLine';

import React from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';

export default function SimulatorMap({ position, trip }) {
  const point = [Number(position.lat), Number(position.lon)];
  const myIcon = divIcon({
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    className: 'icon-car',
    html: `<span></span>`
  });
  return (
    <LeafletMap
      center={point}
      animation={true}
      duration={1000}
      zoom={18}
      zoomControl={true}
      // scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker animate={true} duration={1000} position={point} icon={myIcon} key={1}>
        <Popup>
          <div>
            A pretty CSS3 popup. <br /> Easily customizable.
          </div>
        </Popup>
      </Marker>
      {trip && trip.length ? (
        <PolylineText
          positions={trip}
          weight={8}
          textPathOptions={{
            repeat: true,
            offset: 6,
            attributes: {
              fill: 'white',
              'font-size': '16px'
            }
          }}
        />
      ) : null}
    </LeafletMap>
  );
}
