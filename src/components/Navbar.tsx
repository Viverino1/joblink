"use client";

import Link from "next/link";
import Icon from "./Icon";
import { Button } from "./ui/button";
import SpecialButton from "./SpecialButton";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isMenuOpen, setMenuIsOpen] = useState(false);
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full h-16 bg-background/50 border-b border-border flex items-center px-3 justify-between backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" className="pl-1.5 pr-2.5">
              <Icon className="w-6 h-6" />
              <p className="font-mont font-bold text-lg mt-1 hidden md:block">
                JobLink
              </p>
            </Button>
          </Link>

          <div className="space-x-5 hidden md:block">
            <NavLink link="/about">About</NavLink>
            <NavLink link="/browse">Browse</NavLink>
            <NavLink link="/post">Post</NavLink>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-3 md:space-x-5">
            <SignedOut>
              <NavLink link="/sign-in">Sign In</NavLink>
            </SignedOut>
            <Link href="/browse">
              <SpecialButton>Browse Jobs</SpecialButton>
            </Link>
            <SignedIn>
              <div className="md:pr-2 flex items-center justify-center">
                <UserButton />
              </div>
            </SignedIn>
            <button
              className="md:hidden"
              onClick={() => setMenuIsOpen(!isMenuOpen)}
            >
              <RxHamburgerMenu
                size={24}
                className="text-foreground/70 hover:text-foreground transition"
              />
            </button>
          </div>
        </div>
      </nav>
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-md transition duration-500 bg-background/50 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>
      <nav
        className={`fixed bottom-0 right-0 left-0 h-2/3 flex flex-col items-center pt-[12vw] bg-background rounded-t-2xl border border-border transition duration-500 z-20 ${
          isMenuOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <RxCross2
          size={24}
          className="text-foreground/70 hover:text-foreground absolute top-4 right-3.5"
          onClick={() => setMenuIsOpen(!isMenuOpen)}
        />
        <NavLinkMobile link="/about">About</NavLinkMobile>
        <NavLinkMobile link="/browse">Browse</NavLinkMobile>
        <NavLinkMobile link="/post">Post</NavLinkMobile>
      </nav>
    </>
  );
}

function NavLink(props: { children: React.ReactNode; link: string }) {
  return (
    <Link
      className="text-sm text-foreground/70 hover:text-foreground transition whitespace-nowrap"
      href={props.link}
    >
      {props.children}
    </Link>
  );
}

function NavLinkMobile(props: { children: React.ReactNode; link: string }) {
  return (
    <Link
      className="text-[8vw] font-mont font-semibold text-foreground/70 hover:text-foreground transition whitespace-nowrap"
      href={props.link}
    >
      {props.children}
    </Link>
  );
}
