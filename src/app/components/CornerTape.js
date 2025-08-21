export default function CornerTape({
  children,
  directions = { nw: true, sw: true },
}) {
  return (
    <div>
      {directions.nw && (
        <img
          className="absolute top-2 -left-8 w-24 z-10 -rotate-45"
          src="/tape1.png"
        />
      )}
      {directions.ne && (
        <img
          className="absolute top-1 -right-8 w-24 z-10 rotate-45"
          src="/tape1.png"
        />
      )}
      {children}
      {directions.sw && (
        <img
          className="absolute -bottom-1 -left-8 w-24 z-10 rotate-45"
          src="/tape1.png"
        />
      )}
      {directions.se && (
        <img
          className="absolute -bottom-1 -right-8 w-24 z-10 -rotate-45"
          src="/tape1.png"
        />
      )}
    </div>
  );
}
