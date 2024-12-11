import Image from "next/image";
import PixelMap from "./components/Map";
import ImageMap from "./components/GeneratePixels";

export default function Home() {
  let center = [-122.341077, 47.619161];
  return (
    <div>
      <div className="">
        <ImageMap />
        <div>
          <PixelMap zoom={10} centerStart={center} />
          Zoom Level 10
        </div>

        <div>
          <PixelMap zoom={16} centerStart={center} />
          Zoom Level 16
        </div>
        <div>
          <PixelMap zoom={17} centerStart={center} />
          Zoom Level 17
        </div>
      </div>
    </div>
  );
}
