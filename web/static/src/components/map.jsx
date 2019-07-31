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
      animation={true}
      duration={1000}
      zoom={18}
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        animate={true}
        duration={1000}
        position={position}
        icon={myIcon}
      />
    </LeafletMap>
  );
}
