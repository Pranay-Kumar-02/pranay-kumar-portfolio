"use client";

// @ts-ignore — package ships without bundled types
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import "@splidejs/react-splide/css";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const spring = { type: "spring", stiffness: 320, damping: 30 } as const;

/**
 * Full-bleed screenshot at its natural aspect ratio. The carousel's `autoHeight`
 * resizes the track to the active slide, so shorter images don't inherit dead
 * space from a taller sibling — no matte or uniform frame needed.
 */
const Frame = ({
  image,
  onZoom,
  priority,
  onImageLoad,
}: {
  image: string;
  onZoom: () => void;
  priority?: boolean;
  onImageLoad?: () => void;
}) => (
  <motion.button
    type="button"
    onClick={onZoom}
    initial="idle"
    animate="idle"
    whileHover="hover"
    whileTap={{ scale: 0.992 }}
    transition={spring}
    aria-label="Open screenshot"
    className="group/frame relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  >
    <Image
      src={image}
      alt="Project screenshot"
      width={1600}
      height={1000}
      priority={priority}
      onLoad={onImageLoad}
      sizes="(max-width: 768px) 100vw, 720px"
      className="block h-auto w-full"
    />

    {/* zoom affordance — revealed on hover only, never blurs the image */}
    <motion.span
      variants={{
        idle: { opacity: 0, y: 8, scale: 0.96 },
        hover: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={spring}
      className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-mono text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md"
    >
      <Maximize2 className="h-3.5 w-3.5" strokeWidth={2} />
      Expand
    </motion.span>
  </motion.button>
);

const SlideShow = ({ images }: { images: string[] }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isOpen = selectedIndex !== null;
  const multiple = images.length > 1;
  const splideRef = useRef<any>(null);

  // Next/Image loads asynchronously, so the slide's real height isn't known when
  // Splide first measures it. Re-trigger autoHeight once each image is decoded.
  const remeasure = useCallback(() => {
    splideRef.current?.splide?.emit("resize");
  }, []);

  const step = useCallback(
    (dir: number) =>
      setSelectedIndex((i) =>
        i === null ? i : (i + dir + images.length) % images.length
      ),
    [images.length]
  );

  // Keyboard navigation while the zoom dialog is open.
  useEffect(() => {
    if (!isOpen || !multiple) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, multiple, step]);

  return (
    <>
      {multiple ? (
        <Splide
          ref={splideRef}
          className="portfolio-slider my-2"
          hasTrack={false}
          options={{
            type: "loop",
            autoplay: true,
            interval: 4500,
            speed: 600,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            perPage: 1,
            perMove: 1,
            autoHeight: true,
            pauseOnHover: true,
            pauseOnFocus: true,
            arrows: true,
            pagination: true,
            gap: "1rem",
          }}
        >
          <SplideTrack>
            {images.map((image, idx) => (
              <SplideSlide key={image}>
                <Frame
                  image={image}
                  priority={idx === 0}
                  onZoom={() => setSelectedIndex(idx)}
                  onImageLoad={remeasure}
                />
              </SplideSlide>
            ))}
          </SplideTrack>

          <div className="splide__arrows">
            <button
              type="button"
              className="splide__arrow splide__arrow--prev"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              className="splide__arrow splide__arrow--next"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          <ul className="splide__pagination" />
        </Splide>
      ) : (
        <div className="my-2">
          <Frame image={images[0]} priority onZoom={() => setSelectedIndex(0)} />
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        <DialogContent className="max-w-[95vw] border-none bg-transparent p-0 shadow-none sm:max-w-[92vw] [&>button]:right-2 [&>button]:top-2 [&>button]:z-10 [&>button]:rounded-full [&>button]:border [&>button]:border-white/15 [&>button]:bg-black/50 [&>button]:p-2 [&>button]:text-white/90 [&>button]:opacity-100 [&>button]:backdrop-blur-md sm:[&>button]:right-3 sm:[&>button]:top-3">
          <DialogHeader className="sr-only">
            <DialogTitle>Screenshot</DialogTitle>
            <DialogDescription>Zoomed project screenshot</DialogDescription>
          </DialogHeader>

          <div
            className="relative flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedIndex ?? "none"}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {isOpen && (
                  <Image
                    src={images[selectedIndex]}
                    alt="Project screenshot"
                    width={1920}
                    height={1200}
                    className="h-auto max-h-[88vh] w-auto max-w-full rounded-xl ring-1 ring-white/10 shadow-2xl"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {multiple && (
              <>
                <button
                  type="button"
                  aria-label="Previous screenshot"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-transform hover:scale-105 active:scale-95 sm:left-4"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  aria-label="Next screenshot"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-transform hover:scale-105 active:scale-95 sm:right-4"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={2} />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-xs text-white/90 backdrop-blur-md">
                  {(selectedIndex ?? 0) + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SlideShow;
