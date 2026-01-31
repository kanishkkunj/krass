import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email Us",
      value: "krassevents@gmail.com",
      href: "mailto:krassevents@gmail.com",
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "+91 7534907155 / +91 9924680500",
      href: "tel:+917534907155",
      isPhone: true,
      phones: ["+917534907155", "+919924680500"]
    },
    {
      icon: MapPin,
      label: "Visit Us",
      value: "B15 Mathura Building, Malad West, Mumbai, Maharashtra, India (400064)",
      href: "#",
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/krassevents/", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/krassevents", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <section id="contact" className="section-padding bg-card relative overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left content */}
          <div>
            <AnimatedSection>
              <div className="flex items-center gap-4 mb-6">
                <span className="gold-line" />
                <span className="text-primary text-sm uppercase tracking-[0.2em] font-medium">
                  Get In Touch
                </span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="text-heading mb-6">
                Let Us{" "}
                <span className="text-gradient">bring your event to life</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-body mb-10">
                Ready to turn your event vision into reality? We're here to help.
                Reach out to us through any of the channels below, and let's start
                planning your next unforgettable experience.
              </p>
            </AnimatedSection>

            {/* Contact info cards */}
            <div className="space-y-4 mb-10">
              {contactInfo.map((item, index) => (
                <AnimatedSection key={item.label} delay={0.3 + index * 0.1}>
                  {item.isPhone ? (
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-all group">
                      <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{item.label}</div>
                        <div className="font-medium text-foreground flex gap-2">
                          {item.phones && item.phones.map((phone, idx) => (
                            <motion.a
                              key={phone}
                              href={`tel:${phone}`}
                              className="text-primary hover:underline"
                              whileHover={{ scale: 1.05 }}
                            >
                              {idx === 0 ? "+91 7534907155" : "+91 9924680500"}
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <motion.a
                      href={item.href}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-all group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{item.label}</div>
                        <div className="font-medium text-foreground">{item.value}</div>
                      </div>
                    </motion.a>
                  )}
                </AnimatedSection>
              ))}
            </div>

            {/* Social links */}
            <AnimatedSection delay={0.6}>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Follow us:</span>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right - Map placeholder */}
          <AnimatedSection direction="left">
            <div className="relative h-full min-h-[400px] rounded-lg overflow-hidden border border-border bg-secondary">
              {/* Google Maps Embed with Pin */}
              <iframe
                title="Krass Events Location"
                src="https://www.google.com/maps?q=19.19089681495897,72.83024332834361&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />

              {/* Overlay card */}
              <motion.div
                className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur-sm p-6 rounded-lg border border-border"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="font-display text-lg font-semibold text-foreground mb-1">
                  Krass Events 
                </h4>
                <p className="text-sm text-muted-foreground">
                  B15 Mathura Building, Malad West, Mumbai
                  <br />
                  Maharashtra, India (400064)
                </p>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
