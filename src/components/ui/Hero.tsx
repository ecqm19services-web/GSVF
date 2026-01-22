import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaPrimary?: {
    text: string;
    link: string;
  };
  ctaSecondary?: {
    text: string;
    link: string;
  };
  backgroundImage?: string;
  overlay?: boolean;
  size?: 'small' | 'medium' | 'large';
  align?: 'left' | 'center';
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
  overlay = true,
  size = 'large',
  align = 'center'
}) => {
  const sizeClasses = {
    small: 'py-16 md:py-24',
    medium: 'py-24 md:py-32',
    large: 'py-32 md:py-48'
  };

  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center'
  };

  return (
    <section 
      className={`relative ${sizeClasses[size]} bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${alignClasses[align]} max-w-4xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle && (
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              {subtitle}
            </span>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          
          {description && (
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
          
          {(ctaPrimary || ctaSecondary) && (
            <div className={`flex flex-col sm:flex-row gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
              {ctaPrimary && (
                <Link
                  to={ctaPrimary.link}
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  {ctaPrimary.text}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              {ctaSecondary && (
                <Link
                  to={ctaSecondary.link}
                  className="inline-flex items-center justify-center gap-2 bg-orange-500/80 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-orange-600 transition-all"
                >
                  <Play className="w-5 h-5" />
                  {ctaSecondary.text}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
