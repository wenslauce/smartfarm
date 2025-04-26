/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Camera, CloudSun, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceCard = ({ image, icon: Icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg p-8 hover:bg-white/20 transition-all duration-300 border border-white/20"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    <div className="flex items-center mb-6">
      <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-semibold ml-4 text-white">{title}</h3>
    </div>
    <div className="mb-6 relative w-full h-48 rounded-xl overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
    <p className="text-gray-100 text-lg leading-relaxed">{description}</p>
  </motion.div>
);

const Service = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const services = [
    {
      image: "/phone.png",
      icon: Camera,
      title: "Plant Disease Detection",
      description: "Take a picture of your plants to quickly identify diseases and get treatment recommendations. Our advanced AI algorithms analyze the images to provide accurate diagnoses and suggest appropriate remedies."
    },
    {
      image: "/forecast.png",
      icon: CloudSun,
      title: "Weather Forecast & Alerts",
      description: "Receive accurate weather forecasts, storm alerts, and best farming practices based on current conditions. Stay ahead of weather changes and optimize your farming activities with our real-time updates."
    },
    {
      image: "/ai.png",
      icon: Bot,
      title: "AI Farming Assistant",
      description: "Get real-time answers to your farming queries and personalized advice from our AI-powered assistant. Our intelligent system provides tailored recommendations for crop management and yield optimization."
    }
  ];

  return (
    <section id="services" className="relative py-20 overflow-hidden bg-gradient-to-b from-green-900 to-green-700">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Services</h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Empowering farmers with cutting-edge technology and data-driven insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Service;