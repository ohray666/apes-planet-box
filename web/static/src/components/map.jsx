import React from "react";
import { Map as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";

export default function SimulatorMap({ position }) {
  console.log(position);
  return (
    <LeafletMap
      center={position}
      fadeAnimation={false}
      zoom={18}
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </LeafletMap>
  );
}
