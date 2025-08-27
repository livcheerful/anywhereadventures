export default function Footer() {
  return (
    <div className="relative w-full flex flex-col bg-green-900 text-white font-light gap-2 p-2 border-black border-t-2 ">
      <div className="flex flex-row justify-between w-full h-auto">
        <div className="w-1/3">
          <img src="/LClogo.jpg" className="border-2 border-black" />
        </div>
        <div className="flex flex-col gap-3 items-end justify-end shrink-0 text-sm font-bold">
          <a
            className="underline"
            href="https://www.loc.gov/legal/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          <a
            className="underline"
            href="https://www.loc.gov/legal/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Legal
          </a>
        </div>
      </div>
      <div className="text-sm text-center text-pretty italic font-bold">
        Anywhere Adventures is a project from the 2025 Innovator in Residence at
        the Library of Congress, Vivian Li, and the Library of Congress's Labs
        team.
      </div>
    </div>
  );
}
