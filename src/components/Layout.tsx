import React from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";

type Props = {
  children?: React.ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <div className="grid h-screen grid-cols-7 grid-rows-5 gap-4 bg-slate-950 p-4">
      <aside className="col-span-1 row-span-5">
        <Sidebar />
      </aside>

      <main className="col-span-6 row-span-5 overflow-y-auto">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}

export default Layout;
