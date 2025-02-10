
import dynamic from "next/dynamic";
export const slugsToObj = {
    "hello-world": dynamic(()=>import("../content/hello-world.mdx")),"sinking-ship": dynamic(()=>import("../content/sinking-ship.mdx")),"uw": dynamic(()=>import("../content/uw.mdx"))
}
