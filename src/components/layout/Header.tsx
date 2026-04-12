import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigation, siteConfig } from '@/data/content';
import { Menu, X, Phone, Mail, ChevronDown } from 'lucide-react';

type NavItem = (typeof navigation)[number];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
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
    setMobileExpanded(null);
  }, [location]);

  const visibleNav = navigation.filter(
    (item) => item.path !== '/admissions' && item.path !== '/carrieres' && item.path !== '/visite'
  );

  const isActive = (item: NavItem) => {
    if (location.pathname === item.path) return true;
    if ('children' in item && (item as any).children) {
      return (item as any).children.some((c: any) => location.pathname === c.path);
    }
    return false;
  };

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
              <Link
                to="/carrieres"
                className="px-3 py-1.5 rounded-md bg-white text-orange-700 font-semibold hover:bg-orange-50 transition-colors"
              >
                Carrières
              </Link>
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
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group relative">
              <div className="relative -my-6 z-10">
                <img src="/logo-vf.svg" alt="Collège Privé la Vision Future" className="w-[4.5rem] h-[4.5rem] md:w-[5.5rem] md:h-[5.5rem] rounded-full object-contain bg-white shadow-lg ring-2 ring-white group-hover:shadow-orange-200 transition-shadow" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-[13px] lg:text-[15px] font-bold text-gray-900 leading-tight">Collège Privé la Vision Future</h1>
                <p className="text-xs text-orange-500 font-medium">L'excellence, Notre devise</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {visibleNav.map((item) => {
                const children = (item as any).children as { name: string; path: string }[] | undefined;

                if (children && children.length > 0) {
                  return (
                    <div key={item.path} className="relative group">
                      <Link
                        to={item.path}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center gap-1 ${
                          isActive(item)
                            ? 'bg-orange-100 text-orange-900'
                            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-800'
                        }`}
                      >
                        {item.name}
                        <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                      </Link>
                      <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                          {children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                                location.pathname === child.path
                                  ? 'bg-orange-50 text-orange-800'
                                  : 'text-gray-700 hover:bg-orange-50 hover:text-orange-800'
                              }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item)
                        ? 'bg-orange-100 text-orange-900'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/admissions"
                className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-orange-600 hover:to-orange-800 transition-all shadow-md hover:shadow-lg"
              >
                Admissions
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
              {visibleNav.map((item) => {
                const children = (item as any).children as { name: string; path: string }[] | undefined;
                const expanded = mobileExpanded === item.path;

                if (children && children.length > 0) {
                  return (
                    <div key={item.path}>
                      <button
                        onClick={() => setMobileExpanded(expanded ? null : item.path)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                          isActive(item) ? 'bg-orange-100 text-orange-900' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.name}
                        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                      </button>
                      {expanded && (
                        <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-orange-200 pl-3">
                          {children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                location.pathname === child.path
                                  ? 'bg-orange-100 text-orange-900'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive(item)
                        ? 'bg-orange-100 text-orange-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Link
                to="/admissions"
                className="mt-4 bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-3 rounded-lg font-medium text-center"
              >
                Admissions
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
