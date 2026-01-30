import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-8 border-t border-border relative">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              src="/logo.png"
              alt="KRASS Logo"
              className="h-20"
            />
          </motion.button>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {currentYear} Krass Events
           
          </p>

          {/* Back to top */}
          <motion.button
            onClick={scrollToTop}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            whileHover={{ y: -2 }}
          >
            Back to top ↑
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
