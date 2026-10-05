import React from "react";
import DashboardProvider from "./provider";

function DashboardLayout({ children }) {
  return (
    <div className=" flex w-[calc(100vw-20px)]  bg-gray-50 ">
      <DashboardProvider>{children}</DashboardProvider>
    </div>
  );
}

export default DashboardLayout;
