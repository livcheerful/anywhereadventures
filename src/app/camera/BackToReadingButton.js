import { useRouter, useSearchParams } from "next/navigation";
export default function BackToReadingButton() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refSlug = searchParams.get("locationId");
  return (
    <button
      className="py-3 px-2 h-fit bg-emerald-200 hover:bg-emerald-400 font-bold text-emerald-800 rounded-lg drop-shadow-lg"
      onClick={() => {
        console.log("Hello vivian");
        router.push(`/${refSlug}`);
      }}
    >
      Back to reading
    </button>
  );
}
