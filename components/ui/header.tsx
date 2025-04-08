"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { Coins, CloudSun, Newspaper, Info, VolumeX, Volume2, Search, Menu } from "lucide-react";
import { ModeToggle } from "@/app/mode-toggle";
import Image from "next/image";
import { Input } from "./input";
import { useSound } from "@/components/sound-provider";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const { isSoundEnabled, toggleSound, playSound } = useSound();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/currency") {
      return pathname === "/" || pathname === "/currency";
    }
    return pathname === path;
  };

  const renderNavLink = (path: string, label: string, icon: React.ReactNode) => {
    const active = isActive(path);
    const linkPath = path === "/currency" ? "/" : path;
    
    return active ? (
      <div
        className="text-sm font-medium flex items-center py-2 px-2 rounded-lg text-primary bg-primary/10 cursor-default"
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </div>
    ) : (
      <Link
        href={linkPath}
        className="text-sm font-medium flex items-center py-2 px-2 rounded-lg transition-colors hover:text-primary hover:bg-primary/5 text-muted-foreground"
        onClick={() => {
          playSound();
          setIsMobileMenuOpen(false);
        }}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  const handleClick = () => {
    playSound();
    toggleSound();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-4 md:hidden"
          onClick={() => {
            playSound();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* App Heading - Always visible on all devices */}
        <div className="flex items-center">
          <div className="p-1 bg-background rounded-lg shadow-sm">
            <Image
              src="/coin-logo.svg"
              alt="Coin Dash Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
          </div>
          <span className="ml-3 text-base sm:text-lg font-semibold text-primary">Coin Dash</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium ml-8">
          {renderNavLink("/currency", "Currency", <Coins className="h-4 w-4" />)}
          {renderNavLink("/weather", "Weather", <CloudSun className="h-4 w-4" />)}
          {renderNavLink("/news", "News", <Newspaper className="h-4 w-4" />)}
          {renderNavLink("/details", "Details", <Info className="h-4 w-4" />)}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Search Bar */}
          <div className="relative w-full max-w-[300px] hidden md:block">
            <Input
              type="search"
              placeholder="Search a coin..."
              className="pl-8"
              onClick={playSound}
            />
            <Search className="h-4 w-4 absolute left-2.5 top-3 text-muted-foreground" />
          </div>
          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={playSound}>
            <Search className="h-5 w-5" />
          </Button>
          {/* Sound Toggle */}
          <div className="w-auto">
            <Button
              variant="ghost"
              className="w-9 px-0"
              onClick={handleClick}
            >
              {isSoundEnabled ? (
                <Volume2 className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              ) : (
                <VolumeX className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              )}
              <span className="sr-only">Toggle sound</span>
            </Button>
          </div>
          <ModeToggle />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-b md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="container py-6 px-4">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0"
                onClick={() => {
                  playSound();
                  setIsMobileMenuOpen(false);
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            
            <nav className="flex flex-col space-y-6 mb-6">
              {/* User Profile Section */}
              <div className="flex items-center gap-3 px-2 pb-4 border-b">
                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                  <Coins className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="font-medium text-sm">Coin Dash</span>
                  <p className="text-xs text-muted-foreground">Cryptocurrency Dashboard</p>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="space-y-4 px-2">
                <p className="text-xs uppercase font-medium text-muted-foreground mb-2">Navigation</p>
                <div className="space-y-3">
                  {renderNavLink("/currency", "Currency", <Coins className="h-5 w-5" />)}
                  {renderNavLink("/weather", "Weather", <CloudSun className="h-5 w-5" />)}
                  {renderNavLink("/news", "News", <Newspaper className="h-5 w-5" />)}
                  {renderNavLink("/details", "Details", <Info className="h-5 w-5" />)}
                </div>
              </div>
              
              {/* Search Section */}
              <div className="pt-4 border-t px-2">
                <p className="text-xs uppercase font-medium text-muted-foreground mb-3">Search</p>
                <div className="relative w-full">
                  <Input
                    type="search"
                    placeholder="Search a coin..."
                    className="pl-9 py-5 rounded-xl"
                    onClick={playSound}
                  />
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 