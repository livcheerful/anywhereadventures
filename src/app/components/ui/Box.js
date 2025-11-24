import FocusLock from "react-focus-lock";
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
    <FocusLock>
      <div className={outerClassNames}>
        <div
          className={`relative border-2 border-black text-center text-gray-800 overflow-y-auto ${className}`}
          style={{
            boxShadow: "5px 5px black",
          }}
        >
          {children}
        </div>
      </div>
    </FocusLock>
  );
}
