'use client'

import { JSX, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Camera } from 'lucide-react'

interface GalleryItem {
  id: string
  title: string
  category: 'Competition' | 'Workshop' | 'Meeting' | 'Award'
  date: string
  description: string
  imageUrl: string
  participants?: number
}

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Regionals 2024',
    category: 'Competition',
    date: 'n/a',
    description: 'Our team competing at the North Carolina TSA Regionals Conference at ECU.',
    imageUrl: '/api/placeholder/600/400',
    participants: 24
  },
  {
    id: '2',
    title: 'States 2024',
    category: 'Competition',
    date: 'n/a',
    description: 'Out team competing at the North Carolina TSA States Conference at the Koury Convention Center.',
    imageUrl: '/api/placeholder/600/400',
    participants: 58
  },
  {
    id: '3',
    title: 'Nationals 2024',
    category: 'Competition',
    date: 'June 25, 2024',
    description: 'NCSSM TSA members representing North Carolina at the National TSA Conference in Nashville, TN.',
    imageUrl: '/api/placeholder/600/400',
    participants: 67
  },
]

type SortKey = 'newest' | 'oldest' | 'title'

export default function GalleryPage(): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [sortBy] = useState<SortKey>('newest')

  const filteredItems = useMemo(() => {
    const base = galleryItems
    const withParsedDate = base.map(i => ({ ...i, parsedDate: new Date(i.date) }))
    if (sortBy === 'title') {
      return withParsedDate.sort((a, b) => a.title.localeCompare(b.title))
    }
    if (sortBy === 'oldest') {
      return withParsedDate.sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())
    }
    return withParsedDate.sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime())
  }, [sortBy])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => (prev + 1) % filteredItems.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [filteredItems.length])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Camera className="h-16 w-16 text-blue-200" />
          </div>
          <h1 className="text-5xl font-bold mb-6">NCSSM TSA Gallery</h1>
          <p className="text-xl mb-8 max-w-4xl mx-auto">
            Explore moments from our competitions, workshops, meetings, and celebrations. 
          </p>
        </div>
      </section>

      {/* Gallery Carousel */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
            Highlights
          </h2>

          <div className="relative">
            <div className="
              grid gap-6
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              items-stretch
            ">
              {[-1, 0, 1].map((offset) => {
                const idx = (currentIndex + offset + filteredItems.length) % filteredItems.length
                const item = filteredItems[idx]
                const isCenter = offset === 0

                return (
                  <Link
                    key={item.id}
                    href="#"
                    className={`group relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 block
                      ${isCenter ? "ring-2 ring-blue-600 scale-[1.02]" : "opacity-95"}
                    `}
                  >
                    {/* Image area */}
                    <div className="aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                        <Camera className="h-16 w-16 text-gray-400" />
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="p-5 bg-white">
                      <h3 className="text-lg font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Navigation Arrows */}
            <button
              className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white
                        rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-gray-900
                        transition-all duration-200 group"
              onClick={() => setCurrentIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length)}
              aria-label="Previous"
            >
              <div className="text-xl sm:text-2xl font-light group-hover:scale-110 transition-transform">‹</div>
            </button>

            <button
              className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white
                        rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-gray-900
                        transition-all duration-200 group"
              onClick={() => setCurrentIndex(prev => (prev + 1) % filteredItems.length)}
              aria-label="Next"
            >
              <div className="text-xl sm:text-2xl font-light group-hover:scale-110 transition-transform">›</div>
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {filteredItems.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">
              {currentIndex + 1} of {filteredItems.length}
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
