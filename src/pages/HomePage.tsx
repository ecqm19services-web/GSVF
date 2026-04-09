import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SectionTitle from '@/components/ui/SectionTitle';
import { homeContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
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
  ArrowUpRight
} from 'lucide-react';

type HomeData = typeof homeContent;

const HomePage: React.FC = () => {
  const { value: publishedHome } = usePageJsonContent<HomeData>('accueil', homeContent);
  const resolvedHome = publishedHome || homeContent;
  const hero = resolvedHome.hero;
  const sections = resolvedHome.sections;
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

  const galleryItems = sections.activityGallery?.items || homeContent.sections.activityGallery.items;
  const [galleryPage, setGalleryPage] = useState(0);
  const galleryColumns: { src: string; caption: string }[][] = [];
  for (let i = 0; i < galleryItems.length; i += 2) {
    galleryColumns.push(galleryItems.slice(i, i + 2));
  }
  const totalCols = galleryColumns.length;
  const visibleCols = 4;
  const slideCols = 2;
  const galleryMaxPage = Math.max(0, Math.ceil(Math.max(0, totalCols - visibleCols) / slideCols));
  const galleryContent = sections.activityGallery || homeContent.sections.activityGallery;

  const motFondateur = sections.motFondateur || homeContent.sections.motFondateur;
  const actu = sections.actualites || homeContent.sections.actualites;
  const [showVideo, setShowVideo] = useState(false);

  return (
    <Layout>
      {/* Hero Slideshow – images only, no text overlay */}
      <section className="relative h-[60vh] md:h-[70vh] lg:h-[75vh] overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: i === slideIndex ? 1 : 0 }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
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
              <p className="text-3xl md:text-4xl lg:text-5xl italic text-blue-900/80" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {hero.bannerText}
              </p>
            </div>
          </div>
        </div>
      </section>

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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.name}</h3>
                  <div className="text-5xl font-bold text-blue-800 mb-2">{exam.rate}</div>
                  <p className="text-gray-600 mb-2">{exam.mentions}</p>
                  <p className="text-sm text-blue-800 font-medium">{exam.rank}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Banner Bienvenue – image seule */}
      <section>
        <img src={sections.bannerImage?.src} alt="Bienvenue au Collège Privé la Vision Future" className="w-full h-auto object-contain" />
      </section>

      {/* Mot du Fondateur */}
      <section className="pt-6 md:pt-8 pb-16 md:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-t-2xl py-5 px-6 md:px-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center">{motFondateur.title}</h2>
          </div>
          <div className="bg-white border border-gray-200 border-t-0 rounded-b-2xl shadow-lg">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 p-6 md:p-8 flex items-center justify-center">
                <div className="relative w-64 h-80 md:w-full md:h-96 group">
                  <div className="w-full h-full rounded-2xl overflow-hidden shadow-md">
                    <img src={motFondateur.photo} alt="Photo du fondateur" className="w-full h-full object-cover object-[center_22%]" />
                  </div>
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
                <p className="text-base md:text-lg text-gray-700 leading-relaxed italic mb-8">
                  {motFondateur.message}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{motFondateur.name}</p>
                    <p className="text-blue-800 font-medium text-sm">{motFondateur.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Gallery */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.82fr_1.38fr] gap-8 lg:gap-10 items-stretch">
            <div className="bg-emerald-600 text-white rounded-2xl p-6 md:p-8 shadow-lg flex flex-col justify-between min-h-[520px]">
              <div>
                <p className="text-sm md:text-base uppercase tracking-[0.2em] font-semibold text-emerald-100 mb-4">
                  {galleryContent.subtitle}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                  {galleryContent.title}
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-emerald-50 mb-8">
                  {galleryContent.description}
                </p>
              </div>
              <div className="border-t border-white/25 pt-6">
                <p className="text-lg md:text-xl font-semibold leading-relaxed text-white">
                  {galleryContent.highlight}
                </p>
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
                      {col.map((item, rowIdx) => (
                        <div key={rowIdx} className="rounded-xl overflow-hidden bg-gray-100 h-[240px] md:h-[248px] relative">
                          <img
                            src={item.src}
                            alt={item.caption}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <p className="text-sm font-medium text-white">{item.caption}</p>
                          </div>
                        </div>
                      ))}
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
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 overflow-hidden bg-blue-50 rounded-lg border border-blue-100">
            <div className="actu-ticker-horizontal whitespace-nowrap py-3">
              <span className="text-sm md:text-base text-blue-800 font-medium inline-block px-4 pr-12">
                {actu.newsTicker?.text || ""}
              </span>
              <span aria-hidden="true" className="text-sm md:text-base text-blue-800 font-medium inline-block px-4 pr-12">
                {actu.newsTicker?.text || ""}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
            <div className="w-full md:w-[45%] flex-shrink-0">
              <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={actu.image?.src}
                  alt="Actualité"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4">
                {(actu.belowImage?.mode || 'text') === 'image' ? (
                  <div className="w-full aspect-video rounded-xl overflow-hidden">
                    <img src={actu.belowImage?.imageSrc} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {actu.belowImage?.text || ""}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {actu.title}
              </h2>

              <div className="space-y-4 md:min-h-[600px]">
                {actu.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                  >
                    <h3 className="text-lg font-bold text-blue-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{item.body}</p>
                    {item.linkText && item.linkUrl && (
                      <a
                        href={item.linkUrl}
                        target={item.linkUrl.endsWith('.pdf') ? '_blank' : undefined}
                        rel={item.linkUrl.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                        {item.linkText}
                      </a>
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
          />

          <div className="mb-10 text-center md:text-left">
            <p className="text-sm md:text-base font-semibold uppercase tracking-[0.18em] text-orange-600 mb-2">
              {excellenceShowcase.subtitle}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
              {excellenceShowcase.title}
            </h2>
          </div>

          <div className="rounded-[28px] overflow-hidden bg-gradient-to-r from-[#d87421] via-[#e07c29] to-[#d87421] shadow-xl p-4 md:p-6 text-white mb-10">
            <p className="text-center text-sm md:text-xl font-extrabold uppercase tracking-wide mb-4 md:mb-6">
              {excellenceShowcase.trimesterLabel}
            </p>

            <div className="grid lg:grid-cols-[1.45fr_0.8fr] gap-4 md:gap-6 items-stretch">
              <div className="rounded-[22px] overflow-hidden border-4 border-white/25 shadow-2xl bg-white/10 backdrop-blur-sm min-h-[260px] md:min-h-[360px]">
                <img
                  src={excellenceShowcase.honorRoll.image}
                  alt="Tableau d'honneur"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="rounded-[22px] bg-white/10 backdrop-blur-sm border border-white/15 px-5 py-6 md:px-8 md:py-8 flex flex-col justify-center">
                <div className="mx-auto mb-4 w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/15 flex items-center justify-center border border-white/25">
                  <Award className="w-10 h-10 md:w-12 md:h-12 text-emerald-200" />
                </div>

                <h3 className="text-center text-2xl md:text-3xl font-black uppercase text-[#153f91] mb-2">
                  {excellenceShowcase.honorRoll.title}
                </h3>
                <p className="text-center text-sm md:text-base font-semibold text-white/95 mb-4">
                  {excellenceShowcase.honorRoll.subtitle}
                </p>
                <p className="text-center text-lg md:text-xl font-bold underline underline-offset-4 mb-4">
                  {excellenceShowcase.honorRoll.levelsTitle}
                </p>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 max-w-sm mx-auto w-full">
                  {excellenceShowcase.honorRoll.levels.map((level, index) => {
                    const hasLink = !!level.linkUrl;
                    const levelContent = (
                      <>
                        <span className="font-bold text-white text-base md:text-lg underline underline-offset-4">
                          {level.label}
                        </span>
                        {hasLink && <ArrowUpRight className="w-4 h-4 text-white" />}
                      </>
                    );

                    return hasLink ? (
                      <a
                        key={index}
                        href={level.linkUrl}
                        target={level.linkUrl.endsWith('.pdf') ? '_blank' : undefined}
                        rel={level.linkUrl.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-2 hover:text-orange-100 transition-colors"
                      >
                        {levelContent}
                      </a>
                    ) : (
                      <div key={index} className="inline-flex items-center gap-2">
                        {levelContent}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8">
            <h3 className="text-center text-xl md:text-3xl font-black uppercase text-[#b58d3c] mb-4 md:mb-6">
              {excellenceShowcase.examResultsTitle}
            </h3>

            <div className="grid md:grid-cols-2 gap-5 md:gap-7">
              {excellenceShowcase.examCards.map((card, index) => {
                const hasLink = !!card.linkUrl;
                const cardInner = (
                  <div className="group rounded-[24px] overflow-hidden bg-white shadow-xl border border-orange-100 hover:shadow-2xl transition-all">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 md:p-5">
                        <h4 className="text-white text-xl md:text-2xl font-black leading-tight">{card.title}</h4>
                        <p className="text-orange-100 text-sm md:text-base font-semibold mt-1">{card.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );

                return hasLink ? (
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
          />

          <div className="grid lg:grid-cols-[1.03fr_1fr] gap-6 lg:gap-8 items-start">
            <div className="bg-[#e6d59a] rounded-[22px] p-6 md:p-8 shadow-sm border border-[#d8c57b] text-slate-900">
              <h3 className="text-2xl md:text-4xl font-bold text-blue-700 underline underline-offset-4 mb-6">
                {practicalInfo.leftColumn.title}
              </h3>

              <p className="text-lg md:text-xl font-bold text-lime-950 mb-5">
                * {practicalInfo.leftColumn.highlightTitle}
              </p>

              <div className="space-y-5">
                {practicalInfo.leftColumn.trimesters.filter((item) => item.title || item.body).map((item, index) => (
                  <div key={index}>
                    <h4 className="text-lg md:text-xl font-bold text-rose-700 underline underline-offset-2 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-base md:text-lg leading-relaxed text-slate-800 whitespace-pre-line">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h4 className="text-xl md:text-2xl font-bold text-amber-800 mb-4">
                  {practicalInfo.leftColumn.breaksTitle}
                </h4>
                <div className="space-y-4">
                  {practicalInfo.leftColumn.breaks.filter((item) => item.title || item.body).map((item, index) => (
                    <div key={index}>
                      <h5 className="text-lg font-bold text-blue-800 underline underline-offset-2 mb-1">
                        {item.title}
                      </h5>
                      <p className="text-base leading-relaxed text-slate-800 whitespace-pre-line">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {(practicalInfo.leftColumn.footerTitle || practicalInfo.leftColumn.footerLinkText) && (
                <div className="mt-8">
                  <p className="text-lg md:text-xl font-bold text-blue-900 mb-1">
                    {practicalInfo.leftColumn.footerTitle}
                  </p>
                  {practicalInfo.leftColumn.footerLinkText && practicalInfo.leftColumn.footerLinkUrl ? (
                    <a
                      href={practicalInfo.leftColumn.footerLinkUrl}
                      target={practicalInfo.leftColumn.footerLinkUrl.endsWith('.pdf') ? '_blank' : undefined}
                      rel={practicalInfo.leftColumn.footerLinkUrl.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 text-blue-700 underline underline-offset-2 font-semibold"
                    >
                      {practicalInfo.leftColumn.footerLinkText}
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <p className="text-blue-700 underline underline-offset-2 font-semibold">
                      {practicalInfo.leftColumn.footerLinkText}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-[#434a7a] text-white rounded-[22px] p-6 md:p-8 shadow-sm">
                <h3 className="text-2xl font-extrabold uppercase mb-4">
                  {practicalInfo.rightColumn.topBoxTitle}
                </h3>

                <div className="space-y-5 text-base md:text-lg">
                  <div>
                    <p className="font-bold mb-2">{practicalInfo.rightColumn.firstCycleTitle}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-2">
                      {practicalInfo.rightColumn.firstCycleLinks.filter((item) => item.label).map((item, index) => (
                        item.linkUrl ? (
                          <a
                            key={index}
                            href={item.linkUrl}
                            target={item.linkUrl.endsWith('.pdf') ? '_blank' : undefined}
                            rel={item.linkUrl.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                            className="font-bold underline underline-offset-4 text-yellow-300 hover:text-yellow-200"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <span key={index} className="font-bold underline underline-offset-4 text-yellow-300">
                            {item.label}
                          </span>
                        )
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-bold mb-2">{practicalInfo.rightColumn.secondCycleTitle}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-2">
                      {practicalInfo.rightColumn.secondCycleLinks.filter((item) => item.label).map((item, index) => (
                        item.linkUrl ? (
                          <a
                            key={index}
                            href={item.linkUrl}
                            target={item.linkUrl.endsWith('.pdf') ? '_blank' : undefined}
                            rel={item.linkUrl.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                            className="font-bold underline underline-offset-4 text-yellow-300 hover:text-yellow-200"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <span key={index} className="font-bold underline underline-offset-4 text-yellow-300">
                            {item.label}
                          </span>
                        )
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-extrabold uppercase inline">{practicalInfo.rightColumn.calendarTitle}</p>{' '}
                    <span className="text-yellow-200">{practicalInfo.rightColumn.calendarText}</span>{' '}
                    {practicalInfo.rightColumn.calendarLinkText && (
                      practicalInfo.rightColumn.calendarLinkUrl ? (
                        <a
                          href={practicalInfo.rightColumn.calendarLinkUrl}
                          target={practicalInfo.rightColumn.calendarLinkUrl.endsWith('.pdf') ? '_blank' : undefined}
                          rel={practicalInfo.rightColumn.calendarLinkUrl.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                          className="underline underline-offset-2 text-yellow-300 font-semibold"
                        >
                          {practicalInfo.rightColumn.calendarLinkText}
                        </a>
                      ) : (
                        <span className="underline underline-offset-2 text-yellow-300 font-semibold">
                          {practicalInfo.rightColumn.calendarLinkText}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] overflow-hidden border-4 border-white shadow-sm bg-white">
                <img
                  src={practicalInfo.rightColumn.image}
                  alt={practicalInfo.rightColumn.topBoxTitle}
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>

              <div className="bg-[#6c6d92] text-white rounded-[22px] p-6 md:p-8 shadow-sm">
                <h3 className="text-2xl md:text-3xl font-bold mb-5">
                  {practicalInfo.rightColumn.parentsBoxTitle}
                </h3>
                <p className="text-base md:text-lg leading-relaxed whitespace-pre-line mb-5">
                  {practicalInfo.rightColumn.parentsBoxBody}
                </p>
                {practicalInfo.rightColumn.parentsBoxLinkText && (
                  practicalInfo.rightColumn.parentsBoxLinkUrl ? (
                    <a
                      href={practicalInfo.rightColumn.parentsBoxLinkUrl}
                      target={practicalInfo.rightColumn.parentsBoxLinkUrl.endsWith('.pdf') ? '_blank' : undefined}
                      rel={practicalInfo.rightColumn.parentsBoxLinkUrl.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 underline underline-offset-2 font-semibold text-white"
                    >
                      {practicalInfo.rightColumn.parentsBoxLinkText}
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <p className="underline underline-offset-2 font-semibold text-white">
                      {practicalInfo.rightColumn.parentsBoxLinkText}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-800 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {sections.cta.title}
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            {sections.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admissions"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              {sections.cta.primary}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-orange-500/80 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-orange-600 transition-colors"
            >
              {sections.cta.secondary}
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
            {motFondateur.videoUrl ? (
              <iframe
                src={motFondateur.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Vidéo du fondateur"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4">
                <Play className="w-16 h-16 opacity-50" />
                <p className="text-lg opacity-70">Vidéo à venir</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default HomePage;
