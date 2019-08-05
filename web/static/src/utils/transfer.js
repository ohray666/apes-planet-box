import { format } from 'date-fns';

export function transfer(data) {
  const position = {};
  data.forEach(val => {
    const point = {
      altitude: val.position.altitude,
      heading: val.position.heading,
      latitude: val.position.latitude,
      fixed: val.position.fixed ? 1 : 0,
      longitude: val.position.longitude
    };
    const timeStamp = format(val.timestamp, 'YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
    position[timeStamp] = point;
  });
  const trip = {
    deviceId: 'MHZBTGZ2338000002',
    VehicleSpecification: {
      Basic: {
        position: position
      }
    }
  };
  console.log(trip);
  return trip;
}
