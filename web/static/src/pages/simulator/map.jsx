import React, { useState, useEffect } from "react";
import { Map as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";

export default function SimulatorMap() {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [zoom, setZoom] = useState(18);
  const [deg, setDeg] = useState(95);
  const [icon, setIcon] = useState();

  function handIcon() {
    const icon = divIcon({
      iconAnchor: [20, 30],
      iconSize: [40, 60],
      className: "icon-car",
      html: `<span style='transform:rotate(${deg}deg)'></span>`
    });

    setIcon(<Marker position={position} icon={icon} />);
  }

  useEffect(() => {
    handIcon();
  }, [deg]);

  return (
    <LeafletMap
      center={position}
      fadeAnimation={false}
      zoom={zoom}
      zoomControl={false}
      minZoom={13}
      maxZoom={20}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        minZoom={8}
        maxZoom={13}
      />
      {icon}
    </LeafletMap>
  );
}
