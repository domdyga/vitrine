'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, A11y } from 'swiper/modules'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/pagination'

interface ImageGalleryProps {
  images: string[]
  name: string
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  return (
    <div className="relative w-full aspect-[3/4]">
      <Swiper
        modules={[Pagination, A11y]}
        pagination={{ clickable: true }}
        spaceBetween={0}
        slidesPerView={1}
        className="w-full h-full"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={`${name} — photo ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="(max-width: 512px) 100vw, 512px"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
