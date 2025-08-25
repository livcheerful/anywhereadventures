export default function StickyNote({ position, className, id, children }) {
  return (
    <div
      id={id}
      className={`stickyNote w-28 h-28 absolute z-50 p-2 text-gray-800 justify-center mt-2 ${className}`}
      style={{
        backgroundImage: `url(/stickynote.png)`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        ...position,
      }}
    >
      {children}
    </div>
  );
}
