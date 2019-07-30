import React from "react";
import { Map as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";

export default function SimulatorMap({ position }) {
  const myIcon = divIcon({
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    className: "icon-car",
    html: `<span></span>`
  });
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
      <Marker position={position} icon={myIcon} />
    </LeafletMap>
  );
}
