"use client";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="bg-blue-600 text-white"
      initial={{ y: 50, opacity: 0 }}  // Starts 50px below, invisible
      animate={{ y: 0, opacity: 1 }}   // Moves to normal position, visible
      transition={{ duration: 0.8, ease: "easeOut" }}  // Smooth transition
      whileHover={{ scale: 1.02 }}  // Slight lift when hovered
    >
      <div className="container mx-auto text-center py-4">
        <p>&copy; 2025 Standard Force. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
