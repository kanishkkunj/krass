import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
const AboutSection = () => {
  const imageSrc = "/company.jpg"; // place your image at public/company.jpg
  const [imgVisible, setImgVisible] = useState(true);
  const brands = [
    { name: "Adhyayan Foundation", logo: "/logos/Adhyayan Foundation Logo.jpg.jpeg" },
    { name: "Brand 1", logo: "/logos/image (9) (1) (1).png" },
    { name: "Brand 2", logo: "/logos/IMG_2315.PNG" },
    { name: "Brand 3", logo: "/logos/logo.svg" },
    { name: "Mars", logo: "/logos/Mars logo.jpg.jpeg" },
    { name: "Seven Magpie", logo: "/logos/seven-magpie-productions.png" },
    { name: "Studomatrix", logo: "/logos/STUDOMATRIX-05-04.png" },
    { name: "Taj Lands End", logo: "/logos/taj Lands End logo.jpg.jpeg" },
    { name: "TIV19", logo: "/logos/TIV19-01.png" }
  ];
  const brandScaleClasses: Record<string, string> = {
    Studomatrix: "scale-150",
    "Seven Magpie": "scale-[1.8]"
  };
  const autoScrollSpeed = 90; // pixels per second for continuous motion
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const manualResumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isManualScroll, setIsManualScroll] = useState(false);

  const scheduleAutoResume = useCallback(() => {
    if (manualResumeTimeout.current) clearTimeout(manualResumeTimeout.current);
    manualResumeTimeout.current = setTimeout(() => {
      setIsManualScroll(false);
      manualResumeTimeout.current = null;
    }, 1500);
  }, []);

  const registerManualInteraction = useCallback(() => {
    setIsManualScroll(true);
    scheduleAutoResume();
  }, [scheduleAutoResume]);

  const scrollByAmount = useCallback((direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    registerManualInteraction();
    container.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }, [registerManualInteraction]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationId: number;
    let lastTime = performance.now();

    const step = (timestamp: number) => {
      const currentContainer = scrollContainerRef.current;
      if (!currentContainer) return;

      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (!isManualScroll) {
        const loopPoint = currentContainer.scrollWidth / 2;
        if (loopPoint > 0) {
          currentContainer.scrollLeft += (delta * autoScrollSpeed) / 1000;
          if (currentContainer.scrollLeft >= loopPoint) {
            currentContainer.scrollLeft = currentContainer.scrollLeft - loopPoint;
          }
        }
      }

      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isManualScroll]);

  useEffect(() => () => {
    if (manualResumeTimeout.current) clearTimeout(manualResumeTimeout.current);
  }, []);

  const loopingBrands = useMemo(() => [...brands, ...brands], [brands]);
  return <section id="about" className="section-padding bg-card relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <AnimatedSection>
              <div className="flex items-center gap-4 mb-6">
                <span className="gold-line" />
                <span className="text-primary text-sm uppercase tracking-[0.2em] font-medium">ABOUT KRASS EVENTS & CO.</span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="text-heading mb-6">
                Where Vision Meets{" "}
                <span className="text-gradient">Excellence</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-body mb-6">Your go-to source for exquisitely designed and flawlessly executed events. Situated in Mumbai, we have been serving the global community since 2024. With strong partnerships with top vendors, we take pride in curating unforgettable events. Our team of creative experts excels in turning your vision into reality, handling every aspect from logistics to entertainment. Let us handle the details while you savour the moment.

            </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <p className="text-body mb-8">
            </p>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <motion.button onClick={() => {
              const element = document.getElementById("services");
              element?.scrollIntoView({
                behavior: "smooth"
              });
            }} className="btn-outline" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                Our Services
              </motion.button>
            </AnimatedSection>
          </div>

          {/* Right - Image placeholder with stats */}
          <div className="relative">
            <AnimatedSection direction="left">
              {/* Main image placeholder */}
              <div className="relative aspect-[4/5] bg-secondary rounded-lg overflow-hidden border border-border">
                {imgVisible ? (
                  <img
                    src={imageSrc}
                    alt="Company"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => setImgVisible(false)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center">
                        <span className="text-primary/50 text-3xl">+</span>
                      </div>
                      <p className="text-muted-foreground text-sm">Add company image</p>
                    </div>
                  </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              {/* Floating stats card */}
              <motion.div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-lg border border-border shadow-dramatic" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.5
            }}>
                <div className="text-4xl font-display font-bold text-gradient mb-1">2+</div>
                <div className="text-sm text-muted-foreground">Years of Excellence</div>
              </motion.div>

              {/* Decorative element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-primary/20 rounded-lg" />
            </AnimatedSection>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-24">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Brands we have <span className="text-gradient">worked with</span>
              </h3>
            </div>
          </AnimatedSection>

          {/* Carousel with auto + manual scroll */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto py-8"
              onWheel={registerManualInteraction}
              onTouchStart={registerManualInteraction}
              onPointerDown={registerManualInteraction}
              onTouchEnd={scheduleAutoResume}
              onPointerUp={scheduleAutoResume}
            >
              <div className="flex gap-8 min-w-max pr-8">
                {loopingBrands.map((brand, index) => (
                  <motion.div
                    key={`${brand.name}-${index}`}
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-40 h-32 rounded-lg border border-border/50 bg-card/50 flex items-center justify-center p-4 hover:bg-card hover:border-primary/50 transition-all duration-300">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className={`w-full h-full object-scale-down ${brandScaleClasses[brand.name] ?? ""}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Manual scroll buttons */}
            <div className="hidden md:flex absolute inset-y-0 left-0 items-center pl-4 z-20">
              <button className="p-2 rounded-full bg-background/70 border border-border text-foreground hover:text-primary transition-colors" onClick={() => scrollByAmount("left")} onMouseUp={scheduleAutoResume} aria-label="Scroll brands left">
                <ChevronLeft size={18} />
              </button>
            </div>
            <div className="hidden md:flex absolute inset-y-0 right-0 items-center pr-4 z-20">
              <button className="p-2 rounded-full bg-background/70 border border-border text-foreground hover:text-primary transition-colors" onClick={() => scrollByAmount("right")} onMouseUp={scheduleAutoResume} aria-label="Scroll brands right">
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Gradient overlays for fade effect */}
            <div className="pointer-events-none absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10" />
          </div>
        </div>
      </div>

      {/* Bottom decorative gradient */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>;
};
export default AboutSection;