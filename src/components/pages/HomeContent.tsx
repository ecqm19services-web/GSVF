import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '@/components/ui/SectionTitle';
import { homeContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import { useEditSession } from '@/contexts/EditSessionContext';
import EditableText from '@/components/admin/EditableText';
import EditableImage from '@/components/admin/EditableImage';
import {
  GraduationCap, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Award,
  Trophy,
  Medal,
  User,
  Play,
  X,
  ArrowUpRight,
  Plus,
  Trash2,
  ImagePlus,
  Loader2,
  Images
} from 'lucide-react';

type HomeData = typeof homeContent;
type HomeSections = HomeData['sections'];
type HomeHero = HomeData['hero'];
type HonorRollLevel = HomeSections['excellenceShowcase']['honorRoll']['levels'][number];
type ExamCard = HomeSections['excellenceShowcase']['examCards'][number];
type PracticalInfo = HomeSections['practicalInfo'];
type PracticalTextItem = PracticalInfo['leftColumn']['trimesters'][number];
type PracticalLinkItem = PracticalInfo['rightColumn']['firstCycleLinks'][number];

const HomeContent: React.FC = () => {
  const { value: homeData } = usePageJsonContent<HomeData>('accueil', homeContent);
  const editSession = useEditSession<HomeData>();
  const resolvedHome = homeData || homeContent;
  const sections: HomeSections = resolvedHome.sections;
  const hero: HomeHero = resolvedHome.hero;
  const heroImages = hero.slideshowImages?.length ? hero.slideshowImages : homeContent.hero.slideshowImages;
  const [slideIndex, setSlideIndex] = useState(0);
  const nextSlide = useCallback(() => {
    setSlideIndex((prev) => (prev + 1) % heroImages.length);
  }, [heroImages.length]);
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const examResults = sections.examResults?.cards || homeContent.sections.examResults.cards;
  const examIcons = [Trophy, Award, Medal];
  const examColors = [
    'from-amber-500 to-orange-500',
    'from-blue-600 to-teal-500',
    'from-blue-500 to-indigo-500'
  ];
  const excellenceShowcase = sections.excellenceShowcase || homeContent.sections.excellenceShowcase;
  const practicalInfo = sections.practicalInfo || homeContent.sections.practicalInfo;

  // Activity gallery slider — items arranged as columns of 2 (rows), sliding by 2 columns
  const galleryItems: { src: string; caption: string }[] = sections.activityGallery?.items || homeContent.sections.activityGallery.items;
  const [galleryPage, setGalleryPage] = useState(0);
  // Build columns: each column holds 2 items (top + bottom row)
  const galleryColumns: { src: string; caption: string }[][] = [];
  for (let i = 0; i < galleryItems.length; i += 2) {
    galleryColumns.push(galleryItems.slice(i, i + 2));
  }
  const totalCols = galleryColumns.length;
  const visibleCols = 4;
  const slideCols = 2;
  const galleryMaxPage = Math.max(0, Math.ceil(Math.max(0, totalCols - visibleCols) / slideCols));
  const galleryContent = sections.activityGallery || homeContent.sections.activityGallery;

  // Actualités data
  const actu = sections.actualites || homeContent.sections.actualites;
  const actuItems: { title: string; body: string; linkText: string; linkUrl: string }[] =
    actu.items || homeContent.sections.actualites.items;
  const newsTickerText = actu.newsTicker?.text || homeContent.sections.actualites.newsTicker.text;
  const belowImageMode = (actu.belowImage?.mode as 'text' | 'image' | undefined) || 'text';

  // Video modal state
  const [showVideo, setShowVideo] = useState(false);
  const founderVideoUrl = sections.motFondateur?.videoUrl || homeContent.sections.motFondateur.videoUrl;

  // Slider manager state
  const [sliderManagerOpen, setSliderManagerOpen] = useState(false);
  const [isUploadingSlides, setIsUploadingSlides] = useState(false);
  const sliderInputRef = useRef<HTMLInputElement>(null);

  const handleSliderMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editSession) return;
    setIsUploadingSlides(true);
    const currentImages = [...heroImages];
    const creds = sessionStorage.getItem('cpvf_admin_auth');
    const headers: Record<string, string> = {};
    if (creds) headers['Authorization'] = `Basic ${creds}`;

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch('/api/upload-image/?folder=accueil', {
          method: 'POST', headers, body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) currentImages.push(data.url);
        }
      } catch { /* skip failed */ }
    }
    editSession.updateAtPath('hero.slideshowImages', currentImages);
    setIsUploadingSlides(false);
    if (sliderInputRef.current) sliderInputRef.current.value = '';
  };

  const removeSlide = (index: number) => {
    if (!editSession) return;
    const newImages = heroImages.filter((_, i) => i !== index);
    editSession.updateAtPath('hero.slideshowImages', newImages);
    if (slideIndex >= newImages.length) setSlideIndex(Math.max(0, newImages.length - 1));
  };

  // Honor roll levels
  const addHonorRollLevel = () => {
    if (!editSession) return;
    const current = excellenceShowcase.honorRoll?.levels || [];
    editSession.updateAtPath('sections.excellenceShowcase.honorRoll.levels', [...current, { label: '', linkUrl: '' }]);
  };
  const removeHonorRollLevel = (i: number) => {
    if (!editSession) return;
    const current = excellenceShowcase.honorRoll?.levels || [];
    editSession.updateAtPath('sections.excellenceShowcase.honorRoll.levels', current.filter((_, idx) => idx !== i));
  };

  // Exam cards
  const addExamCard = () => {
    if (!editSession) return;
    const current = excellenceShowcase.examCards || [];
    editSession.updateAtPath('sections.excellenceShowcase.examCards', [...current, { image: '/placeholder.svg', title: '', subtitle: '', linkUrl: '' }]);
  };
  const removeExamCard = (i: number) => {
    if (!editSession) return;
    const current = excellenceShowcase.examCards || [];
    editSession.updateAtPath('sections.excellenceShowcase.examCards', current.filter((_, idx) => idx !== i));
  };

  // Parents box extra links
  const parentsBoxLinks: { text: string; url: string }[] = practicalInfo.rightColumn.parentsBoxExtraLinks || [];

  // Reusable document upload handler
  const handleDocumentUpload = async (file: File, updatePath: string) => {
    if (!editSession) return;
    const formData = new FormData();
    formData.append('image', file);
    const creds = sessionStorage.getItem('cpvf_admin_auth');
    const headers: Record<string, string> = {};
    if (creds) headers['Authorization'] = `Basic ${creds}`;

    try {
      const res = await fetch('/api/upload-image/?folder=documents', {
        method: 'POST',
        headers,
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) editSession.updateAtPath(updatePath, data.url);
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const addParentsBoxLink = () => {
    if (!editSession) return;
    editSession.updateAtPath('sections.practicalInfo.rightColumn.parentsBoxExtraLinks', [...parentsBoxLinks, { text: 'Nouveau lien', url: '' }]);
  };
  const removeParentsBoxLink = (i: number) => {
    if (!editSession) return;
    editSession.updateAtPath('sections.practicalInfo.rightColumn.parentsBoxExtraLinks', parentsBoxLinks.filter((_, idx) => idx !== i));
  };

  const addPracticalTextItem = (path: 'sections.practicalInfo.leftColumn.trimesters' | 'sections.practicalInfo.leftColumn.breaks') => {
    if (!editSession) return;
    const currentItems = path === 'sections.practicalInfo.leftColumn.trimesters'
      ? practicalInfo.leftColumn.trimesters
      : practicalInfo.leftColumn.breaks;
    const nextItems: PracticalTextItem[] = [...currentItems, { title: '', body: '' }];
    editSession.updateAtPath(path, nextItems);
  };

  const removePracticalTextItem = (
    path: 'sections.practicalInfo.leftColumn.trimesters' | 'sections.practicalInfo.leftColumn.breaks',
    indexToRemove: number
  ) => {
    if (!editSession) return;
    const currentItems = path === 'sections.practicalInfo.leftColumn.trimesters'
      ? practicalInfo.leftColumn.trimesters
      : practicalInfo.leftColumn.breaks;
    const nextItems = currentItems.filter((_, index) => index !== indexToRemove);
    editSession.updateAtPath(path, nextItems);
  };

  const addPracticalLinkItem = (
    path: 'sections.practicalInfo.rightColumn.firstCycleLinks' | 'sections.practicalInfo.rightColumn.secondCycleLinks'
  ) => {
    if (!editSession) return;
    const currentItems = path === 'sections.practicalInfo.rightColumn.firstCycleLinks'
      ? practicalInfo.rightColumn.firstCycleLinks
      : practicalInfo.rightColumn.secondCycleLinks;
    const nextItems: PracticalLinkItem[] = [...currentItems, { label: '', linkUrl: '' }];
    editSession.updateAtPath(path, nextItems);
  };

  const removePracticalLinkItem = (
    path: 'sections.practicalInfo.rightColumn.firstCycleLinks' | 'sections.practicalInfo.rightColumn.secondCycleLinks',
    indexToRemove: number
  ) => {
    if (!editSession) return;
    const currentItems = path === 'sections.practicalInfo.rightColumn.firstCycleLinks'
      ? practicalInfo.rightColumn.firstCycleLinks
      : practicalInfo.rightColumn.secondCycleLinks;
    const nextItems = currentItems.filter((_, index) => index !== indexToRemove);
    editSession.updateAtPath(path, nextItems);
  };

  return (
    <>
      {/* Hero Slideshow – images only, no text overlay */}
      <section className="relative h-[60vh] md:h-[70vh] lg:h-[75vh] overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((src, i) => (
            <div
              key={src + i}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: i === slideIndex ? 1 : 0 }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
            </div>
          ))}
        </div>

        {/* Admin: floating slider manager button */}
        {editSession?.isEditing && (
          <button
            onClick={() => setSliderManagerOpen((v) => !v)}
            className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-orange-800 px-4 py-2.5 rounded-xl shadow-lg hover:bg-white transition-colors text-sm font-bold"
          >
            <Images className="w-5 h-5" />
            Gérer le slider ({heroImages.length} images)
          </button>
        )}

        {/* Slide indicators */}
        <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === slideIndex ? 'bg-white scale-110' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        {/* "Nous formons les élites de demain" banner – overlapping the hero image */}
        <div className="absolute bottom-0 inset-x-0 z-10">
          <div className="bg-white/80 backdrop-blur-sm py-5 md:py-7">
            <div className="max-w-5xl mx-auto px-4 text-center">
              <EditableText
                as="p"
                path="hero.bannerText"
                value={hero.bannerText || ''}
                className="text-3xl md:text-4xl lg:text-5xl italic text-blue-900/80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Admin: Slider manager panel */}
      {editSession?.isEditing && sliderManagerOpen && (
        <section className="bg-gray-900 border-b-4 border-orange-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Images className="w-5 h-5 text-orange-400" />
                Gestion du slider — {heroImages.length} image{heroImages.length > 1 ? 's' : ''}
              </h3>
              <div className="flex items-center gap-3">
                <input
                  ref={sliderInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleSliderMultiUpload}
                />
                <button
                  onClick={() => sliderInputRef.current?.click()}
                  disabled={isUploadingSlides}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {isUploadingSlides ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Upload en cours...</>
                  ) : (
                    <><ImagePlus className="w-4 h-4" /> Ajouter des images</>
                  )}
                </button>
                <button
                  onClick={() => setSliderManagerOpen(false)}
                  className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {heroImages.map((src, i) => (
                <div
                  key={src + i}
                  className={`relative group rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    i === slideIndex ? 'border-orange-500 ring-2 ring-orange-500/50' : 'border-gray-700 hover:border-gray-500'
                  }`}
                  onClick={() => setSlideIndex(i)}
                >
                  <div className="aspect-video">
                    <img src={src} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {i + 1}
                  </span>
                  {heroImages.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeSlide(i); }}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      title="Supprimer cette image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {/* Add placeholder */}
              <button
                onClick={() => sliderInputRef.current?.click()}
                className="aspect-video rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-500 hover:border-orange-500 hover:text-orange-400 transition-colors"
              >
                <Plus className="w-6 h-6" />
                <span className="text-[10px] font-semibold mt-1">Ajouter</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Exam Results Blocks */}
      <section className="pt-2 pb-10 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {examResults.map((exam, index) => {
              const Icon = examIcons[index % examIcons.length];
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${examColors[index]} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${examColors[index]} flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <EditableText
                    as="h3"
                    path={`sections.examResults.cards.${index}.name`}
                    value={exam.name}
                    className="text-xl font-bold text-gray-900 mb-2"
                  />
                  <EditableText
                    as="div"
                    path={`sections.examResults.cards.${index}.rate`}
                    value={exam.rate}
                    className="text-5xl font-bold text-blue-800 mb-2"
                  />
                  <EditableText
                    as="p"
                    path={`sections.examResults.cards.${index}.mentions`}
                    value={exam.mentions}
                    className="text-gray-600 mb-2"
                  />
                  <EditableText
                    as="p"
                    path={`sections.examResults.cards.${index}.rank`}
                    value={exam.rank}
                    className="text-sm text-blue-800 font-medium"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Banner Bienvenue – image seule */}
      <section>
        <EditableImage
          path="sections.bannerImage.src"
          src={sections.bannerImage?.src}
          alt="Bienvenue sur notre site"
          className="w-full"
          imgClassName="w-full h-auto object-contain"
          folder="accueil"
        />
      </section>

      {/* Mot du Fondateur */}
      <section className="pt-4 md:pt-6 pb-8 md:pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-t-2xl py-5 px-6 md:px-10">
            <EditableText
              as="h2"
              path="sections.motFondateur.title"
              value={sections.motFondateur?.title || 'Mot du Fondateur'}
              className="text-2xl md:text-3xl font-bold text-white text-center"
            />
          </div>
          <div className="bg-white border border-gray-200 border-t-0 rounded-b-2xl shadow-lg">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 p-6 md:p-8 flex items-center justify-center">
                <div className="relative w-64 h-80 md:w-full md:h-96 group">
                  <EditableImage
                    path="sections.motFondateur.photo"
                    src={sections.motFondateur?.photo}
                    alt="Photo du fondateur"
                    className="w-full h-full rounded-2xl overflow-hidden shadow-md"
                    imgClassName="w-full h-full object-cover object-[center_22%]"
                    folder="accueil"
                  />
                  <button
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/[0.025] hover:bg-black/5 transition-colors rounded-2xl cursor-pointer"
                    aria-label="Lire la vidéo du fondateur"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/35 hover:bg-white/45 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                      <Play className="w-8 h-8 md:w-10 md:h-10 text-blue-800/45 ml-1" fill="currentColor" />
                    </div>
                  </button>
                </div>
              </div>
              <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-center">
                <EditableText
                  as="p"
                  multiline
                  path="sections.motFondateur.message"
                  value={sections.motFondateur?.message || ''}
                  className="text-base md:text-lg text-gray-700 leading-relaxed italic mb-8"
                />
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <EditableText
                      as="p"
                      path="sections.motFondateur.name"
                      value={sections.motFondateur?.name || 'M. DÉGBOUÉ YAO EULOGE'}
                      className="text-lg font-bold text-gray-900"
                    />
                    <EditableText
                      as="p"
                      path="sections.motFondateur.role"
                      value={sections.motFondateur?.role || 'Fondateur & Directeur Général'}
                      className="text-blue-800 font-medium text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Gallery */}
      <section className="py-8 md:py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.82fr_1.38fr] gap-8 lg:gap-10 items-stretch">
            <div className="bg-emerald-600 text-white rounded-2xl p-6 md:p-8 shadow-lg flex flex-col justify-between min-h-[520px]">
              <div>
                <EditableText
                  as="p"
                  path="sections.activityGallery.subtitle"
                  value={galleryContent.subtitle || 'Moments forts'}
                  className="text-sm md:text-base uppercase tracking-[0.2em] font-semibold text-emerald-100 mb-4"
                />
                <EditableText
                  as="h2"
                  multiline
                  path="sections.activityGallery.title"
                  value={galleryContent.title || 'Vie scolaire & médias'}
                  className="text-3xl md:text-4xl font-bold leading-tight mb-6"
                />
                <EditableText
                  as="p"
                  multiline
                  path="sections.activityGallery.description"
                  value={galleryContent.description || ''}
                  className="text-base md:text-lg leading-relaxed text-emerald-50 mb-8"
                />
              </div>
              <div className="border-t border-white/25 pt-6">
                <EditableText
                  as="p"
                  multiline
                  path="sections.activityGallery.highlight"
                  value={galleryContent.highlight || ''}
                  className="text-lg md:text-xl font-semibold leading-relaxed text-white"
                />
              </div>
            </div>

            <div className="relative bg-white rounded-2xl p-4 md:p-5 shadow-lg overflow-hidden min-h-[520px]">
              <button
                onClick={() => setGalleryPage((p) => Math.max(0, p - 1))}
                disabled={galleryPage === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/95 shadow-lg rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={() => setGalleryPage((p) => Math.min(galleryMaxPage, p + 1))}
                disabled={galleryPage >= galleryMaxPage}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/95 shadow-lg rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>

              <div className="overflow-hidden h-full">
                <div
                  className="flex transition-transform duration-500 ease-in-out h-full"
                  style={{ transform: `translateX(-${galleryPage * (100 / totalCols * slideCols)}%)` }}
                >
                  {galleryColumns.map((col, colIdx) => (
                    <div
                      key={colIdx}
                      className="flex-shrink-0 px-1.5 flex flex-col gap-3"
                      style={{ width: `${100 / visibleCols}%` }}
                    >
                      {col.map((item, rowIdx) => {
                        const itemIndex = colIdx * 2 + rowIdx;
                        return (
                          <div key={rowIdx} className="rounded-xl overflow-hidden bg-gray-100 h-[240px] md:h-[248px] relative group">
                            <EditableImage
                              path={`sections.activityGallery.items.${itemIndex}.src`}
                              src={item.src}
                              alt={item.caption}
                              className="w-full h-full"
                              imgClassName="w-full h-full object-cover"
                              folder="galerie"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                              <EditableText
                                as="p"
                                path={`sections.activityGallery.items.${itemIndex}.caption`}
                                value={item.caption}
                                className="text-sm font-medium text-white"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-5">
                {Array.from({ length: galleryMaxPage + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryPage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === galleryPage ? 'bg-emerald-600 scale-110' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actualités Section - right column 2x taller, horizontal ticker at top */}
      <section className="pt-8 md:pt-10 pb-12 md:pb-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Horizontal news ticker at top */}
          <div className="mb-6 overflow-hidden bg-blue-50 rounded-lg border border-blue-100">
            <div className="actu-ticker-horizontal whitespace-nowrap py-3">
              <EditableText
                as="span"
                path="sections.actualites.newsTicker.text"
                value={newsTickerText}
                className="text-sm md:text-base text-blue-800 font-medium inline-block px-4 pr-12"
              />
              <span aria-hidden="true" className="text-sm md:text-base text-blue-800 font-medium inline-block px-4 pr-12">
                {newsTickerText}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
            {/* Left column – 45% : square image + optional zone below */}
            <div className="w-full md:w-[45%] flex-shrink-0">
              <EditableImage
                path="sections.actualites.image.src"
                src={actu.image?.src}
                alt="Actualité"
                className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg"
                imgClassName="w-full h-full object-cover"
                folder="actualites"
              />
              <div className="mt-4">
                {belowImageMode === 'image' ? (
                  <EditableImage
                    path="sections.actualites.belowImage.imageSrc"
                    src={actu.belowImage?.imageSrc}
                    alt=""
                    className="w-full aspect-video rounded-xl overflow-hidden"
                    imgClassName="w-full h-full object-cover"
                    folder="actualites"
                  />
                ) : (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <EditableText
                      as="p"
                      multiline
                      path="sections.actualites.belowImage.text"
                      value={actu.belowImage?.text || ''}
                      className="text-gray-700 text-sm leading-relaxed"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right column – 55% : 2x taller than left image */}
            <div className="flex-1 w-full">
              <EditableText
                as="h2"
                path="sections.actualites.title"
                value={actu.title || 'Notre Actualité'}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-6"
              />

              <div className="space-y-4 md:min-h-[600px]">
                {actuItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                  >
                    <EditableText
                      as="h3"
                      path={`sections.actualites.items.${index}.title`}
                      value={item.title}
                      className="text-lg font-bold text-blue-900 mb-2"
                    />
                    <EditableText
                      as="p"
                      multiline
                      path={`sections.actualites.items.${index}.body`}
                      value={item.body}
                      className="text-gray-700 text-sm leading-relaxed mb-3"
                    />
                    {editSession?.isEditing ? (
                      <div className="mt-2 bg-blue-50 rounded-lg p-3 border border-blue-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-blue-800 shrink-0">Texte du lien :</label>
                          <EditableText
                            as="span"
                            path={`sections.actualites.items.${index}.linkText`}
                            value={item.linkText}
                            className="text-sm text-blue-900 bg-white rounded px-2 py-1 border border-blue-200 flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-blue-800 shrink-0">🔗 URL :</label>
                          <EditableText
                            as="span"
                            path={`sections.actualites.items.${index}.linkUrl`}
                            value={item.linkUrl}
                            className="text-sm text-blue-900 bg-white rounded px-2 py-1 border border-blue-200 flex-1 break-all"
                          />
                          <label className="cursor-pointer p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" title="Uploader un PDF">
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocumentUpload(f, `sections.actualites.items.${index}.linkUrl`); }}
                            />
                            <span className="text-xs font-bold">📄</span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      item.linkText && item.linkUrl && (
                        <a
                          href={item.linkUrl}
                          target={item.linkUrl.endsWith('.pdf') ? '_blank' : undefined}
                          rel={item.linkUrl.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                          {item.linkText}
                        </a>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={sections.features.subtitle}
            title={sections.features.title}
            description={sections.features.description}
            subtitlePath="sections.features.subtitle"
            titlePath="sections.features.title"
            descriptionPath="sections.features.description"
          />

          <div className="rounded-[28px] overflow-hidden bg-gradient-to-r from-[#d87421] via-[#e07c29] to-[#d87421] shadow-xl p-4 md:p-6 text-white mb-10">
            <EditableText
              as="p"
              path="sections.excellenceShowcase.trimesterLabel"
              value={excellenceShowcase.trimesterLabel || ''}
              className="text-center text-sm md:text-xl font-extrabold uppercase tracking-wide mb-4 md:mb-6"
            />

            <div className="grid lg:grid-cols-[1.45fr_0.8fr] gap-4 md:gap-6 items-stretch">
              <div className="rounded-[22px] overflow-hidden border-4 border-white/25 shadow-2xl bg-white/10 backdrop-blur-sm min-h-[260px] md:min-h-[360px]">
                <EditableImage
                  path="sections.excellenceShowcase.honorRoll.image"
                  src={excellenceShowcase.honorRoll?.image}
                  alt="Tableau d'honneur"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                  folder="accueil"
                />
              </div>

              <div className="rounded-[22px] bg-white/10 backdrop-blur-sm border border-white/15 px-5 py-6 md:px-8 md:py-8 flex flex-col justify-center">
                <div className="mx-auto mb-4 w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/15 flex items-center justify-center border border-white/25">
                  <Award className="w-10 h-10 md:w-12 md:h-12 text-emerald-200" />
                </div>

                <EditableText
                  as="h3"
                  path="sections.excellenceShowcase.honorRoll.title"
                  value={excellenceShowcase.honorRoll?.title || "Tableau d'honneur"}
                  className="text-center text-2xl md:text-3xl font-black uppercase text-[#153f91] mb-2"
                />
                <EditableText
                  as="p"
                  path="sections.excellenceShowcase.honorRoll.subtitle"
                  value={excellenceShowcase.honorRoll?.subtitle || ''}
                  className="text-center text-sm md:text-base font-semibold text-white/95 mb-4"
                />
                <EditableText
                  as="p"
                  path="sections.excellenceShowcase.honorRoll.levelsTitle"
                  value={excellenceShowcase.honorRoll?.levelsTitle || 'Par niveau'}
                  className="text-center text-lg md:text-xl font-bold underline underline-offset-4 mb-4"
                />

                {editSession?.isEditing && (
                  <button
                    onClick={addHonorRollLevel}
                    className="mx-auto mb-3 inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Ajouter un niveau
                  </button>
                )}

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 max-w-sm mx-auto w-full">
                  {(excellenceShowcase.honorRoll?.levels || []).map((level: HonorRollLevel, index: number) => {
                    const hasLink = !!level.linkUrl;
                    const levelContent = (
                      <>
                        <EditableText
                          as="span"
                          path={`sections.excellenceShowcase.honorRoll.levels.${index}.label`}
                          value={level.label || ''}
                          className="font-bold text-white text-base md:text-lg underline underline-offset-4"
                        />
                        {hasLink && <ArrowUpRight className="w-4 h-4 text-white" />}
                      </>
                    );

                    return (
                      <div key={index} className="relative">
                        {editSession?.isEditing && (
                          <button
                            onClick={() => removeHonorRollLevel(index)}
                            className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 z-10"
                            title="Supprimer ce niveau"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        {hasLink && !editSession?.isEditing ? (
                          <a
                            href={level.linkUrl}
                            target={level.linkUrl.endsWith('.pdf') ? '_blank' : undefined}
                            rel={level.linkUrl.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                            className="inline-flex items-center gap-2 hover:text-orange-100 transition-colors"
                          >
                            {levelContent}
                          </a>
                        ) : (
                          <div className="inline-flex items-center gap-2">
                            {levelContent}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {editSession?.isEditing && (excellenceShowcase.honorRoll?.levels || []).length > 0 && (
                  <div className="mt-4 bg-white/10 rounded-lg p-3 border border-white/20 space-y-2">
                    <p className="text-[11px] font-bold text-yellow-300">🔗 URLs des documents par niveau :</p>
                    {(excellenceShowcase.honorRoll?.levels || []).map((level: HonorRollLevel, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-white/60 font-bold shrink-0">{level.label || `Niveau ${index + 1}`} →</span>
                          <EditableText
                            as="p"
                            path={`sections.excellenceShowcase.honorRoll.levels.${index}.linkUrl`}
                            value={level.linkUrl || ''}
                            className="text-sm text-white break-all bg-white/10 rounded px-2 py-1 border border-white/20 flex-1"
                          />
                          <label className="cursor-pointer p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" title="Uploader un PDF">
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocumentUpload(f, `sections.excellenceShowcase.honorRoll.levels.${index}.linkUrl`); }}
                            />
                            <span className="text-xs font-bold">📄</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8">
            <EditableText
              as="h3"
              path="sections.excellenceShowcase.examResultsTitle"
              value={excellenceShowcase.examResultsTitle || ''}
              className="text-center text-xl md:text-3xl font-black uppercase text-[#b58d3c] mb-4 md:mb-6"
            />

            {editSession?.isEditing && (
              <button
                onClick={addExamCard}
                className="mx-auto mb-4 inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Ajouter une carte examen
              </button>
            )}

            <div className="grid md:grid-cols-2 gap-5 md:gap-7">
              {(excellenceShowcase.examCards || []).map((card: ExamCard, index: number) => {
                const hasLink = !!card.linkUrl;
                const cardInner = (
                  <div className="group rounded-[24px] overflow-hidden bg-white shadow-xl border border-orange-100 hover:shadow-2xl transition-all relative">
                    {editSession?.isEditing && (
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeExamCard(index); }}
                        className="absolute top-3 right-3 z-20 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                        title="Supprimer cette carte"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <EditableImage
                        path={`sections.excellenceShowcase.examCards.${index}.image`}
                        src={card.image}
                        alt={card.title || ''}
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        folder="accueil"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:p-5">
                        <EditableText
                          as="h4"
                          path={`sections.excellenceShowcase.examCards.${index}.title`}
                          value={card.title || ''}
                          className="text-white text-xl md:text-2xl font-black leading-tight"
                        />
                        <EditableText
                          as="p"
                          path={`sections.excellenceShowcase.examCards.${index}.subtitle`}
                          value={card.subtitle || ''}
                          className="text-orange-100 text-sm md:text-base font-semibold mt-1"
                        />
                      </div>
                    </div>
                    {editSession?.isEditing ? (
                      <div className="px-4 py-3 bg-orange-50 border-t border-orange-100">
                        <label className="text-[11px] font-bold text-orange-800 block mb-1">🔗 URL du lien (page ou document) :</label>
                        <div className="flex items-center gap-2">
                          <EditableText
                            as="p"
                            path={`sections.excellenceShowcase.examCards.${index}.linkUrl`}
                            value={card.linkUrl || ''}
                            className="text-sm text-orange-900 break-all bg-white rounded px-2 py-1 border border-orange-200 flex-1"
                          />
                          <label className="cursor-pointer p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" title="Uploader un PDF">
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocumentUpload(f, `sections.excellenceShowcase.examCards.${index}.linkUrl`); }}
                            />
                            <span className="text-xs font-bold">📄</span>
                          </label>
                        </div>
                      </div>
                    ) : hasLink ? (
                      <div className="px-4 py-3 bg-orange-50 border-t border-orange-100">
                        <span className="text-xs md:text-sm text-orange-800 break-all">{card.linkUrl}</span>
                      </div>
                    ) : null}
                  </div>
                );

                return hasLink && !editSession?.isEditing ? (
                  <a
                    key={index}
                    href={card.linkUrl}
                    target={card.linkUrl.endsWith('.pdf') ? '_blank' : undefined}
                    rel={card.linkUrl.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                    className="block"
                  >
                    {cardInner}
                  </a>
                ) : (
                  <div key={index}>{cardInner}</div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#efe5de]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={practicalInfo.subtitle}
            title={practicalInfo.title}
            description={practicalInfo.description}
            subtitlePath="sections.practicalInfo.subtitle"
            titlePath="sections.practicalInfo.title"
            descriptionPath="sections.practicalInfo.description"
          />

          <div className="grid lg:grid-cols-[1.03fr_1fr] gap-6 lg:gap-8 items-start">
            <div className="bg-[#e6d59a] rounded-[22px] p-6 md:p-8 shadow-sm border border-[#d8c57b] text-slate-900">
              <EditableText
                as="h3"
                path="sections.practicalInfo.leftColumn.title"
                value={practicalInfo.leftColumn.title}
                className="text-2xl md:text-4xl font-bold text-blue-700 underline underline-offset-4 mb-6"
              />

              <EditableText
                as="p"
                path="sections.practicalInfo.leftColumn.highlightTitle"
                value={`* ${practicalInfo.leftColumn.highlightTitle}`}
                className="text-lg md:text-xl font-bold text-lime-950 mb-5"
              />

              {editSession?.isEditing && (
                <button
                  onClick={() => addPracticalTextItem('sections.practicalInfo.leftColumn.trimesters')}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-5"
                  title="Ajouter un trimestre"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un trimestre</span>
                </button>
              )}

              <div className="space-y-5">
                {practicalInfo.leftColumn.trimesters.map((item, index) => (
                  <div key={index} className="relative">
                    {editSession?.isEditing && (
                      <button
                        onClick={() => removePracticalTextItem('sections.practicalInfo.leftColumn.trimesters', index)}
                        className="absolute top-0 right-0 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg z-10"
                        title="Supprimer ce trimestre"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <EditableText
                      as="h4"
                      path={`sections.practicalInfo.leftColumn.trimesters.${index}.title`}
                      value={item.title}
                      className="text-lg md:text-xl font-bold text-rose-700 underline underline-offset-2 mb-1"
                    />
                    <EditableText
                      as="p"
                      multiline
                      path={`sections.practicalInfo.leftColumn.trimesters.${index}.body`}
                      value={item.body}
                      className="text-base md:text-lg leading-relaxed text-slate-800 whitespace-pre-line"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <EditableText
                  as="h4"
                  path="sections.practicalInfo.leftColumn.breaksTitle"
                  value={practicalInfo.leftColumn.breaksTitle}
                  className="text-xl md:text-2xl font-bold text-amber-800 mb-4"
                />
                {editSession?.isEditing && (
                  <button
                    onClick={() => addPracticalTextItem('sections.practicalInfo.leftColumn.breaks')}
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-4"
                    title="Ajouter un congé"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter un congé</span>
                  </button>
                )}
                <div className="space-y-4">
                  {practicalInfo.leftColumn.breaks.map((item, index) => (
                    <div key={index} className="relative">
                      {editSession?.isEditing && (
                        <button
                          onClick={() => removePracticalTextItem('sections.practicalInfo.leftColumn.breaks', index)}
                          className="absolute top-0 right-0 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg z-10"
                          title="Supprimer ce congé"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <EditableText
                        as="h5"
                        path={`sections.practicalInfo.leftColumn.breaks.${index}.title`}
                        value={item.title}
                        className="text-lg font-bold text-blue-800 underline underline-offset-2 mb-1"
                      />
                      <EditableText
                        as="p"
                        multiline
                        path={`sections.practicalInfo.leftColumn.breaks.${index}.body`}
                        value={item.body}
                        className="text-base leading-relaxed text-slate-800 whitespace-pre-line"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <EditableText
                  as="p"
                  path="sections.practicalInfo.leftColumn.footerTitle"
                  value={practicalInfo.leftColumn.footerTitle}
                  className="text-lg md:text-xl font-bold text-blue-900 mb-1"
                />
                <EditableText
                  as="p"
                  path="sections.practicalInfo.leftColumn.footerLinkText"
                  value={practicalInfo.leftColumn.footerLinkText}
                  className="text-blue-700 underline underline-offset-2 font-semibold"
                />
                {editSession?.isEditing ? (
                  <div className="mt-2 bg-white/80 rounded-lg p-2 border border-blue-300">
                    <label className="text-[11px] font-bold text-blue-800 block mb-1">🔗 URL du lien :</label>
                    <div className="flex items-center gap-2">
                      <EditableText
                        as="p"
                        path="sections.practicalInfo.leftColumn.footerLinkUrl"
                        value={practicalInfo.leftColumn.footerLinkUrl}
                        className="text-sm text-blue-900 break-all bg-white rounded px-2 py-1 border border-blue-200 flex-1"
                      />
                      <label className="cursor-pointer p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" title="Uploader un PDF">
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocumentUpload(f, 'sections.practicalInfo.leftColumn.footerLinkUrl'); }}
                        />
                        <span className="text-xs font-bold">📄</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <EditableText
                    as="p"
                    path="sections.practicalInfo.leftColumn.footerLinkUrl"
                    value={practicalInfo.leftColumn.footerLinkUrl}
                    className="text-xs md:text-sm text-blue-900/70 break-all mt-1 hidden"
                  />
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#434a7a] text-white rounded-[22px] p-6 md:p-8 shadow-sm">
                <EditableText
                  as="h3"
                  path="sections.practicalInfo.rightColumn.topBoxTitle"
                  value={practicalInfo.rightColumn.topBoxTitle}
                  className="text-2xl font-extrabold uppercase mb-4"
                />

                <div className="space-y-5 text-base md:text-lg">
                  <div>
                    <EditableText
                      as="p"
                      path="sections.practicalInfo.rightColumn.firstCycleTitle"
                      value={practicalInfo.rightColumn.firstCycleTitle}
                      className="font-bold mb-2"
                    />
                    {editSession?.isEditing && (
                      <button
                        onClick={() => addPracticalLinkItem('sections.practicalInfo.rightColumn.firstCycleLinks')}
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-3"
                        title="Ajouter un lien du premier cycle"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter un niveau</span>
                      </button>
                    )}
                    <div className="flex flex-wrap gap-x-3 gap-y-2">
                      {practicalInfo.rightColumn.firstCycleLinks.map((item, index) => (
                        <div key={index} className="inline-flex items-center gap-2">
                          <EditableText
                            as="span"
                            path={`sections.practicalInfo.rightColumn.firstCycleLinks.${index}.label`}
                            value={item.label}
                            className="font-bold underline underline-offset-4 text-yellow-300"
                          />
                          {editSession?.isEditing && (
                            <button
                              onClick={() => removePracticalLinkItem('sections.practicalInfo.rightColumn.firstCycleLinks', index)}
                              className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                              title="Supprimer ce niveau"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {editSession?.isEditing && (
                      <div className="mt-3 space-y-2 bg-white/10 rounded-lg p-3 border border-white/20">
                        <p className="text-[11px] font-bold text-yellow-300">🔗 URLs des liens :</p>
                        {practicalInfo.rightColumn.firstCycleLinks.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-[11px] text-white/60 font-bold shrink-0">{item.label} →</span>
                            <EditableText
                              as="p"
                              path={`sections.practicalInfo.rightColumn.firstCycleLinks.${index}.linkUrl`}
                              value={item.linkUrl}
                              className="text-sm text-white break-all bg-white/10 rounded px-2 py-1 border border-white/20 flex-1"
                            />
                            <label className="cursor-pointer p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" title="Uploader un PDF">
                              <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocumentUpload(f, `sections.practicalInfo.rightColumn.firstCycleLinks.${index}.linkUrl`); }}
                              />
                              <span className="text-xs font-bold">📄</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <EditableText
                      as="p"
                      path="sections.practicalInfo.rightColumn.secondCycleTitle"
                      value={practicalInfo.rightColumn.secondCycleTitle}
                      className="font-bold mb-2"
                    />
                    {editSession?.isEditing && (
                      <button
                        onClick={() => addPracticalLinkItem('sections.practicalInfo.rightColumn.secondCycleLinks')}
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-3"
                        title="Ajouter un lien du second cycle"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter un niveau</span>
                      </button>
                    )}
                    <div className="flex flex-wrap gap-x-3 gap-y-2">
                      {practicalInfo.rightColumn.secondCycleLinks.map((item, index) => (
                        <div key={index} className="inline-flex items-center gap-2">
                          <EditableText
                            as="span"
                            path={`sections.practicalInfo.rightColumn.secondCycleLinks.${index}.label`}
                            value={item.label}
                            className="font-bold underline underline-offset-4 text-yellow-300"
                          />
                          {editSession?.isEditing && (
                            <button
                              onClick={() => removePracticalLinkItem('sections.practicalInfo.rightColumn.secondCycleLinks', index)}
                              className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                              title="Supprimer ce niveau"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {editSession?.isEditing && (
                      <div className="mt-3 space-y-2 bg-white/10 rounded-lg p-3 border border-white/20">
                        <p className="text-[11px] font-bold text-yellow-300">🔗 URLs des liens :</p>
                        {practicalInfo.rightColumn.secondCycleLinks.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-[11px] text-white/60 font-bold shrink-0">{item.label} →</span>
                            <EditableText
                              as="p"
                              path={`sections.practicalInfo.rightColumn.secondCycleLinks.${index}.linkUrl`}
                              value={item.linkUrl}
                              className="text-sm text-white break-all bg-white/10 rounded px-2 py-1 border border-white/20 flex-1"
                            />
                            <label className="cursor-pointer p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" title="Uploader un PDF">
                              <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocumentUpload(f, `sections.practicalInfo.rightColumn.secondCycleLinks.${index}.linkUrl`); }}
                              />
                              <span className="text-xs font-bold">📄</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <EditableText
                      as="span"
                      path="sections.practicalInfo.rightColumn.calendarTitle"
                      value={practicalInfo.rightColumn.calendarTitle}
                      className="font-extrabold uppercase inline"
                    />{' '}
                    <EditableText
                      as="span"
                      path="sections.practicalInfo.rightColumn.calendarText"
                      value={practicalInfo.rightColumn.calendarText}
                      className="text-yellow-200 inline"
                    />{' '}
                    <EditableText
                      as="span"
                      path="sections.practicalInfo.rightColumn.calendarLinkText"
                      value={practicalInfo.rightColumn.calendarLinkText}
                      className="underline underline-offset-2 text-yellow-300 font-semibold inline"
                    />
                    {editSession?.isEditing ? (
                      <div className="mt-2 bg-white/10 rounded-lg p-2 border border-white/20">
                        <label className="text-[11px] font-bold text-yellow-300 block mb-1">🔗 URL du lien calendrier :</label>
                        <div className="flex items-center gap-2">
                          <EditableText
                            as="p"
                            path="sections.practicalInfo.rightColumn.calendarLinkUrl"
                            value={practicalInfo.rightColumn.calendarLinkUrl}
                            className="text-sm text-white break-all bg-white/10 rounded px-2 py-1 border border-white/20 flex-1"
                          />
                          <label className="cursor-pointer p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" title="Uploader un PDF">
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocumentUpload(f, 'sections.practicalInfo.rightColumn.calendarLinkUrl'); }}
                            />
                            <span className="text-xs font-bold">📄</span>
                          </label>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <EditableImage
                path="sections.practicalInfo.rightColumn.image"
                src={practicalInfo.rightColumn.image}
                alt={practicalInfo.rightColumn.topBoxTitle}
                className="rounded-[22px] overflow-hidden border-4 border-white shadow-sm bg-white"
                imgClassName="w-full h-full object-cover aspect-[4/3]"
                folder="accueil"
              />

              <div className="bg-[#6c6d92] text-white rounded-[22px] p-6 md:p-8 shadow-sm">
                <EditableText
                  as="h3"
                  path="sections.practicalInfo.rightColumn.parentsBoxTitle"
                  value={practicalInfo.rightColumn.parentsBoxTitle}
                  className="text-2xl md:text-3xl font-bold mb-5"
                />
                <EditableText
                  as="p"
                  multiline
                  path="sections.practicalInfo.rightColumn.parentsBoxBody"
                  value={practicalInfo.rightColumn.parentsBoxBody}
                  className="text-base md:text-lg leading-relaxed whitespace-pre-line mb-5"
                />
                <EditableText
                  as="p"
                  path="sections.practicalInfo.rightColumn.parentsBoxLinkText"
                  value={practicalInfo.rightColumn.parentsBoxLinkText}
                  className="underline underline-offset-2 font-semibold text-white"
                />
                {editSession?.isEditing ? (
                  <div className="mt-2 bg-white/10 rounded-lg p-2 border border-white/20">
                    <label className="text-[11px] font-bold text-yellow-300 block mb-1">🔗 URL du lien principal :</label>
                    <div className="flex items-center gap-2">
                      <EditableText
                        as="p"
                        path="sections.practicalInfo.rightColumn.parentsBoxLinkUrl"
                        value={practicalInfo.rightColumn.parentsBoxLinkUrl}
                        className="text-sm text-white break-all bg-white/10 rounded px-2 py-1 border border-white/20 flex-1"
                      />
                      <label className="cursor-pointer p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" title="Uploader un PDF">
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocumentUpload(f, 'sections.practicalInfo.rightColumn.parentsBoxLinkUrl'); }}
                        />
                        <span className="text-xs font-bold">📄</span>
                      </label>
                    </div>
                  </div>
                ) : null}

                {/* Extra links for parents box */}
                {parentsBoxLinks.map((link, i) => (
                  <div key={i} className="mt-3">
                    {editSession?.isEditing ? (
                      <div className="bg-white/10 rounded-lg p-3 border border-white/20 space-y-2 relative">
                        <button
                          onClick={() => removeParentsBoxLink(i)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                          title="Supprimer ce lien"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-yellow-300 shrink-0">Texte :</label>
                          <EditableText
                            as="span"
                            path={`sections.practicalInfo.rightColumn.parentsBoxExtraLinks.${i}.text`}
                            value={link.text}
                            className="text-sm text-white bg-white/10 rounded px-2 py-1 border border-white/20 flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-yellow-300 shrink-0">🔗 URL :</label>
                          <EditableText
                            as="span"
                            path={`sections.practicalInfo.rightColumn.parentsBoxExtraLinks.${i}.url`}
                            value={link.url}
                            className="text-sm text-white bg-white/10 rounded px-2 py-1 border border-white/20 flex-1 break-all"
                          />
                          <label className="cursor-pointer p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" title="Uploader un PDF">
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocumentUpload(f, `sections.practicalInfo.rightColumn.parentsBoxExtraLinks.${i}.url`); }}
                            />
                            <span className="text-xs font-bold">📄</span>
                          </label>
                        </div>
                      </div>
                    ) : link.url ? (
                      <a
                        href={link.url}
                        target={link.url.endsWith('.pdf') ? '_blank' : undefined}
                        rel={link.url.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                        className="underline underline-offset-2 font-semibold text-white hover:text-white/80 transition-colors block"
                      >
                        {link.text}
                      </a>
                    ) : null}
                  </div>
                ))}

                {editSession?.isEditing && (
                  <button
                    onClick={addParentsBoxLink}
                    className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Ajouter un lien
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-800 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText
            as="h2"
            path="sections.cta.title"
            value={sections.cta.title}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          />
          <EditableText
            as="p"
            multiline
            path="sections.cta.description"
            value={sections.cta.description}
            className="text-xl text-blue-100 mb-10"
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admissions"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-800 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              <EditableText as="span" path="sections.cta.primary" value={sections.cta.primary} />
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-blue-700/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-blue-700/70 transition-colors"
            >
              <EditableText as="span" path="sections.cta.secondary" value={sections.cta.secondary} />
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              aria-label="Fermer la vidéo"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
            {founderVideoUrl ? (
              <iframe
                src={founderVideoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Vidéo du fondateur"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4">
                <Play className="w-16 h-16 opacity-50" />
                <p className="text-lg opacity-70">Vidéo à venir</p>
                <p className="text-sm opacity-50">L'URL de la vidéo peut être configurée depuis l'admin</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HomeContent;
