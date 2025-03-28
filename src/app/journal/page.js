"use client";
import Navbar from "../components/Navbar";
import ScrapbookPage from "../components/ScrapbookPage";
import StampbookPage from "../components/StampbookPage";
import { useState, useEffect } from "react";
export default function Page() {
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = [
    {
      text: "Scrapbook",
      render: () => {
        // Maybe show map somewhere here?
        return <ScrapbookPage />;
      },
    },
    {
      text: "Stampbook",
      render: () => {
        return <StampbookPage />;
      },
    },
    {
      text: "Do more research",
      render: () => {
        return (
          <div>
            <div>Make your own map of library items</div>
            <div>
              Can find items, write about them, and they get added to a map??
            </div>
            <div>Should you be able to share your map...</div>
          </div>
        );
      },
    },
    {
      text: "About the project",
      render: () => {
        return <div>Hello in about the project</div>;
      },
    },
  ];

  const makeTabs = () => {
    return tabs.map((tab, i) => {
      return (
        <div
          key={i}
          className={`${
            currentTab == i ? "bg-white" : "bg-slate-300"
          } p-2 rounded-t-md shadow-lg font-bold text-nowrap cursor-pointer`}
          onClick={() => {
            setCurrentTab(i);
          }}
        >
          {tab.text}
        </div>
      );
    });
  };

  return (
    <div className="bg-emerald-900 h-screen">
      <Navbar />
      <div className="fixed bottom-0 flex flex-col h-screen pt-2 w-full">
        <div className="shrink-0 flex flex-row overflow-x-auto gap-2 w-full px-2">
          {makeTabs()}
        </div>
        <div
          className="grow bg-amber-50 w-full h-full overflow-y-scroll"
          onScroll={() => {
            console.log("scrolling");
          }}
        >
          {tabs[currentTab].render()}
        </div>
      </div>
    </div>
  );
}
