export default function Box({ isModal, children, className }) {
  let outerClassNames = "absolute w-full h-full";
  // Don't capture outside clicks
  if (!isModal) {
    outerClassNames += " pointer-events-none";
  }
  return (
    <div className={outerClassNames}>
      <div
        className={`relative border-2 border-black text-center ${className}`}
        style={{
          boxShadow: "5px 5px black",
        }}
      >
        {children}
      </div>
    </div>
  );
}
