import Navbar from "@/components/Navbar";
import React from "react";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{props.children}</main>
    </>
  );
}
