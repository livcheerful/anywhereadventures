import { Suspense } from "react";
import JournalClient from "../components/journal/JournalClient";

export default async function Page({ params }) {
  return (
    <div className="relative flex w-full overflow-hidden">
      <Suspense>
        <JournalClient params={params} />
      </Suspense>
    </div>
  );
}
