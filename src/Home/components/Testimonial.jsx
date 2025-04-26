/* eslint-disable react/prop-types */
import { Star, User, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialCard = ({ name, role, content, rating, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
    <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-green-100">
      <div className="absolute -top-4 -right-4 bg-green-500 rounded-full p-3 shadow-lg">
        <Quote className="text-white w-5 h-5" />
      </div>
      
      <div className="flex items-center mb-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <User className="text-white" size={32} />
          </div>
          <motion.div
            className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1"
            whileHover={{ scale: 1.2 }}
          >
            <Star className="text-white w-4 h-4 fill-current" />
          </motion.div>
        </div>
        <div className="ml-4">
          <h3 className="font-semibold text-xl text-gray-800">{name}</h3>
          <p className="text-green-600 font-medium">{role}</p>
        </div>
      </div>
      
      <blockquote className="relative mb-6">
        <p className="text-gray-700 text-lg leading-relaxed italic">
          "{content}"
        </p>
      </blockquote>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {[...Array(rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Star className="text-yellow-400 fill-current" size={20} />
            </motion.div>
          ))}
        </div>
        <div className="text-sm text-green-600 font-medium">
          Verified User
        </div>
      </div>
    </div>
  </motion.div>
);

const Testimonial = () => {
  const testimonials = [
    {
      name: "Victor Omondi",
      role: "Organic Farmer",
      content: "This app has revolutionized how I manage plant diseases. The quick diagnosis feature saved my tomato crop last season! The AI recommendations were spot-on.",
      rating: 5
    },
    {
      name: "Peter Kamau",
      role: "Coffee Farmer",
      content: "The weather alerts are incredibly accurate. I've optimized my irrigation schedule and saved significant amounts of water thanks to this app's precise forecasting.",
      rating: 4
    },
    {
      name: "Rajesh Patel",
      role: "Rice Farmer",
      content: "As a beginner, the AI assistant has been invaluable. It's like having an expert gardener on call 24/7! The community support is also amazing.",
      rating: 5
    }
  ];

  return (
    <section id="testimonial" className="relative py-20 overflow-hidden bg-gradient-to-b from-green-50 to-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-green-600 font-semibold text-lg">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how AgriSmart is transforming farming practices worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonial;