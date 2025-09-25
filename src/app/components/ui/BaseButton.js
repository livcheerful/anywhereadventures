export default function BaseButton({ classes, onClick, label, children }) {
  const className =
    "rounded-lg p-2 border-2 border-black  text-black " + classes.join(" ");
  return (
    <div>
      <button
        aria-label={label}
        className={`font-bold ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}
