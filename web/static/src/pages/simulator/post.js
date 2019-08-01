export const POST = {
  header: {
    messageId: "d529eda0-d4eb-4a47-aaf6-f8ab8293e7a1",
    timestamp: 1563630540000,
    eventId: "6396fb64-6fe7-477b-af5a-b44a646ed9d1",
    creatorId: 1,
    messageTTL: 1,
    isAck: true,
    ackRequired: true
  },
  body: {
    serviceId: 2001,
    messageType: 1,
    serviceData: {
      telemetry: [
        {
          timestamp: 1563630540000,
          odometer: {
            odometer: 190000,
            usageMode: 1
          },
          engineStatus: {
            status: 1,
            engineBlockedStatus: 1,
            rpm: 1
          },
          engineOpStatus: {
            engineOilLevel: 1,
            engineOilLevelStatus: 1,
            engineOilTemperature: 63.614,
            engineOilPressureWarning: 1,
            engineCoolantLevel: 1,
            engineCoolantLevelStatus: 1,
            engineCoolantTemperature: 67.813,
            isWaterInOil: true
          },
          doorStatus: {
            frontRightDoorOpen: 1,
            frontLeftDoorOpen: 1,
            rearRightDoorOpen: 1,
            rearLeftDoorOpen: 1,
            frontRightDoorLock: 1,
            frontLeftDoorLock: 1,
            rearRightDoorLock: 1,
            rearLeftDoorLock: 1,
            centralLocking: 1
          },
          position: {
            latitude: 51.377719,
            longitude: 12.338217,
            altitude: 32.41,
            hdop: 31.45,
            nbSatellites: 1,
            heading: 18.7686,
            fixed: true,
            timestamp: 1563630540000,
            posCanBeTrusted: true,
            carLocatorStatUploadEn: true,
            isMarsCoordinates: true
          }
        }
      ]
    },
    seq: 1,
    version: "2.0.0"
  }
};
