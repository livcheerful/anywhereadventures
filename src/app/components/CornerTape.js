export default function CornerTape({ children }) {
  return (
    <div>
      <img
        className="relative top-4 -left-12 w-24 z-10 -rotate-45"
        src="/tape1.png"
      />
      {children}
      <img
        className="absolute -bottom-4 -right-10 w-24 z-10 -rotate-45"
        src="/tape1.png"
      />
    </div>
  );
}
