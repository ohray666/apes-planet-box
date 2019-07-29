import React, { useState, useEffect } from "react";
const convert = require("xml-js");
const xml =
  '<?xml version="1.0" encoding="utf-8"?><note importance="high" logged="true"><trkpt lat="51.377719" lon="12.338217"><time>1970-01-01T00:00:00+00:00</time></trkpt><trkpt lat="51.37703" lon="12.339166"><time>1970-01-01T00:00:14+00:00</time></trkpt><trkpt lat="51.37754" lon="12.340111"><time>1970-01-01T00:00:35+00:00</time></trkpt><trkpt lat="51.376201" lon="12.341625"><time>1970-01-01T00:01:03+00:00</time></trkpt><trkpt lat="51.376151" lon="12.34196"><time>1970-01-01T00:01:04+00:00</time></trkpt></note>';
var result1 = convert.xml2json(xml, { compact: true, spaces: 2 });

const result = JSON.parse(result1).note.trkpt;
// {
//         "_attributes": {
//           "lat": "51.377719",
//           "lon": "12.338217"
//         },
//         "time": {
//           "_text": "1970-01-01T00:00:00+00:00"
//         }
//       }
const trkpt = result.map(item => {
  return {
    point: {
      lat: item._attributes.lat,
      lon: item._attributes.lon
    },
    text: item.time._text
  };
});

console.log(trkpt);

import SimulatorMap from "./map.jsx";

export default function Simulator() {
  const [random, setRandom] = useState();
  const [count, setCount] = useState(0);
  const [position, setPosition] = useState(0, 0);
  const [msg, setMsg] = useState([0]);
  const [actionClass, setActionClass] = useState("");

  useEffect(() => {
    const start = setInterval(() => {
      setRandom(Math.random());
    }, 1000);
    return () => {
      clearInterval(start);
    };
  }, []);

  useEffect(() => {
    setCount(count + 1);
    creatMsg();
    setPosition(trkpt[count % 4].point);
  }, [random]);

  function creatMsg() {
    setActionClass("action");
    setTimeout(() => {
      setActionClass("");
    }, 400);
    console.log("renderMsg f", msg[0], actionClass);
    const msgText = [msg[0] + 10];
    setMsg(msgText.concat(msg));
  }

  function renderMsg() {
    return msg.map((item, key) => {
      return (
        <li className={key === 0 ? actionClass : ""} key={key}>
          {item}
        </li>
      );
    });
  }

  return (
    <div className="pages home simulator">
      <section className="simulator-cont">
        <div className="simulator-card">
          <div className="simulator-car" />
        </div>
        <div className="simulator-card">
          1234567
          <SimulatorMap position={position} />
        </div>
        <div className="simulator-card">
          <ul className="simulator-log">{renderMsg()}</ul>
        </div>
      </section>
    </div>
  );
}
