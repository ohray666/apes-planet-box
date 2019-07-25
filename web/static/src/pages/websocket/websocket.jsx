import React, { useState, useEffect } from "react";

export default function Websocket() {
  const [msg, setMsg] = useState("");
  const [txt, setTxt] = useState("");
  const socket = new WebSocket("ws://localhost:7080");
  const json = {
    id: 2,
    name: "An ice sculpture",
    price: 12.5,
    tags: ["cold", "ice"],
    dimensions: {
      indent: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
      length: 7.0,
      width: 52.0,
      height: 9.5
    },
    warehouseLocation: {
      latitude: -78.75,
      longitude: 20.4
    }
  };
  const html = JSON.stringify(json, null, 4);

  useEffect(() => {
    console.log("【client】", socket);
    socket.onerror = function() {
      console.log("【client】websocket error");
    };
    socket.onopen = function() {
      console.log("websocket connect success");
      // socket.send("【client】hello websocket");
    };
    socket.onmessage = function(event) {
      console.log("【client】websocket data:", event);
      setMsg(event.data);
    };
    socket.onclose = function() {
      console.log("【client】websocket close");
    };

    socket.onbeforeunload = function() {
      websocket.close();
    };
  }, [msg]);

  function handChangeTxt(e) {
    setTxt(e.target.value);
  }
  function handSendWebsocket() {
    if (socket.OPEN) {
      console.log("【client】socket.OPEN: ", socket.OPEN);
      socket.send(txt);
    } else {
      console.log("【client】", socket);
    }
  }

  return (
    <div className="pages">
      <div>Websocket</div>
      <div>WebChat</div>
      <input onChange={handChangeTxt} />
      <button onClick={handSendWebsocket}>send</button>
      <ul>
        <li>{msg}</li>
      </ul>
      <div
        dangerouslySetInnerHTML={{
          __html: html
        }}
      />
    </div>
  );
}
