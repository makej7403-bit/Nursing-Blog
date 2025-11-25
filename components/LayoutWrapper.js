"use client";

import Nav from "./Nav";
import Footer from "./Footer";

export default function LayoutWrapper({ children }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
