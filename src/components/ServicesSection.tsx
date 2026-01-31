import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { Briefcase, PartyPopper, Crown, Heart } from "lucide-react";
const ServicesSection = () => {
  const scrollToPortfolio = (category: string) => {
    const element = document.getElementById("portfolio");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Dispatch custom event to set filter in portfolio
      window.dispatchEvent(new CustomEvent("portfolioFilter", { detail: { category } }));
    }
  };

  const services = [{
    category: "Corporate Events",
    filterValue: "corporate",
    icon: Briefcase,
    description: "Be it MICE or team building, we bring fresh concepts and flawless management to upscale your corporate event experience.",
    items: ["Conferences & Seminars", "Product Launches", "Team Building Events", "Corporate Galas", "Award Ceremonies", "Advertising Shoot Setups"]
  }, {
    category: "Social Events",
    filterValue: "social",
    icon: PartyPopper,
    description: "Create magical moments that will be cherished forever with our personalized social event services.",
    items: ["Wedding Celebrations", "Concept Parties", "Private Gatherings", "Live Shows", "Fleas & Fests"]
  }];
  const features = [{
    icon: Crown,
    title: "Premium Quality",
    description: "Every detail is crafted with excellence and precision."
  }, {
    icon: Heart,
    title: "Personal Touch",
    description: "We treat every event as if it were our own celebration."
  }];
  return <section id="services" className="section-padding relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="section-container relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <AnimatedSection>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="gold-line" />
              <span className="text-primary text-sm uppercase tracking-[0.2em] font-medium">
                What We Offer
              </span>
              <span className="gold-line" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h2 className="text-heading mb-6">
              Our <span className="text-gradient">Services</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-body max-w-2xl mx-auto">
              We specialize in creating exceptional experiences for both corporate
              and social occasions, tailored to exceed your expectations.
            </p>
          </AnimatedSection>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => <AnimatedSection key={service.category} delay={0.1 * index} direction={index === 0 ? "right" : "left"}>
              <motion.button 
                onClick={() => scrollToPortfolio(service.filterValue)}
                className="card-elevated p-8 h-full group w-full text-left cursor-pointer hover:shadow-dramatic transition-shadow" 
                whileHover={{
                  y: -5
                }} 
                transition={{
                  duration: 0.3
                }}
              >
                {/* Icon */}
                <div className="w-16 h-16 mb-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl font-semibold mb-4 text-foreground">
                  {service.category}
                </h3>

                {/* Description */}
                <p className="text-body mb-6">{service.description}</p>

                {/* Service items */}
                <ul className="space-y-3">
                  {service.items.map(item => <li key={item} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>)}
                </ul>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-500" />
              </motion.button>
            </AnimatedSection>)}
        </div>

        {/* Features row */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {features.map((feature, index) => <AnimatedSection key={feature.title} delay={0.3 + index * 0.1}>
              <div className="text-center">
                
                
              </div>
            </AnimatedSection>)}
        </div>
      </div>
    </section>;
};
export default ServicesSection;