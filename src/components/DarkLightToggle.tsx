"use client";
import { useTheme } from "next-themes";
import React from "react";
import { IoMoon, IoSunny } from "react-icons/io5";
import { Button } from "./ui/button";

export default function DarkLightToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <div className="">
      <Button
        variant={"link"}
        className="w-10 h-10 text-foreground/70 hover:text-foreground transition"
        onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
      >
        {theme == "light" ? <IoMoon /> : <IoSunny />}
      </Button>
    </div>
  );
}
