export default function StickyNote({ position, className, children }) {
  return (
    <div
      className={`stickyNote w-28 h-28   absolute z-50 p-2 flex flex-col justify-center  mt-2 ${className}`}
      style={{
        backgroundImage: `url(/stickynote.png)`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        ...position,
      }}
    >
      <div className="font-mono text-gray-900 font-bold text-sm text-center">
        {children}
      </div>
    </div>
  );
}
