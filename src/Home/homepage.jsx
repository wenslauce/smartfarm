import React from 'react';
import Test from "./components/Navbar";
import Service from "./components/Service";
import TabsDemo from "./components/Herosection";
import Testimonial from "./components/Testimonial";
import Footer from "./components/Footer";
import { motion } from 'framer-motion';

function Homepage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {/* Navbar */}
      <Test />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <TabsDemo />

        {/* Services Section */}
        <Service />

        {/* Testimonials Section */}
        <Testimonial />
      </main>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}

export default Homepage;
