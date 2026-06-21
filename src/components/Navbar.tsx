
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent background scrolling when menu is open
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-2 sm:py-3 md:py-4 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <a 
          href="#" 
          className="flex items-center space-x-2"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          aria-label="WestBridge"
        >
          <img
            src="/lovable-uploads/69105732-5144-4ab6-b58d-0c80ccc18c07.png"
            alt="WestBridge Logo"
            className="h-14 sm:h-16"
          />
          <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-gray-900">WestBridge</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a
            href="#"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
          >
            Home
          </a>
          <a href="#why" className="nav-link">Why Olympiads</a>
          <a href="#path" className="nav-link">Path</a>
          <a href="#tutors" className="nav-link">Tutors</a>
          <a href="#newsletter" className="nav-link">Test</a>
          <a href="#newsletter" className="nav-link">Join</a>
        </nav>

        {/* Mobile menu button - increased touch target */}
        <button 
          className="md:hidden text-gray-700 p-3 focus:outline-none" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation - improved for better touch experience */}
      <div className={cn(
        "fixed inset-0 z-40 bg-white flex flex-col md:hidden transition-all duration-300 ease-in-out",
        isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      )}>
        {/* Close button in mobile menu */}
        <div className="flex justify-end p-4">
          <button 
            onClick={toggleMenu}
            className="text-gray-700 p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex flex-col space-y-6 items-center mt-4 px-6">
          <a 
            href="#" 
            className="text-xl font-medium py-4 px-6 w-full text-center rounded-lg hover:bg-gray-100 transition-colors" 
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Home
          </a>
          <a href="#why" className="text-xl font-medium py-4 px-6 w-full text-center rounded-lg hover:bg-gray-100 transition-colors" onClick={() => { setIsMenuOpen(false); document.body.style.overflow = ''; }}>Why Olympiads</a>
          <a href="#path" className="text-xl font-medium py-4 px-6 w-full text-center rounded-lg hover:bg-gray-100 transition-colors" onClick={() => { setIsMenuOpen(false); document.body.style.overflow = ''; }}>Path</a>
          <a href="#tutors" className="text-xl font-medium py-4 px-6 w-full text-center rounded-lg hover:bg-gray-100 transition-colors" onClick={() => { setIsMenuOpen(false); document.body.style.overflow = ''; }}>Tutors</a>
          <a href="#newsletter" className="text-xl font-medium py-4 px-6 w-full text-center rounded-lg hover:bg-gray-100 transition-colors" onClick={() => { setIsMenuOpen(false); document.body.style.overflow = ''; }}>Test</a>
          <a href="#newsletter" className="text-xl font-medium py-4 px-6 w-full text-center rounded-lg hover:bg-pulse-500 hover:text-white bg-pulse-50 text-pulse-600 transition-colors font-semibold" onClick={() => { setIsMenuOpen(false); document.body.style.overflow = ''; }}>Join the Test</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
