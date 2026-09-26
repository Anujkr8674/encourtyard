'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Compass, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Typewriter Hook
function useLineTypewriter(lines: string[], speed: number = 32) {
  const [typedLines, setTypedLines] = useState<string[]>(['', '', '']);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setTypedLines(['', '', '']);
    setCurrentLineIndex(0);
    setIsTyping(true);

    let lineIdx = 0;
    let charIdx = 0;
    const current = ['', '', ''];

    const timer = setInterval(() => {
      if (lineIdx < lines.length) {
        const targetLine = lines[lineIdx];
        if (charIdx <= targetLine.length) {
          current[lineIdx] = targetLine.slice(0, charIdx);
          setTypedLines([...current]);
          setCurrentLineIndex(lineIdx);
          charIdx++;
        } else {
          lineIdx++;
          charIdx = 0;
        }
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [lines, speed]);

  return { typedLines, currentLineIndex, isTyping };
}

interface GalleryImage {
  id: string;
  url: string;
  heading: string | null;
  description: string | null;
  order: number;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(images.length / itemsPerPage);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const typewriterLines = useMemo(
    () => ['Immerse yourself in', 'architectural serenity', 'and design.'],
    []
  );
  const { typedLines, currentLineIndex, isTyping } = useLineTypewriter(typewriterLines, 30);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/admin/gallery');
        const data = await res.json();
        if (data.success) {
          setImages(data.images);
        }
      } catch (err) {
        console.error('Failed to fetch gallery images', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  const paginatedImages = images.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx + (currentPage - 1) * itemsPerPage);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const lightboxNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex < images.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const lightboxPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen flex flex-col">
      {/* 1. Hero Section (90vh) */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex flex-col justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E170E]/40 via-[#0E170E]/20 to-[#0E170E]/50 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80" 
            alt="Gallery Hero" 
            className="w-full h-full object-cover object-center filter brightness-100 contrast-105"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center">
          {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#4ADE80] mb-6 shadow-xl">
            <Compass className="w-3.5 h-3.5" />
            <span>Visual Tour</span>
          </div> */}

          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6">
            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-3xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-colors">
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#141F14] leading-[1.15]">
                {typedLines[0]}
                {isTyping && currentLineIndex === 0 && <span className="inline-block w-1 sm:w-1.5 h-6 sm:h-9 bg-[#2E7D32] ml-1 align-middle animate-pulse" />}
              </h1>
            </div>
            
            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-3xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-colors">
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1B3B22] italic font-normal leading-[1.15]">
                {typedLines[1]}
                {isTyping && currentLineIndex === 1 && <span className="inline-block w-1 sm:w-1.5 h-6 sm:h-9 bg-[#2E7D32] ml-1 align-middle animate-pulse" />}
              </h1>
            </div>

            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-3xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-colors">
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#141F14] leading-[1.15]">
                {typedLines[2]}
                {isTyping && currentLineIndex === 2 && <span className="inline-block w-1 sm:w-1.5 h-6 sm:h-9 bg-[#2E7D32] ml-1 align-middle animate-pulse" />}
              </h1>
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 text-sm sm:text-lg text-[#181F18] font-sans shadow-[0_8px_25px_rgba(0,0,0,0.1)] leading-relaxed max-w-2xl text-center font-medium">
              Explore the intricate details, tactile materials, and lush environments that make our workspaces extraordinary.
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs uppercase font-mono tracking-widest text-[#263626] font-semibold">
            Our Spaces
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#181F18]">
            The EnCourtyard Collection
          </h2>
        </div>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center text-[#5C665C]">
            <div className="w-10 h-10 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-medium animate-pulse">Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="py-32 text-center text-[#5C665C]">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Our gallery is currently being curated. Check back soon.</p>
          </div>
        ) : (
          <>
            {/* Masonry-like Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {paginatedImages.map((img, idx) => (
                <div 
                  key={img.id} 
                  className="group relative rounded-3xl overflow-hidden bg-white shadow-warm border border-[#E5E1D8] cursor-pointer aspect-[4/5] transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  onClick={() => openLightbox(idx)}
                >
                  <img 
                    src={img.url} 
                    alt={img.heading || 'Gallery image'} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Hover Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Text Popup on Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    <h3 className="text-white font-serif text-xl font-bold mb-2 shadow-sm line-clamp-1">
                      {img.heading || 'View Details'}
                    </h3>
                    {img.description && (
                      <p className="text-white/80 text-sm line-clamp-2 leading-relaxed">
                        {img.description}
                      </p>
                    )}
                  </div>

                  {/* Highlights Effect (Top Right Icon) */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/40 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <Compass className="w-4 h-4 text-white" />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-16 pt-8 border-t border-[#E5E1D8]">
                <Button 
                  variant="outline" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="border-[#E5E1D8] text-[#5C665C] hover:bg-[#F7F5F0] rounded-full px-6"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" /> Previous
                </Button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        currentPage === i + 1 
                          ? 'bg-[#2E7D32] w-6' 
                          : 'bg-[#C5D5C5] hover:bg-[#2E7D32]/50'
                      }`}
                      aria-label={`Page ${i + 1}`}
                    />
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="border-[#E5E1D8] text-[#5C665C] hover:bg-[#F7F5F0] rounded-full px-6"
                >
                  Next <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Full-size Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-10"
            onClick={closeLightbox}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Prev Button */}
          {lightboxIndex > 0 && (
            <button 
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 rounded-full hover:bg-white/10 transition-all z-10 hover:-translate-x-1"
              onClick={lightboxPrev}
            >
              <ChevronLeft className="w-10 h-10 sm:w-12 sm:h-12" />
            </button>
          )}

          {/* Image Container */}
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full px-16 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={images[lightboxIndex].url} 
              alt={images[lightboxIndex].heading || 'Full size gallery image'} 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Modal Image Details */}
            {(images[lightboxIndex].heading || images[lightboxIndex].description) && (
              <div className="mt-6 text-center max-w-2xl bg-black/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                {images[lightboxIndex].heading && (
                  <h3 className="text-white font-serif text-2xl font-bold mb-2">
                    {images[lightboxIndex].heading}
                  </h3>
                )}
                {images[lightboxIndex].description && (
                  <p className="text-white/80 text-sm leading-relaxed">
                    {images[lightboxIndex].description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Next Button */}
          {lightboxIndex < images.length - 1 && (
            <button 
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 rounded-full hover:bg-white/10 transition-all z-10 hover:translate-x-1"
              onClick={lightboxNext}
            >
              <ChevronRight className="w-10 h-10 sm:w-12 sm:h-12" />
            </button>
          )}
          
          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 font-mono text-sm tracking-widest bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
