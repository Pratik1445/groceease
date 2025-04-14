
import React from 'react';
import { 
  ListChecks, 
  Share2, 
  Users, 
  ShoppingBag, 
  MessageCircle,
  QrCode,
  Clock,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <ListChecks />,
      title: 'Create Shopping Lists',
      description: 'Build detailed shopping lists with quantities and brand preferences.'
    },
    {
      icon: <Share2 />,
      title: 'Share Lists',
      description: 'Share your lists with family members through unique links.'
    },
    {
      icon: <Users />,
      title: 'Collaborate',
      description: 'Edit lists together in real-time with collaborative editing.'
    },
    {
      icon: <ShoppingBag />,
      title: 'Ready to Pickup',
      description: 'Get notified when your order is packed and ready for pickup.'
    },
    {
      icon: <MessageCircle />,
      title: 'Item Availability',
      description: 'Store owners can tag items as unavailable and suggest alternatives.'
    },
    {
      icon: <QrCode />,
      title: 'Easy Payment',
      description: 'Pay via QR code when picking up your groceries.'
    },
    {
      icon: <Clock />,
      title: 'Save Time',
      description: 'No more wandering aisles. Your order is ready when you arrive.'
    },
    {
      icon: <CheckCircle />,
      title: 'Order Tracking',
      description: 'Track your order status from submission to ready for pickup.'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose GrocerEase?</h2>
          <p className="text-lg text-gray-600">
            Our platform makes grocery shopping effortless with these amazing features
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Feature 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
