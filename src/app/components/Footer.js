export default function Footer() {
  return (
    <div className="relative w-full flex flex-col bg-green-900 text-white font-light gap-2 p-2 border-black border-t-2 ">
      <div className="flex flex-row justify-between w-full h-auto">
        <div className="w-1/3">
          <img src="/LClogo.jpg" className="border-2 border-black" />
        </div>
        <div className="flex flex-col gap-3 items-end justify-end shrink-0 text-sm font-bold">
          <div>Privacy Policy</div>
          <div>Terms of Use</div>
        </div>
      </div>
      <div className="text-sm text-center italic">
        Anywhere Adventures is a project from the 2025 Innovator in Residence at
        the Library of Congress, Vivian Li.
      </div>
    </div>
  );
}
