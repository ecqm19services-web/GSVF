import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ImagePlus, Loader2, RotateCcw, Palette, X, Settings2 } from 'lucide-react';
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
  backgroundColor?: string;
  slideDuration?: number;
  overlay?: boolean;
  size?: 'small' | 'medium' | 'large';
  align?: 'left' | 'center';
  heroImagePath?: string;
  heroColorPath?: string;
  defaultBackgroundImage?: string;
  defaultBackgroundColor?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
  backgroundImages,
  backgroundColor,
  slideDuration = 5000,
  overlay = true,
  size = 'large',
  align = 'center',
  heroImagePath,
  heroColorPath,
  defaultBackgroundImage,
  defaultBackgroundColor = 'bg-gradient-to-br from-orange-950 via-orange-900 to-orange-950'
}) => {
  const editSession = useEditSession<Record<string, unknown> | unknown[]>();
  const isEditing = !!editSession?.isEditing;
  const heroBgInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingHeroBg, setIsUploadingHeroBg] = useState(false);
  const [heroBgPreview, setHeroBgPreview] = useState<string | null>(null);
  const [showHeroSettings, setShowHeroSettings] = useState(false);
  const [heroMode, setHeroMode] = useState<'color' | 'image'>(backgroundImage ? 'image' : 'color');
  const [customColor, setCustomColor] = useState(backgroundColor || '');

  const handleHeroBgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editSession || !heroImagePath) return;
    const localUrl = URL.createObjectURL(file);
    setHeroBgPreview(localUrl);
    setIsUploadingHeroBg(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const creds = sessionStorage.getItem('cpvf_admin_auth');
      const headers: Record<string, string> = {};
      if (creds) headers['Authorization'] = `Basic ${creds}`;
      const res = await fetch(`/api/upload-image/?folder=heroes`, {
        method: 'POST', headers, body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error || 'Upload failed');
      }
      const data = await res.json();
      editSession.updateAtPath(heroImagePath, data.url);
      if (heroColorPath) editSession.updateAtPath(heroColorPath, '');
      setHeroBgPreview(null);
      setHeroMode('image');
    } catch (err) {
      console.error('[Hero] Upload error:', err);
      setHeroBgPreview(null);
      alert('Erreur lors de l\'upload: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
    } finally {
      setIsUploadingHeroBg(false);
      if (heroBgInputRef.current) heroBgInputRef.current.value = '';
    }
  };

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    if (editSession && heroColorPath) {
      editSession.updateAtPath(heroColorPath, color);
      if (heroImagePath) editSession.updateAtPath(heroImagePath, '');
    }
    setHeroMode('color');
  };

  const handleResetHero = () => {
    if (!editSession) return;
    if (defaultBackgroundImage && heroImagePath) {
      editSession.updateAtPath(heroImagePath, defaultBackgroundImage);
      if (heroColorPath) editSession.updateAtPath(heroColorPath, '');
      setHeroMode('image');
    } else if (defaultBackgroundColor && heroColorPath) {
      editSession.updateAtPath(heroColorPath, defaultBackgroundColor);
      if (heroImagePath) editSession.updateAtPath(heroImagePath, '');
      setHeroMode('color');
    }
    setCustomColor('');
    setHeroBgPreview(null);
    setShowHeroSettings(false);
  };

  const handleRemoveImage = () => {
    if (!editSession || !heroImagePath) return;
    editSession.updateAtPath(heroImagePath, '');
    setHeroBgPreview(null);
    setHeroMode('color');
  };

  // Slideshow state – include heroBgPreview when available
  const resolvedBgImage = heroBgPreview || backgroundImage;
  const resolvedBgColor = backgroundColor || customColor;
  const images = backgroundImages && backgroundImages.length > 0 ? backgroundImages : resolvedBgImage ? [resolvedBgImage] : [];
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

  useEffect(() => {
    setHeroMode(backgroundImage ? 'image' : 'color');
    setCustomColor(backgroundColor || '');
  }, [backgroundImage, backgroundColor]);

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
      className={`relative ${sizeClasses[size]} ${resolvedBgColor || defaultBackgroundColor} overflow-hidden`}
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

      {/* Admin: Hero settings panel */}
      {isEditing && (
        <>
          <button
            type="button"
            onClick={() => setShowHeroSettings(!showHeroSettings)}
            className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-orange-900 px-3 py-2 rounded-lg shadow-lg hover:bg-white transition-colors text-sm font-semibold"
          >
            <Settings2 className="w-4 h-4" />
            Fond Hero
          </button>

          {showHeroSettings && (
            <div className="absolute top-16 right-4 z-30 bg-white rounded-xl shadow-2xl p-4 w-72 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm">Configuration du fond</h3>
                <button onClick={() => setShowHeroSettings(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setHeroMode('color')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    heroMode === 'color' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Palette className="w-4 h-4" /> Couleur
                </button>
                <button
                  onClick={() => setHeroMode('image')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    heroMode === 'image' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ImagePlus className="w-4 h-4" /> Image
                </button>
              </div>

              {/* Color picker */}
              {heroMode === 'color' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      'bg-gradient-to-br from-orange-950 via-orange-900 to-orange-950',
                      'bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950',
                      'bg-gradient-to-br from-green-950 via-green-900 to-green-950',
                      'bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950',
                      'bg-gradient-to-br from-red-950 via-red-900 to-red-950',
                      'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
                      'bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900',
                      'bg-gradient-to-br from-teal-950 via-teal-900 to-teal-950',
                    ].map((color, i) => (
                      <button
                        key={i}
                        onClick={() => handleColorChange(color)}
                        className={`w-full aspect-square rounded-lg ${color} border-2 ${
                          resolvedBgColor === color ? 'border-orange-500' : 'border-transparent hover:border-gray-300'
                        } transition-colors`}
                        title={color}
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Ou tapez une classe Tailwind..."
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    onBlur={() => customColor && handleColorChange(customColor)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-orange-300 outline-none"
                  />
                </div>
              )}

              {/* Image upload */}
              {heroMode === 'image' && (
                <div className="space-y-3">
                  <input
                    ref={heroBgInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleHeroBgChange}
                  />
                  <button
                    type="button"
                    onClick={() => heroBgInputRef.current?.click()}
                    disabled={isUploadingHeroBg}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {isUploadingHeroBg ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Upload...</>
                    ) : (
                      <><ImagePlus className="w-4 h-4" /> Choisir une image</>
                    )}
                  </button>
                  {resolvedBgImage && (
                    <button
                      onClick={handleRemoveImage}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <X className="w-4 h-4" /> Supprimer l'image
                    </button>
                  )}
                </div>
              )}

              {/* Reset button */}
              {(defaultBackgroundImage || defaultBackgroundColor) && (
                <button
                  onClick={handleResetHero}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <RotateCcw className="w-4 h-4" /> Réinitialiser par défaut
                </button>
              )}
            </div>
          )}
        </>
      )}

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

      {/* Bottom Wave - true full width */}
<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen overflow-hidden">
  <svg
    viewBox="0 0 1600 220"
    preserveAspectRatio="none"
    className="w-screen h-32 md:h-40 lg:h-48"
  >
    <path
      d="M0 130 C 420 80 800 60 1180 80 C 1400 95 1500 115 1600 130 V 220 H 0 Z"
      fill="white"
    />
  </svg>
</div>

    </section>
  );
};

export default Hero;
