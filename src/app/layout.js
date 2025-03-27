import localFont from "next/font/local";
import "./globals.css";
import Comic from "./components/mdx/Comic";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Anywhere Adventures",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="lg:w-limiter">{children}</div>

        <div
          className={`absolute top-0 right-0 w-fit invisible lg:visible -z-10`}
        >
          <Comic
            speechBubbles={[
              {
                text: "oh hey there! it looks like you're checking out the site on a desktop computer",
              },
              {
                text: "*Anywhere Adventures* was designed to be viewed on a phone, so the page is squished on purpose here",
              },
              {
                text: "But you can still read and learn, even if you aren't based in Seattle!",
              },
            ]}
            image="/comics/Vivian.png"
            position="right"
          />
        </div>
      </body>
    </html>
  );
}
