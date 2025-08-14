import "./globals.css";
import localFont from "next/font/local";
import ComicSection from "./components/mdx/ComicSection";
import { NotificationsProvider } from "./lib/NotificationsContext";

const vivianFont = localFont({
  src: "./fonts/Viviantesthand-Regular.ttf",
  variable: "--font-vivian",
  weight: "300",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="">
      <head>
        <title>Anywhere Adventures</title>
        <meta
          name="description"
          content="Learn local history through archival items."
        />
        <link rel="icon" href="/location.ico" />
        <script
          src="https://assets.adobedtm.com/f94f5647937d/624e2240e90d/launch-0610ec681aff.min.js"
          async
        ></script>
      </head>
      <body className={`${vivianFont.variable} antialiased`}>
        <NotificationsProvider>
          <div className="md:w-limiter">{children}</div>

          <div
            className={`absolute top-0 right-0 w-96 invisible lg:visible -z-10 dark:text-black`}
          >
            <ComicSection
              elements={[
                {
                  type: "image",
                  src: "/comics/Vivian.png",
                  position: { col: 3, row: 2 },
                  size: { width: 1, height: 2 },
                },
                {
                  type: "text",
                  src: "oh hey there! it looks like you're checking out the site on a desktop computer",
                  position: { col: 1, row: 1 },
                  size: { width: 2, height: 2 },
                  style: { outline: "bubble" },
                  bubbleStyle: { tailDegree: 10 },
                },
                {
                  type: "text",
                  src: "*Anywhere Adventures* was designed to be viewed on a phone, so the page is squished on purpose here",
                  position: { col: 1, row: 3 },
                  size: { width: 2, height: 2 },
                  style: { outline: "bubble" },
                  bubbleStyle: { tailDegree: 330 },
                },
                {
                  type: "text",
                  src: "But you can still read and learn, even if you aren't based in Seattle, SE Wyoming, or Chicago!",
                  position: { col: 1, row: 5 },
                  size: { width: 3, height: 1 },
                  style: { outline: "bubble" },
                  bubbleStyle: { tailDegree: 310 },
                },
              ]}
            />
          </div>
        </NotificationsProvider>
      </body>
    </html>
  );
}
