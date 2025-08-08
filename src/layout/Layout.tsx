// src/layout/Layout.tsx

import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar"; // adjust the path if needed

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-16"> {/* spacing below navbar */}
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
