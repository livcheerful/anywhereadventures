"use client";

import { useEffect, useState } from "react";

export default function ImageMap() {
  const [canvas, setCanvas] = useState();
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1920);

  const [seattlePoints, setSeattlePoints] = useState([
    { lat: 47.650581, long: -122.378576 },
    { lat: 47.666548, long: -122.423468 },
    { lat: 47.596186, long: -122.340746 },
    { lat: 47.601968, long: -122.284254 },
    { lat: 47.642425, long: -122.277696 },
    { lat: 47.62815, long: -122.33318 },
  ]);
  const [topLeftCoord, setTopLeftCoord] = useState({
    lat: 47.725424,
    long: -122.445566,
  });

  const fetchSeattleShape = async () => {
    var result = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      // The body contains the query
      // to understand the query language see "The Programmatic Query Language" on
      // https://wiki.openstreetmap.org/wiki/Overpass_API#The_Programmatic_Query_Language_(OverpassQL)
      body:
        "data=" +
        encodeURIComponent(`
                [out:json];
                area["name"="Seattle"]["boundary"="administrative"];
                relation["type"="boundary"](area);
                out body;
            `),
    }).then((data) => data.json());
    console.log(result.elements[0]);
    result.elements[0].members;
    return result;
  };

  const coordinateToPoint = (coordinate) => {
    const y = (topLeftCoord.lat - coordinate.lat) * 5000;
    const x = (coordinate.long - topLeftCoord.long) * 5000;
    console.log(x);
    console.log(y);

    return { x: x, y: y };
  };

  useEffect(() => {
    fetchSeattleShape();
  }, []);

  useEffect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#79e2fc";
    ctx.fillRect(0, 0, width, height);
    ctx.beginPath();

    ctx.strokeStyle = "black 2px";
    ctx.lineWidth = 2;
    const originp = coordinateToPoint(seattlePoints[0]);
    ctx.moveTo(originp.x, originp.y);
    for (let i = 1; i < seattlePoints.length; i++) {
      const p = coordinateToPoint(seattlePoints[i]);
      ctx.lineTo(p.x, p.y);
    }

    // ctx.moveTo(20, 20);
    // ctx.lineTo(200, 20);
    // ctx.lineTo(200, 0);
    // ctx.lineTo(0, 0);
    ctx.lineTo(originp.x, originp.y);
    ctx.fillStyle = "#94e864";
    ctx.fill();
    ctx.stroke();
  }, [canvas]);
  return (
    <div>
      <canvas
        className=" border-2 border-black"
        width={width}
        height={height}
        style={{
          imageRendering: "pixelated",
          //   width: `${width}px`,
          //   height: `${height}px`,
        }}
        ref={(c) => {
          setCanvas(c);
        }}
      />
    </div>
  );
}
