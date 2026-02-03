import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { Send, CheckCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';
const ConsultationSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    toast
  } = useToast();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Initialize EmailJS with public key
      emailjs.init('c_0Mp0zuSBgKIx9yl');

      // Send auto-reply email to user
      await emailjs.send(
        'service_5rvf05q', // Your EmailJS service ID
        'template_bzupp8b', // Template for user auto-reply
        {
          email: formData.email, // Send to user's email
          client_name: formData.name,
          contact_info: 'krassevents@gmail.com or +91 7534907155 / +91 9924680500'
        }
      );

      // Send admin notification email
      await emailjs.send(
        'service_5rvf05q', // Your EmailJS service ID
        'template_gx40m7i', // Template for admin notification
        {
          email: 'krassevents@gmail.com', // Send to admin email
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          event_type: formData.eventType,
          message: formData.message
        }
      );

      setIsSubmitted(true);
      toast({
        title: "Consultation Request Sent!",
        description: "We'll get back to you within 24 hours."
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          eventType: "",
          message: ""
        });
      }, 3000);
    } catch (error) {
      console.error('Email send failed:', error);
      toast({
        title: "Error",
        description: "Failed to send consultation request. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const eventTypes = ["Corporate Event", "Wedding", "Birthday Party", "Anniversary", "Conference", "Product Launch", "Other"];
  return <section id="consultation" className="section-padding relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="section-container relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <AnimatedSection>
              <div className="flex items-center gap-4 mb-6">
                <span className="gold-line" />
                <span className="text-primary text-sm uppercase tracking-[0.2em] font-medium">
                  Free Consultation
                </span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="text-heading mb-6">
                Let us bring your{" "}
                <span className="text-gradient">Event to life</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-body mb-8">
                Share your vision with us! Whether you're planning a corporate conference
                or a dream wedding, our team is ready to bring your ideas to life.
                Fill out the form and we'll get back to you within 24 hours.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="flex items-start gap-4 p-6 rounded-lg border border-border/50 bg-card/50 mb-6">
                <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-semibold mb-2 text-foreground">
                    Why Choose Us?
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Free initial consultation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Customized event planning
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Dedicated project manager
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      End-to-end event management
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right - Form */}
          <AnimatedSection direction="left">
            <motion.div className="card-elevated p-8" initial={false} animate={isSubmitted ? {
            borderColor: "hsl(var(--primary))"
          } : {}}>
              {!isSubmitted ? <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="+91 0000000000" />
                    </div>
                    <div>
                      <label htmlFor="eventType" className="block text-sm font-medium text-foreground mb-2">
                        Event Type *
                      </label>
                      <select id="eventType" name="eventType" required value={formData.eventType} onChange={handleChange} className="input-field">
                        <option value="">Select event type</option>
                        {eventTypes.map(type => <option key={type} value={type}>
                            {type}
                          </option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Tell Us About Your Event *
                    </label>
                    <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} className="textarea-field" placeholder="Describe your vision, guest count, preferred date, venue ideas, and any specific requirements..." />
                  </div>

                  <motion.button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2" whileHover={{
                scale: 1.01
              }} whileTap={{
                scale: 0.99
              }}>
                    {isSubmitting ? <motion.div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" animate={{
                  rotate: 360
                }} transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }} /> : <>
                        Send Consultation Request
                        <Send className="w-4 h-4" />
                      </>}
                  </motion.button>
                </form> : <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} className="text-center py-12">
                  <motion.div initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} transition={{
                type: "spring",
                delay: 0.2
              }}>
                    <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  </motion.div>
                  <h3 className="font-display text-2xl font-semibold mb-2 text-foreground">
                    Request Received!
                  </h3>
                  <p className="text-muted-foreground">
                    We'll be in touch within 24 hours.
                  </p>
                </motion.div>}
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>;
};
export default ConsultationSection;