import { ChevronDown, Lock, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#0e1217] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-[#0e1217] border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="#FFC107"
                fillOpacity="0.2"
                stroke="#FFC107"
                strokeWidth="2"
              />
              <path
                d="M7 12L10 15L17 8"
                stroke="#FFC107"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2 font-bold text-lg">STORM</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`px-2 py-1 font-medium ${location.pathname === "/" ? "border-b-2 border-blue-500" : ""}`}
          >
            Trade
          </Link>
          <Link
            to="/earn"
            className={`px-2 py-1 font-medium ${location.pathname === "/earn" ? "border-b-2 border-blue-500" : ""}`}
          >
            Earn
          </Link>
          <Link
            to="/tournaments"
            className={`px-2 py-1 font-medium ${location.pathname === "/tournaments" ? "border-b-2 border-blue-500" : ""
              }`}
          >
            Tournaments
          </Link>
          <div className="flex items-center px-2 py-1 font-medium">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="#FFC107"
                fillOpacity="0.2"
                stroke="#FFC107"
                strokeWidth="2"
              />
            </svg>
            STORM
          </div>
          <a href="#" className="flex items-center px-2 py-1 font-medium">
            Academy
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1"
            >
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <div className="flex items-center px-2 py-1 font-medium">
            More
            <ChevronDown className="w-4 h-4 ml-1" />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 focus:outline-none"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Wallet Button - Hidden on mobile */}
        <button className="hidden md:flex bg-[#1e2329] hover:bg-[#2b3139] text-white px-4 py-2 rounded-md items-center">
          CONNECT WALLET
          <Lock className="w-4 h-4 ml-2" />
        </button>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0e1217] border-b border-gray-800 px-4 py-2">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className={`px-2 py-1 font-medium ${location.pathname === "/" ? "border-b-2 border-blue-500" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Trade
            </Link>
            <Link
              to="/earn"
              className={`px-2 py-1 font-medium ${location.pathname === "/earn" ? "border-b-2 border-blue-500" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Earn
            </Link>
            <Link
              to="/tournaments"
              className={`px-2 py-1 font-medium ${location.pathname === "/tournaments" ? "border-b-2 border-blue-500" : ""
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tournaments
            </Link>
            <div className="flex items-center px-2 py-1 font-medium">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  fill="#FFC107"
                  fillOpacity="0.2"
                  stroke="#FFC107"
                  strokeWidth="2"
                />
              </svg>
              STORM
            </div>
            <a href="#" className="flex items-center px-2 py-1 font-medium">
              Academy
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <div className="flex items-center px-2 py-1 font-medium">
              More
              <ChevronDown className="w-4 h-4 ml-1" />
            </div>
            <button className="bg-[#1e2329] hover:bg-[#2b3139] text-white px-4 py-2 rounded-md flex items-center justify-center">
              CONNECT WALLET
              <Lock className="w-4 h-4 ml-2" />
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}