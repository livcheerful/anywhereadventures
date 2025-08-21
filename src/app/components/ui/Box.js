export default function Box({
  children,
  className,
  isModal = true,
  float = false,
}) {
  let outerClassNames = "w-full h-full";
  if (!float) outerClassNames += " absolute";
  // Don't capture outside clicks
  if (!isModal) {
    outerClassNames += " pointer-events-none";
  }
  return (
    <div className={outerClassNames}>
      <div
        className={`relative border-2 border-black text-center text-gray-800 overflow-y-scroll ${className}`}
        style={{
          boxShadow: "5px 5px black",
        }}
      >
        {children}
      </div>
    </div>
  );
}
