import React from 'react';
import { Tabs } from "../../components/ui/tabs";
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Zap, Brain } from 'lucide-react';

const TabContent = ({ title, description, imageSrc }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full overflow-hidden relative h-full rounded-3xl p-8"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-green-50/90 to-emerald-100/90 backdrop-blur-xl" />
    
    <div className="relative flex flex-col items-center text-center z-10">
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <div className="inline-block p-3 bg-green-500/10 rounded-2xl">
          <Sparkles className="w-8 h-8 text-green-600" />
        </div>
      </motion.div>

      <motion.h3 
        className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className="text-base md:text-lg text-green-700 mt-3 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {description}
      </motion.p>

      <motion.div 
        className="w-full mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <img
            src={imageSrc}
            alt="feature illustration"
            className="relative w-4/5 md:w-2/3 mx-auto h-auto object-contain rounded-xl transform transition duration-500 group-hover:scale-105"
          />
        </div>
      </motion.div>
    </div>
  </motion.div>
);

const FeatureHighlight = ({ icon: Icon, text }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="flex items-center space-x-2 text-green-700 bg-green-50/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-100"
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{text}</span>
  </motion.div>
);

const TabsDemo = () => {
  const tabs = [
    {
      title: "AI Chatbot",
      value: "chatbot",
      content: (
        <TabContent
          title="Smart Farming Assistant"
          description="24/7 AI-powered agricultural advice at your fingertips. Get instant answers to your farming questions."
          imageSrc="/Chatbot.png"
        />
      ),
    },
    {
      title: "Crop Recommendation",
      value: "crops",
      content: (
        <TabContent
          title="Smart Crop Selection"
          description="Data-driven recommendations for optimal yield based on your soil conditions and climate."
          imageSrc="/croprecomend.png"
        />
      ),
    },
    {
      title: "Disease Detection",
      value: "diseases",
      content: (
        <TabContent
          title="Plant Health Monitor"
          description="Early detection and treatment guidance using advanced image recognition technology."
          imageSrc="/diseases.png"
        />
      ),
    },
    {
      title: "Fertilizer Guide",
      value: "fertilizer",
      content: (
        <TabContent
          title="Smart Nutrition"
          description="Precision-based fertilization recommendations for maximum crop efficiency."
          imageSrc="/Fertilizers.png"
        />
      ),
    },
    {
      title: "Weather Insights",
      value: "weather",
      content: (
        <TabContent
          title="Weather Updates"
          description="Real-time forecasts and smart farming guidance based on weather conditions."
          imageSrc="/weather.png"
        />
      ),
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50/50 to-white" />
      
      {/* Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* Enhanced Feature Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Features
          </motion.div>

          {/* Enhanced Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mt-2 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-800 via-green-600 to-emerald-600"
          >
            Smart Farming Solutions
          </motion.h2>

          {/* Enhanced Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Revolutionize your farming practices with our comprehensive suite of AI-powered tools
          </motion.p>

          {/* Feature Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto"
          >
            <FeatureHighlight icon={Brain} text="AI-Powered Analytics" />
            <FeatureHighlight icon={Leaf} text="Sustainable Farming" />
            <FeatureHighlight icon={Zap} text="Real-time Insights" />
          </motion.div>
        </motion.div>

        <div className="h-[25rem] md:h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </section>
  );
};

// Add this to your CSS/Tailwind config
const style = {
  '.animate-blob': {
    animation: 'blob 7s infinite',
  },
  '.animation-delay-2000': {
    animationDelay: '2s',
  },
  '.animation-delay-4000': {
    animationDelay: '4s',
  },
  '@keyframes blob': {
    '0%': {
      transform: 'translate(0px, 0px) scale(1)',
    },
    '33%': {
      transform: 'translate(30px, -50px) scale(1.1)',
    },
    '66%': {
      transform: 'translate(-20px, 20px) scale(0.9)',
    },
    '100%': {
      transform: 'translate(0px, 0px) scale(1)',
    },
  },
};

export default TabsDemo;