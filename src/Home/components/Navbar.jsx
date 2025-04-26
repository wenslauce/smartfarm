import React, { useState, useRef, useEffect } from "react";
import Typewriter from "typewriter-effect";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  ChevronRight, 
  Sprout,
  Sun,
  Droplets,
  ArrowRight,
  Leaf,
  LineChart,
  Cloud,
  Zap
} from 'lucide-react';

const NavLink = ({ href, children }) => (
  <motion.a
    href={href}
    className="relative text-white/90 hover:text-white transition-colors group py-2"
    whileHover={{ x: 5 }}
  >
    <span>{children}</span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white origin-left transition-all duration-300 group-hover:w-full" />
  </motion.a>
);

const StatCard = ({ value, label, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-emerald-300" />
        <div className="text-3xl font-bold text-white">{value}</div>
      </div>
      <div className="text-emerald-100">{label}</div>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 group cursor-pointer"
  >
    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
      <Icon className="w-6 h-6 text-emerald-300" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-emerald-100">{description}</p>
  </motion.div>
);

function BackgroundVideo() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(error => {
        console.error("Video autoplay failed:", error);
        setHasError(true);
      });
    }
  }, []);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = () => {
    setHasError(true);
  };

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-emerald-600 z-0" />
      
      {/* Video overlay */}
      <div className="absolute inset-0 bg-black/40 z-20" />

      {/* Loading state */}
      {!isVideoLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/60"></div>
        </div>
      )}

      {/* Video element */}
      {!hasError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/video/farm.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = () => {
    navigate("/auth/login");
  };

  const navItems = [
    { label: "Home", href: "#" },
    { label: "Services", href: "#services" },
    { label: "Features", href: "#features" },
    { label: "Testimonials", href: "#testimonial" },
  ];

  const features = [
    {
      icon: Leaf,
      title: "Smart Farming",
      description: "AI-powered insights for optimal crop management and yield prediction."
    },
    {
      icon: Cloud,
      title: "Weather Analytics",
      description: "Real-time weather monitoring and predictive forecasting for better planning."
    },
    {
      icon: LineChart,
      title: "Yield Optimization",
      description: "Data-driven recommendations to maximize your agricultural output."
    },
    {
      icon: Zap,
      title: "Instant Insights",
      description: "Quick and accurate analysis of soil health and crop conditions."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Replace the old video element with the new BackgroundVideo component */}
      <BackgroundVideo />

      <div className="relative z-20">
        {/* Navbar */}
        <header className="py-6 px-4">
          <nav className="container mx-auto">
            <div className="flex items-center justify-between">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🌾</span>
                </div>
                <span className="text-2xl font-bold text-white">AgriSmart</span>
              </motion.div>

              {/* Desktop Navigation */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden md:flex items-center space-x-8"
              >
                {navItems.map((item, index) => (
                  <NavLink key={index} href={item.href}>
                    {item.label}
                  </NavLink>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoginClick}
                  className="px-6 py-2.5 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-colors font-medium flex items-center gap-2 group border border-white/20"
                >
                  Sign In
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="md:hidden text-white p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </motion.button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden mt-4 bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    {navItems.map((item, index) => (
                      <NavLink key={index} href={item.href}>
                        {item.label}
                      </NavLink>
                    ))}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLoginClick}
                      className="w-full px-6 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-medium border border-white/20"
                    >
                      Sign In
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 py-12">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 space-y-8"
            >
              <div className="p-8 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-emerald-200 text-sm font-medium mb-6 border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Welcome to the future of agriculture
                  </span>
                </motion.div>

                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  The Future of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-200">
                    Smart Farming
                  </span>
                </h1>
                
                <div className="h-24 flex items-center">
                  <div className="text-xl lg:text-2xl text-emerald-200">
                    <Typewriter
                      options={{
                        strings: [
                          "AI-Powered Crop Management",
                          "Real-time Weather Monitoring",
                          "Smart Irrigation Systems",
                          "Precision Agriculture Tools",
                          "Sustainable Farming Solutions",
                        ],
                        autoStart: true,
                        loop: true,
                        deleteSpeed: 50,
                        delay: 80,
                      }}
                    />
                  </div>
                </div>

                <p className="text-emerald-100 text-lg max-w-xl mb-8">
                  Join thousands of farmers worldwide who are revolutionizing 
                  their agricultural practices with cutting-edge technology 
                  and data-driven insights.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/30"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-medium border border-white/20 backdrop-blur-sm flex items-center justify-center"
                  >
                    Learn More
                  </motion.button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard value="98%" label="Accuracy Rate" icon={Sprout} />
                <StatCard value="10k+" label="Active Farms" icon={Sun} />
                <StatCard value="35%" label="Water Saved" icon={Droplets} />
              </div>
            </motion.div>

            {/* Right Content - Features Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-1/2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;