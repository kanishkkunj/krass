import { useState, useEffect, useMemo, useCallback, SyntheticEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import imagesByCategory from "../lib/portfolioImages";

type AspectRatio = "portrait" | "landscape" | "square";

type GalleryItem = {
  id: number;
  url: string;
  category: "corporate" | "social" | "wedding";
  description?: string;
  aspectRatio: AspectRatio;
};

const PortfolioSection = () => {
  const baseGalleryItems = useMemo(() => {
    const items: GalleryItem[] = [];
    Object.entries(imagesByCategory).forEach(([category, urls]) => {
      urls.forEach((url) => {
        items.push({
          id: items.length + 1,
          url,
          category: category as "corporate" | "social" | "wedding",
          aspectRatio: "square",
        });
      });
    });
    return items;
  }, []);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "corporate" | "social" | "wedding">("all");
  const [itemsWithAspects, setItemsWithAspects] = useState<GalleryItem[]>(baseGalleryItems);

  const curatedAllItems = useMemo(() => {
    if (!baseGalleryItems.length) return [];
    const desiredCount = Math.min(9, Math.max(5, baseGalleryItems.length));
    const shuffled = [...baseGalleryItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selection: GalleryItem[] = [];
    const includedIds = new Set<number>();
    const ensureCategories: GalleryItem["category"][] = ["corporate", "social", "wedding"];

    const takeMatching = (predicate: (item: GalleryItem) => boolean) => {
      const idx = shuffled.findIndex((item) => predicate(item) && !includedIds.has(item.id));
      if (idx !== -1) {
        const [picked] = shuffled.splice(idx, 1);
        selection.push(picked);
        includedIds.add(picked.id);
      }
    };

    ensureCategories.forEach((category) => {
      takeMatching((item) => item.category === category);
    });

    while (selection.length < desiredCount && shuffled.length) {
      const candidate = shuffled.pop();
      if (candidate && !includedIds.has(candidate.id)) {
        selection.push(candidate);
        includedIds.add(candidate.id);
      }
    }

    return selection;
  }, [baseGalleryItems]);

  const highlightDisplayItems = useMemo(() => {
    if (!curatedAllItems.length || !itemsWithAspects.length) return [];
    const lookup = new Map<number, GalleryItem>();
    itemsWithAspects.forEach((item) => lookup.set(item.id, item));
    const prioritized = curatedAllItems
      .map((item) => lookup.get(item.id))
      .filter(Boolean) as GalleryItem[];

    const landscapes = prioritized.filter((item) => item.aspectRatio === "landscape");
    const squares = prioritized.filter((item) => item.aspectRatio === "square");
    const portraits = prioritized.filter((item) => item.aspectRatio === "portrait");

    const arranged: GalleryItem[] = [];
    const buckets = [landscapes, squares, portraits];
    while (buckets.some((bucket) => bucket.length)) {
      buckets.forEach((bucket) => {
        if (bucket.length) {
          arranged.push(bucket.shift()!);
        }
      });
    }

    return arranged;
  }, [curatedAllItems, itemsWithAspects]);

  // Listen for portfolio filter events from Services section
  useEffect(() => {
    const handlePortfolioFilter = (event: Event) => {
      const customEvent = event as CustomEvent;
      const category = customEvent.detail.category;
      setFilter(category);
    };

    window.addEventListener("portfolioFilter", handlePortfolioFilter);
    return () => window.removeEventListener("portfolioFilter", handlePortfolioFilter);
  }, []);

  // Seed gallery with default ratios so UI renders immediately
  useEffect(() => {
    setItemsWithAspects(baseGalleryItems);
  }, [baseGalleryItems]);

  const handleImageLoad = useCallback((event: SyntheticEvent<HTMLImageElement>, id: number) => {
    const img = event.currentTarget;
    if (!img.naturalWidth || !img.naturalHeight) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    let aspectRatio: AspectRatio = "square";
    if (ratio < 0.8) aspectRatio = "portrait";
    else if (ratio > 1.2) aspectRatio = "landscape";

    setItemsWithAspects((prev) => {
      let changed = false;
      const next = prev.map((item) => {
        if (item.id !== id) return item;
        if (item.aspectRatio === aspectRatio) return item;
        changed = true;
        return { ...item, aspectRatio };
      });
      return changed ? next : prev;
    });
  }, []);

  const categories = [
    { value: "all", label: "Highlights" },
    { value: "corporate", label: "Corporate" },
    { value: "social", label: "Social" },
    { value: "wedding", label: "Weddings" },
  ] as const;

  const filteredItems = useMemo(() => {
    if (filter === "all") {
      return highlightDisplayItems;
    }
    return itemsWithAspects.filter((item) => item.category === filter);
  }, [filter, highlightDisplayItems, itemsWithAspects]);

  const isHighlightsView = filter === "all";

  const renderCard = (item: GalleryItem, index: number, options?: { highlight?: boolean; priority?: boolean }) => (
    <div
      className={`portfolio-card-surface ${
        options?.highlight ? "aspect-[4/3]" : getAspectClass(item.aspectRatio)
      }`}
      onClick={() => setSelectedIndex(index)}
    >
      <img
        src={item.url}
        alt={item.category}
        className="object-cover w-full h-full"
        loading={options?.priority ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={options?.priority ? "high" : "auto"}
        onLoad={(event) => handleImageLoad(event, item.id)}
      />

      <div className="portfolio-card-overlay" />

      <div className="portfolio-card-badge">
        {item.category}
      </div>
    </div>
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
        <div className={`masonry-grid ${isHighlightsView ? "highlights-grid" : ""}`}>
          {filteredItems.map((item, index) => (
            <div key={item.id} className="masonry-item">
              {renderCard(item, index, {
                highlight: isHighlightsView,
                priority: isHighlightsView && index < 4,
              })}
            </div>
          ))}
        </div>
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
                    <img src={filteredItems[selectedIndex].url} alt={filteredItems[selectedIndex].category} className="object-contain max-h-full max-w-full" />
                  </div>

                  <div className="p-8">
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
