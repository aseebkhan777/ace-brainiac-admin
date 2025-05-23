import React from "react";
import Sidebar from "../sidebar/index";
import Header from "../Header";

export function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <Header />
        <main className="flex-1 overflow-auto "> {/* Added padding-top to account for header height */}
          {children}
        </main>
      </div>
    </div>
  );
}