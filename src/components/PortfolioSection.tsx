import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import imagesByCategory from "../lib/portfolioImages";

type AspectRatio = "portrait" | "landscape" | "square";

type GalleryItem = {
  id: number;
  url: string;
  category: "corporate" | "social" | "wedding";
  title: string;
  description?: string;
  aspectRatio: AspectRatio;
};

const PortfolioSection = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "corporate" | "social" | "wedding">("all");
  const [itemsWithAspects, setItemsWithAspects] = useState<GalleryItem[]>([]);

  // Build gallery items from imported images
  const baseGalleryItems: Omit<GalleryItem, "aspectRatio">[] = [];
  Object.entries(imagesByCategory).forEach(([category, urls]) => {
    urls.forEach((u, i) => {
      baseGalleryItems.push({
        id: baseGalleryItems.length + 1,
        url: u,
        category: category as "corporate" | "social" | "wedding",
        title: decodeURIComponent(u.split('/').pop() || ""),
      });
    });
  });

  // Detect aspect ratios from actual image dimensions
  useEffect(() => {
    const processImages = async () => {
      const processed = await Promise.all(
        baseGalleryItems.map(
          (item) =>
            new Promise<GalleryItem>((resolve) => {
              const img = new Image();
              img.onload = () => {
                const ratio = img.width / img.height;
                let aspectRatio: AspectRatio;
                if (ratio < 0.8) aspectRatio = "portrait";
                else if (ratio > 1.2) aspectRatio = "landscape";
                else aspectRatio = "square";
                resolve({ ...item, aspectRatio });
              };
              img.onerror = () => {
                resolve({ ...item, aspectRatio: "square" });
              };
              img.src = item.url;
            })
        )
      );
      setItemsWithAspects(processed);
    };
    processImages();
  }, []);

  const categories = [
    { value: "all", label: "All Events" },
    { value: "corporate", label: "Corporate" },
    { value: "social", label: "Social" },
    { value: "wedding", label: "Weddings" },
  ] as const;

  const filteredItems = itemsWithAspects.filter(
    (item) => filter === "all" || item.category === filter
  );

  const getAspectClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case "portrait":
        return "aspect-[3/4]";
      case "landscape":
        return "aspect-[4/3]";
      default:
        return "aspect-square";
    }
  };

  return (
    <section id="portfolio" className="section-padding bg-card relative overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="section-container">
        {/* Section header */}
        <div className="text-center mb-12">
          <AnimatedSection>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="gold-line" />
              <span className="text-primary text-sm uppercase tracking-[0.2em] font-medium">
                Our Work
              </span>
              <span className="gold-line" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h2 className="text-heading mb-6">
              Event <span className="text-gradient">Portfolio</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-body max-w-2xl mx-auto mb-8">
              Explore our collection of successfully executed events. Each project
              represents our commitment to excellence and attention to detail.
            </p>
          </AnimatedSection>

          {/* Filter buttons */}
          <AnimatedSection delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map((cat) => (
                <motion.button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    filter === cat.value
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Masonry Grid */}
        <motion.div layout className="masonry-grid">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="masonry-item"
              >
                <motion.div
                  className={`relative ${getAspectClass(item.aspectRatio)} bg-secondary rounded-lg overflow-hidden cursor-pointer group border border-border`}
                  onClick={() => setSelectedIndex(filteredItems.indexOf(item))}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                    <img src={item.url} alt={item.title} className="object-cover w-full h-full" />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-xs text-primary uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="font-display text-lg font-semibold text-foreground mt-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs text-primary uppercase tracking-wider">
                    {item.category}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-lg"
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-card rounded-lg overflow-hidden border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center text-foreground hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>

              {/* Lightbox content */}
              {selectedIndex !== null && (
                <>
                  <div className="aspect-video bg-secondary flex items-center justify-center">
                    <img src={filteredItems[selectedIndex].url} alt={filteredItems[selectedIndex].title} className="object-contain max-h-full max-w-full" />
                  </div>

                  <div className="p-8">
                    <span className="text-xs text-primary uppercase tracking-wider">
                      {filteredItems[selectedIndex].category}
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-foreground mt-2">
                      {filteredItems[selectedIndex].title}
                    </h3>
                    <p className="text-body mt-3">{filteredItems[selectedIndex].description || ""}</p>

                    <div className="mt-6 flex items-center gap-3">
                      <button
                        onClick={() => setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length))}
                        className="btn"
                        aria-label="Previous"
                      >
                        <ChevronLeft />
                      </button>

                      <button
                        onClick={() => setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % filteredItems.length))}
                        className="btn"
                        aria-label="Next"
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  );
};

export default PortfolioSection;
