export default function ScrapbookCornerDisplay({ imgUrl }) {
  return (
    <div
      className="absolute -bottom-10 left-0 rotate-45 drop-shadow-2xl"
      style={{
        width: "100px",
        height: "200px",
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
}
