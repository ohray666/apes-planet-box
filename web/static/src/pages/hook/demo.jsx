import React, { useState, useEffect, useContext } from "react";
import ThemeContext from "./theme.jsx";

export default function Demo({ id }) {
  const [stars, setStars] = useState(0);

  const cName = useName();
  const eName = useName();
  const width = useResize();

  const theme = useContext(ThemeContext);

  function onStars() {
    setStars(stars + 10);
  }

  return (
    <section className={theme}>
      <h1 onClick={onStars}>
        {cName.value} / {eName.value} counts {stars} stars
      </h1>
      <h4>window width: {width}px</h4>
      <div>
        <label>
          Chinese name
          <input {...cName} />
        </label>
      </div>
      <div>
        <label>
          English name
          <input {...eName} />
        </label>
      </div>
    </section>
  );
}
// cumston hooks
function useName() {
  const [name, setName] = useState();
  function onName(e) {
    setName(e.target.value);
  }
  return { value: name, onChange: onName };
}

// cumston hooks
function useResize() {
  const [width, setWidth] = useState(0);

  function onResize() {
    const winWidth = window.innerWidth;
    setWidth(winWidth);
  }

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return width;
}
