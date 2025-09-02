import LoadingAnimation from "./LoadingAnimation";
export default function LoadingTransitionPage({}) {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-[200] text-black bg-white">
      <LoadingAnimation />
    </div>
  );
}
