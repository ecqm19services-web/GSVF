import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigation, siteConfig } from '@/data/content';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors">
                <Phone className="w-4 h-4" />
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors">
                <Mail className="w-4 h-4" />
                {siteConfig.email}
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-primary-foreground/80">{siteConfig.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg' 
            : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-200 transition-shadow">
                <span className="text-white font-bold text-lg">VF</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Vision Future</h1>
                <p className="text-xs text-orange-500 font-medium">Grand-Bassam</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-orange-100 text-orange-900'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/admissions"
                className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-orange-600 hover:to-orange-800 transition-all shadow-md hover:shadow-lg"
              >
                Inscription
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <div className="bg-white border-t border-gray-100 px-4 py-4">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-orange-100 text-orange-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/admissions"
                className="mt-4 bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-3 rounded-lg font-medium text-center"
              >
                Inscription
              </Link>
            </nav>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-3 text-gray-600 py-2">
                <Phone className="w-5 h-5 text-orange-600" />
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-gray-600 py-2">
                <Mail className="w-5 h-5 text-orange-600" />
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
