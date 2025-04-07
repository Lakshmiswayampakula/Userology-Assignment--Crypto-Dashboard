"use client";

import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo and Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Coin Cash
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Currency
            </Link>
            <Link href="/weather" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Weather
            </Link>
            <Link href="/news" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              News
            </Link>
            <Link href="/details" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Details
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaTwitter className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 