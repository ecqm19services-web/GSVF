import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import EditableText from '@/components/admin/EditableText';
import { useEditSession } from '@/contexts/EditSessionContext';

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
  backgroundImages?: string[];
  slideDuration?: number;
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
  backgroundImages,
  slideDuration = 5000,
  overlay = true,
  size = 'large',
  align = 'center'
}) => {
  const editSession = useEditSession<Record<string, unknown> | unknown[]>();
  const isEditing = !!editSession?.isEditing;

  // Slideshow state
  const images = backgroundImages && backgroundImages.length > 0 ? backgroundImages : backgroundImage ? [backgroundImage] : [];
  const hasSlideshow = images.length > 1;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!hasSlideshow) return;
    const timer = setInterval(nextSlide, slideDuration);
    return () => clearInterval(timer);
  }, [hasSlideshow, nextSlide, slideDuration]);

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
      className={`relative ${sizeClasses[size]} bg-gradient-to-br from-orange-950 via-orange-900 to-orange-950 overflow-hidden`}
    >
      {/* Background Slideshow (supports images + video) */}
      {images.length > 0 && (
        <div className="absolute inset-0">
          {images.map((src, i) => {
            const isVideo = /\.(mp4|webm|ogg)$/i.test(src);
            return (
              <div
                key={src}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{ opacity: i === currentIndex ? 1 : 0 }}
              >
                {isVideo ? (
                  <video
                    src={src}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                )}
              </div>
            );
          })}
          {/* Light overlay on top of images/video */}
          <div className="absolute inset-0 bg-white/20" />
        </div>
      )}

      {/* Background Pattern (only when no images) */}
      {images.length === 0 && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${alignClasses[align]} max-w-4xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {/* Text backdrop – asymmetric corners: more rounded top-left & bottom-right */}
          <div
            className={images.length > 0 ? 'bg-black/30 backdrop-blur-[2px] px-6 py-8 md:px-10 md:py-10 mb-8' : ''}
            style={images.length > 0 ? { borderRadius: '2rem 0.75rem 2rem 0.75rem' } : undefined}
          >
            {subtitle && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-orange-200 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                {isEditing ? (
                  <EditableText as="span" path="hero.subtitle" value={subtitle} />
                ) : (
                  subtitle
                )}
              </span>
            )}
            
            {isEditing ? (
              <EditableText
                as="h1"
                path="hero.title"
                value={title}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              />
            ) : (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {title}
              </h1>
            )}
            
            {description && (
              isEditing ? (
                <EditableText
                  as="p"
                  multiline
                  path="hero.description"
                  value={description}
                  className="text-lg md:text-xl text-orange-100 max-w-2xl leading-relaxed"
                />
              ) : (
                <p className="text-lg md:text-xl text-orange-100 max-w-2xl leading-relaxed">
                  {description}
                </p>
              )
            )}
          </div>
          
          {(ctaPrimary || ctaSecondary) && (
            <div className={`flex flex-col sm:flex-row gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
              {ctaPrimary && (
                <Link
                  to={ctaPrimary.link}
                  className="inline-flex items-center justify-center gap-2 bg-white text-orange-900 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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

      {/* Bottom Wave (gentle, regular arc) */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 sm:h-32 md:h-36 lg:h-40">
          <path
            d="M0 130 C 360 90 720 70 1080 90 C 1260 110 1350 120 1440 130 V 180 H 0 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
