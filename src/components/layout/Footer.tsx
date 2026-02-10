import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig, navigation } from '@/data/content';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = navigation.slice(0, 4);
  const academicLinks = navigation.slice(4);

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo-vf.svg" alt="Collège Privé la Vision Future" className="w-16 h-16 rounded-xl object-contain" />
              <div>
                <h4 className="text-white font-bold">Collège Privé la Vision Future</h4>
                <p className="text-sm text-gray-400">L'excellence, Notre devise</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Depuis 2019, nous formons les leaders de demain dans un environnement d'excellence à Grand-Bassam.
            </p>
            <div className="flex gap-4">
              <a
                href={siteConfig.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Navigation</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Académique</h4>
            <ul className="space-y-3">
              {academicLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  Boulevard de la République<br />
                  Grand-Bassam, Côte d'Ivoire
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="text-gray-400 hover:text-orange-400 transition-colors">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="text-gray-400 hover:text-orange-400 transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  Lun - Ven: 7h30 - 17h00<br />
                  Sam: 8h00 - 12h00
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Collège Privé la Vision Future. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/mentions-legales" className="text-gray-500 hover:text-orange-400 transition-colors">
                Mentions légales
              </Link>
              <Link to="/confidentialite" className="text-gray-500 hover:text-orange-400 transition-colors">
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
