import localFont from "next/font/local";
import "./globals.css";
import Comic from "./components/mdx/Comic";

const vivianFont = localFont({
  src: "./fonts/Viviantesthand-Regular.ttf",
  variable: "--font-vivian",
  weight: "300",
});

export const metadata = {
  title: "Anywhere Adventures",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="">
      <body className={`${vivianFont.variable} antialiased`}>
        <div className="md:w-limiter">{children}</div>

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
