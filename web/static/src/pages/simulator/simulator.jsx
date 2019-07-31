import React, { useState, useEffect } from 'react';

import { testPoint } from '../../components/test.js';
import Map from '../../components/map.jsx';

export default function Simulator() {
  const [start, setStart] = useState(false);
  const [random, setRandom] = useState();
  const [count, setCount] = useState(0);
  const [position, setPosition] = useState({ lat: 0, lon: 0 });
  const [msg, setMsg] = useState([0]);
  const [actionClass, setActionClass] = useState('');

  useEffect(() => {
    console.log(start);
    if (start) {
      const startMove = setInterval(() => {
        setRandom(Math.random());
      }, 1000);
      return () => {
        clearInterval(startMove);
      };
    }
  }, [start]);

  useEffect(() => {
    setCount(count + 1);
    creatMsg();
    const point = testPoint[count % 200].point;
    setPosition({ lat: Number(point.lat), lon: Number(point.lon) });
  }, [random]);

  function creatMsg() {
    setActionClass('action');
    setTimeout(() => {
      setActionClass('');
    }, 400);

    const msgText = [msg[0] + 10];
    setMsg(msgText.concat(msg));
  }

  function renderMsg() {
    return msg.map((item, key) => {
      return (
        <li className={key === 0 ? actionClass : ''} key={key}>
          {item}
        </li>
      );
    });
  }

  function handStart() {
    setStart(!start);
  }

  return (
    <div className="pages home simulator">
      <section className="simulator-cont">
        <div className="simulator-card">
          <div className="simulator-car" />
        </div>
        <div className="simulator-card">
          <Map position={position} />
        </div>
        <div className="simulator-card">
          <ul className="simulator-log">{renderMsg()}</ul>
        </div>
      </section>

      <div className="simulator-start" onClick={handStart}>
        {start ? 'Stop' : 'Start'}
      </div>
    </div>
  );
}
