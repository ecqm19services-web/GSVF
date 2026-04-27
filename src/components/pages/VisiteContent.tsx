import React, { useState } from 'react';
import Hero from '@/components/ui/Hero';
import { visiteContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import { useEditSession } from '@/contexts/EditSessionContext';
import EditableText from '@/components/admin/EditableText';
import EditableImage from '@/components/admin/EditableImage';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin,
  Camera,
  Play,
  Plus,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

type VisiteData = typeof visiteContent;

const VisiteContent: React.FC = () => {
  const { value: data } = usePageJsonContent<VisiteData>('visite', visiteContent);
  const ui = (data as any).ui || (visiteContent as any).ui;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  const getGalleryImages = (sectionIndex: number) => {
    const section = data.sections[sectionIndex] as any;
    return section?.galleryImages || section?.images || [];
  };

  const openLightbox = (sectionIndex: number, imageIndex: number) => {
    setCurrentSection(sectionIndex);
    setCurrentImage(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    const gallery = getGalleryImages(currentSection);
    if (!gallery.length) return;
    if (currentImage < gallery.length - 1) {
      setCurrentImage(prev => prev + 1);
    } else if (currentSection < data.sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setCurrentImage(0);
    }
  };

  const prevImage = () => {
    if (currentImage > 0) {
      setCurrentImage(prev => prev - 1);
    } else if (currentSection > 0) {
      const prevGallery = getGalleryImages(currentSection - 1);
      setCurrentSection(prev => prev - 1);
      setCurrentImage(prevGallery.length - 1);
    }
  };

  const { isEditing, updateAtPath } = useEditSession<VisiteData>() || {};

  const addImageToSection = (sectionIndex: number) => {
    if (!updateAtPath || !data) return;
    const section = data.sections[sectionIndex];
    const newImages = [...section.images, { src: '/placeholder.svg', caption: 'Nouvelle image' }];
    updateAtPath(`sections.${sectionIndex}.images`, newImages);
  };

  const removeImageFromSection = (sectionIndex: number, imageIndex: number) => {
    if (!updateAtPath || !data) return;
    if (!confirm('Supprimer cette image ?\n\nOK pour confirmer, Annuler pour annuler.')) return;
    const section = data.sections[sectionIndex];
    const newImages = section.images.filter((_, i) => i !== imageIndex);
    updateAtPath(`sections.${sectionIndex}.images`, newImages);
  };

  const addGalleryImageToSection = (sectionIndex: number) => {
    if (!updateAtPath || !data) return;
    const section = data.sections[sectionIndex] as any;
    const currentGallery = section.galleryImages || [...section.images];
    const newGallery = [...currentGallery, { src: '/placeholder.svg', caption: 'Nouvelle photo galerie' }];
    updateAtPath(`sections.${sectionIndex}.galleryImages`, newGallery);
  };

  const removeGalleryImageFromSection = (sectionIndex: number, imageIndex: number) => {
    if (!updateAtPath || !data) return;
    if (!confirm('Supprimer cette photo de la galerie ?\n\nOK pour confirmer, Annuler pour annuler.')) return;
    const section = data.sections[sectionIndex] as any;
    const currentGallery = section.galleryImages || [...section.images];
    const newGallery = currentGallery.filter((_: any, i: number) => i !== imageIndex);
    updateAtPath(`sections.${sectionIndex}.galleryImages`, newGallery);
  };

  return (
    <>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        description={data.hero.description}
        backgroundImage={(data.hero as any).backgroundImage || undefined}
        heroImagePath="hero.backgroundImage"
        size="medium"
      />

      {/* Navigation Pills */}
      <section className="py-4 sm:py-5 bg-white sticky top-10 z-10 border-b border-gray-100 shadow-sm -mt-10 sm:-mt-12 lg:-mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {data.sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gray-100 text-gray-700 text-sm sm:text-base font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                <EditableText as="span" path={`sections.${index}.title`} value={section.title} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Sections */}
      {data.sections.map((section, sectionIndex) => (
        <section 
          key={section.id}
          id={section.id}
          className={`py-20 ${sectionIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${
              sectionIndex % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}>
              {/* Content */}
              <div className={sectionIndex % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-800" />
                  </div>
                  <span className="text-blue-800 font-semibold">
                    <EditableText as="span" path="ui.zoneLabel" value={ui.zoneLabel} /> {sectionIndex + 1}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  <EditableText as="span" path={`sections.${sectionIndex}.title`} value={section.title} />
                </h2>
                <EditableText
                  as="p"
                  multiline
                  path={`sections.${sectionIndex}.description`}
                  value={section.description}
                  className="text-lg text-gray-600 leading-relaxed mb-8"
                />
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => openLightbox(sectionIndex, 0)}
                    className="inline-flex items-center gap-2 bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <EditableText as="span" path="ui.galleryButton" value={ui.galleryButton} />
                  </button>
                  {isEditing && (
                    <button
                      onClick={() => addImageToSection(sectionIndex)}
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      title="Ajouter une image à cette section"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Ajouter</span>
                    </button>
                  )}
                  <span className="text-gray-500">
                    <Camera className="w-5 h-5 inline mr-1" />
                    {((section as any).galleryImages || section.images).length} <EditableText as="span" path="ui.photosLabel" value={ui.photosLabel} />
                  </span>
                </div>
              </div>

              {/* Image Grid */}
              <div className={`grid grid-cols-2 gap-4 ${sectionIndex % 2 === 1 ? 'lg:order-1' : ''}`}>
                {section.images.map((image, imageIndex) => (
                  <div
                    key={imageIndex}
                    className={`relative rounded-xl overflow-hidden group ${
                      imageIndex === 0 ? 'col-span-2 aspect-video' : 'aspect-square'
                    }`}
                  >
                    <EditableImage
                      path={`sections.${sectionIndex}.images.${imageIndex}.src`}
                      src={image.src}
                      alt={image.caption}
                      folder={`visite`}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                    
                    {isEditing && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeImageFromSection(sectionIndex, imageIndex);
                        }}
                        className="absolute top-2 right-2 z-30 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                        title="Supprimer cette image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => openLightbox(sectionIndex, imageIndex)}
                      className="absolute inset-0 z-10"
                      style={{ pointerEvents: isEditing ? 'none' : 'auto' }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none">
                      <EditableText
                        as="p"
                        path={`sections.${sectionIndex}.images.${imageIndex}.caption`}
                        value={image.caption}
                        className="text-white text-sm font-medium"
                      />
                    </div>
                  </div>
                ))}

                {/* Admin: Gallery images management */}
                {isEditing && (
                  <div className="col-span-2 mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-blue-800">Images galerie ({getGalleryImages(sectionIndex).length} photos)</h4>
                      <button
                        onClick={() => addGalleryImageToSection(sectionIndex)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Ajouter à la galerie
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {getGalleryImages(sectionIndex).map((gImg: any, gIdx: number) => (
                        <div key={gIdx} className="relative group/gal rounded-lg overflow-hidden aspect-square">
                          <EditableImage
                            path={`sections.${sectionIndex}.galleryImages.${gIdx}.src`}
                            src={gImg.src}
                            alt={gImg.caption}
                            folder="visite"
                            className="w-full h-full"
                            imgClassName="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); removeGalleryImageFromSection(sectionIndex, gIdx); }}
                            className="absolute top-1 right-1 z-30 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover/gal:opacity-100 transition-opacity hover:bg-red-700"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 bg-black/50 z-20">
                            <EditableText
                              as="p"
                              path={`sections.${sectionIndex}.galleryImages.${gIdx}.caption`}
                              value={gImg.caption}
                              className="text-white text-[10px] truncate"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Virtual Tour CTA */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText
            as="h2"
            path="ui.cta.title"
            value={ui.cta.title}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          />
          <EditableText
            as="p"
            multiline
            path="ui.cta.description"
            value={ui.cta.description}
            className="text-xl text-blue-100 mb-10"
          />
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-blue-800 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            <EditableText as="span" path="ui.cta.button" value={ui.cta.button} />
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-5xl mx-auto px-4">
            <div className="aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
              {getGalleryImages(currentSection)?.[currentImage]?.src ? (
                <img
                  src={getGalleryImages(currentSection)[currentImage].src}
                  alt={getGalleryImages(currentSection)[currentImage].caption || ''}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                  <p className="text-blue-200 text-lg">
                    {getGalleryImages(currentSection)?.[currentImage]?.caption || ''}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <p className="text-white font-medium">
                <EditableText
                  as="span"
                  path={`sections.${currentSection}.title`}
                  value={data.sections[currentSection]?.title || ''}
                />
              </p>
              <p className="text-white/60 text-sm">
                <EditableText as="span" path="ui.lightbox.imageLabel" value={ui.lightbox.imageLabel} /> {currentImage + 1}{' '}
                <EditableText as="span" path="ui.lightbox.ofLabel" value={ui.lightbox.ofLabel} /> {getGalleryImages(currentSection)?.length || 0}
              </p>
            </div>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default VisiteContent;
