"use client";
import Navbar from "../components/Navbar";
import ScrapbookPage from "../components/ScrapbookPage";
import StampbookPage from "../components/StampbookPage";
import MoreResearchPage from "../components/MoreResearchPage";
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
        return <MoreResearchPage />;
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
      <div
        className="fixed bottom-0 flex flex-col pt-2 w-full"
        style={{ height: "95%" }}
      >
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
