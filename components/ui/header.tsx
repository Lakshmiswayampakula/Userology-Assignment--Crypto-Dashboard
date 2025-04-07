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
      <span
        className="text-sm font-medium text-primary cursor-default flex items-center gap-2"
      >
        {icon}
        {label}
      </span>
    ) : (
      <Link
        href={linkPath}
        className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground flex items-center gap-2"
        onClick={() => {
          playSound();
          setIsMobileMenuOpen(false);
        }}
      >
        {icon}
        {label}
      </Link>
    );
  };

  const handleClick = () => {
    playSound();
    toggleSound();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
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
          <Image
            src="/coin-logo.svg"
            alt="Coin Dash Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="ml-2 text-base sm:text-lg font-semibold text-primary">Coin Dash</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-6">
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
        <div className="border-b md:hidden">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {renderNavLink("/currency", "Currency", <Coins className="h-4 w-4" />)}
              {renderNavLink("/weather", "Weather", <CloudSun className="h-4 w-4" />)}
              {renderNavLink("/news", "News", <Newspaper className="h-4 w-4" />)}
              {renderNavLink("/details", "Details", <Info className="h-4 w-4" />)}
            </nav>
            <div className="pt-2 border-t">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search a coin..."
                  className="pl-8"
                  onClick={playSound}
                />
                <Search className="h-4 w-4 absolute left-2.5 top-3 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 