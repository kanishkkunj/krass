import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
const HeroSection = () => {
  const backgroundImageUrl = "/images/hero-bg.png";
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <section id="home" className="relative min-h-screen flex items-center justify-center">
      {/* Background image with layered transparency */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
        <div className="absolute inset-0 bg-background/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-card/30 to-transparent" />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      {/* Subtle vignette for contrast */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/20 via-transparent to-background/40" />

      <div className="relative section-container overflow-visible">
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow text */}
          <AnimatedSection delay={0.2}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="gold-line" />
              <span className="text-primary text-sm uppercase tracking-[0.3em] font-medium">
                Crafting Exceptional Experiences
              </span>
              <span className="gold-line" />
            </div>
          </AnimatedSection>

          {/* Main heading */}
           <AnimatedSection delay={0.4}>
            <h1 className="text-display mb-6 hero-text-glow">
              <span className="block text-foreground">Curating Experiences,</span>
              <span className="block text-gradient px-0 py-[10px]">Creating Memories </span>
              <span className="block text-foreground">
            </span>
            </h1>
          </AnimatedSection>

          {/* Subheading */}
          <AnimatedSection delay={0.6}>
            <p className="text-subheading max-w-2xl mx-auto mb-12 hero-subtext-glow">
              From corporate galas to intimate celebrations, we transform your vision
              into extraordinary moments that leave lasting impressions.
            </p>
          </AnimatedSection>

          {/* CTA Buttons */}
          <AnimatedSection delay={0.8}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button onClick={() => scrollToSection("portfolio")} className="btn-primary hero-btn-shadow" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                View Portfolio
              </motion.button>
              <motion.button onClick={() => scrollToSection("contact")} className="btn-outline hero-btn-shadow" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                Contact Us
              </motion.button>
              <motion.button onClick={() => scrollToSection("consultation")} className="btn-outline hero-btn-shadow" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                Free Consultation
              </motion.button>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{
      y: [0, 10, 0]
    }} transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}>
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{
          y: [0, 12, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }} />
        </div>
      </motion.div>
    </section>;
};
export default HeroSection;