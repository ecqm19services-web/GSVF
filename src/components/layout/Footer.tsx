import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig, navigation, footerContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import { useEditSession } from '@/contexts/EditSessionContext';
import EditableText from '@/components/admin/EditableText';
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

type FooterData = typeof footerContent;

const Footer: React.FC = () => {
  const { value: footerData } = usePageJsonContent<FooterData>('pied-de-page', footerContent);
  const editSession = useEditSession<FooterData>();
  const isEditingFooter = editSession?.isEditing && editSession?.page === 'pied-de-page';
  const isEditing = !!isEditingFooter;

  const currentYear = new Date().getFullYear();
  const copyrightText = (footerData.copyright || footerContent.copyright).replace('{year}', String(currentYear));

  const quickLinks = navigation.slice(0, 4);
  const academicLinks = navigation.slice(4);

  const socialLinks = footerData.socialLinks || footerContent.socialLinks;

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
                <h4 className="text-white font-bold">
                  <EditableText as="span" path="about.title" value={footerData.about.title} />
                </h4>
                <p className="text-sm text-gray-400">
                  <EditableText as="span" path="about.tagline" value={footerData.about.tagline} />
                </p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              <EditableText as="span" multiline path="about.description" value={footerData.about.description} />
            </p>
            <div className="flex gap-4">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            {/* Admin: edit social links */}
            {isEditing && (
              <div className="mt-4 space-y-2 bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 font-semibold mb-2">Liens réseaux sociaux</p>
                {Object.entries(socialLinks).map(([key, url]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-20 capitalize">{key}</span>
                    <EditableText
                      as="span"
                      path={`socialLinks.${key}`}
                      value={url}
                      className="text-xs text-gray-300 flex-1"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">
              <EditableText as="span" path="navigationTitle" value={footerData.navigationTitle} />
            </h4>
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
            <h4 className="text-white font-semibold text-lg mb-6">
              <EditableText as="span" path="academiqueTitle" value={footerData.academiqueTitle} />
            </h4>
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
            <h4 className="text-white font-semibold text-lg mb-6">
              <EditableText as="span" path="contactTitle" value={footerData.contactTitle} />
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  <EditableText as="span" multiline path="address" value={footerData.address} />
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href={`tel:${footerData.phone}`} className="text-gray-400 hover:text-orange-400 transition-colors">
                  <EditableText as="span" path="phone" value={footerData.phone} />
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href={`mailto:${footerData.email}`} className="text-gray-400 hover:text-orange-400 transition-colors">
                  <EditableText as="span" path="email" value={footerData.email} />
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  <EditableText as="span" multiline path="hours" value={footerData.hours} />
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
              <EditableText as="span" path="copyright" value={copyrightText} />
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/suivi" className="text-gray-500 hover:text-orange-400 transition-colors">
                Suivre ma demande
              </Link>
              <Link to="/mentions-legales" className="text-gray-500 hover:text-orange-400 transition-colors">
                Mentions légales
              </Link>
              <Link to="/confidentialite" className="text-gray-500 hover:text-orange-400 transition-colors">
                Confidentialité
              </Link>
              <span className="text-gray-600 text-xs">
                by <span className="font-semibold text-gray-400">ic_future</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
