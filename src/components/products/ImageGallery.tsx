"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface Props {
  images: string[];
  title: string;
}

const FALLBACK = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80";

export default function ImageGallery({ images, title }: Props) {
  const imgs = images?.length ? images : [FALLBACK];
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  // Hover zoom state
  const [hovered, setHovered] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const prev = () => setActive((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setActive((i) => (i + 1) % imgs.length);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image with hover zoom */}
        <div
          className="relative aspect-square rounded-2xl overflow-hidden bg-base-200 cursor-zoom-in select-none"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setZoomed(true)}
        >
          {/* Zoomable inner wrapper */}
          <div
            className="absolute inset-0 transition-transform duration-100 will-change-transform"
            style={{
              transform: hovered ? "scale(2.4)" : "scale(1)",
              transformOrigin: `${origin.x}% ${origin.y}%`,
            }}
          >
            <Image
              src={imgs[active]}
              alt={`${title} — image ${active + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized
            />
          </div>

          {/* Badges — shown only when not hovered */}
          {!hovered && (
            <>
              {/* Nav arrows */}
              {imgs.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-sm btn-circle bg-base-100/80 backdrop-blur-sm z-10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-sm btn-circle bg-base-100/80 backdrop-blur-sm z-10"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </>
          )}

          {/* Zoom hint */}
          {!hovered && (
            <div className="absolute bottom-3 right-3 bg-base-100/70 backdrop-blur-sm text-base-content/60 text-xs px-2 py-1 rounded-lg pointer-events-none">
              Hover to zoom
            </div>
          )}
        </div>

        {/* Thumbnail strip — always visible */}
        {imgs.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {imgs.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200",
                  i === active
                    ? "border-primary shadow-md scale-105"
                    : "border-base-300 opacity-60 hover:opacity-100 hover:border-base-400"
                )}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen zoom modal (click) */}
      {zoomed && (
        <div
          className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <div className="relative w-full max-w-3xl aspect-square">
            <Image
              src={imgs[active]}
              alt={title}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 btn btn-sm btn-circle bg-white/10 text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
