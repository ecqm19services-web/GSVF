import React, { useState } from 'react';
import Hero from '@/components/ui/Hero';
import { visiteContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin,
  Camera,
  Play
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

  return (
    <>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        description={data.hero.description}
        size="medium"
      />

      {/* Navigation Pills */}
      <section className="py-8 bg-white sticky top-20 z-30 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {data.sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex-shrink-0 px-5 py-2.5 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors whitespace-nowrap"
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
                  <span className="text-gray-500">
                    <Camera className="w-5 h-5 inline mr-1" />
                    {((section as any).galleryImages || section.images).length} <EditableText as="span" path="ui.photosLabel" value={ui.photosLabel} />
                  </span>
                </div>
              </div>

              {/* Image Grid */}
              <div className={`grid grid-cols-2 gap-4 ${sectionIndex % 2 === 1 ? 'lg:order-1' : ''}`}>
                {section.images.slice(0, 4).map((image, imageIndex) => (
                  <button
                    key={imageIndex}
                    onClick={() => openLightbox(sectionIndex, imageIndex)}
                    className={`relative rounded-xl overflow-hidden group ${
                      imageIndex === 0 ? 'col-span-2 aspect-video' : 'aspect-square'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-blue-600" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                          <Camera className="w-6 h-6 text-gray-900" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <EditableText
                        as="p"
                        path={`sections.${sectionIndex}.images.${imageIndex}.caption`}
                        value={image.caption}
                        className="text-white text-sm font-medium"
                      />
                    </div>
                  </button>
                ))}
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
            <div className="aspect-video bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                <p className="text-blue-200 text-lg">
                  {getGalleryImages(currentSection)?.[currentImage]?.caption || ''}
                </p>
              </div>
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
