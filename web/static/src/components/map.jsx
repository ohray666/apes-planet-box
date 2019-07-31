import React from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import Leaflet from 'leaflet';

import { default as PolylineText } from './polyLine';

const startIconStyle = {
  className: 'start-icon',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  html: `<div style="background:#ffffff;width:20px;height:20px;border-radius:50%;border:#0082f0 solid 4px" />`
};

export default class SimulatorMap extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { position, trip } = this.props;
    return (
      <LeafletMap
        center={[position.lat, position.lon]}
        fadeAnimation={false}
        zoom={18}
        // zoomControl={false}
        scrollWheelZoom={false}
        ref="map"
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position ? (
          <Marker
            position={[position.lat, position.lon]}
            key={1325234}
            icon={Leaflet.divIcon(startIconStyle)}
          >
            <Popup>
              <div>
                A pretty CSS3 popup. <br /> Easily customizable.
              </div>
            </Popup>
          </Marker>
        ) : null}
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
}
