import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ClipboardList, 
  ArrowRight, 
  Store, 
  PackageCheck, 
  ShoppingBag 
} from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Create Your List',
      description: 'Add items, specify quantities and preferred brands',
      color: 'bg-secondary',
      icon: <ClipboardList className="h-8 w-8" />
    },
    {
      number: 2,
      title: 'Send to Store',
      description: 'Submit your completed list to your local store',
      color: 'bg-primary',
      icon: <ArrowRight className="h-8 w-8" />
    },
    {
      number: 3,
      title: 'Store Prepares Items',
      description: 'Store collects and packs your items, marking unavailable products',
      color: 'bg-secondary',
      icon: <Store className="h-8 w-8" />
    },
    {
      number: 4,
      title: 'Ready for Pickup',
      description: 'Store notifies you when your order is packed and ready',
      color: 'bg-accent',
      icon: <PackageCheck className="h-8 w-8" />
    },
    {
      number: 5,
      title: 'Pickup & Payment',
      description: 'Visit the store to collect your groceries and make payment',
      color: 'bg-primary',
      icon: <ShoppingBag className="h-8 w-8" />
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How NirmalGrocery Works</h2>
          <p className="text-lg text-gray-600">
            A seamless 5-step experience from list creation to pickup
          </p>
        </div>
        
        <div className="relative mt-16">
          {/* Connecting line for desktop */}
          <div className="absolute top-24 left-0 right-0 h-1 bg-gray-200 hidden md:block"></div>
          
          <div className="grid md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <Card className="border-t-4 h-full hover:shadow-lg transition-shadow duration-300" style={{ borderTopColor: `var(--${step.color.substring(3)})` }}>
                  <CardContent className="pt-6 pb-4 px-4">
                    <div className="flex flex-col items-center text-center">
                      <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-5 shadow-md`}>
                        {step.icon}
                      </div>
                      <div className="bg-gray-100 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-3">
                        {step.number}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow between cards - only show on mobile and between cards */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-2 md:hidden">
                    <ArrowRight className="text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Call to action */}
          <div className="text-center mt-12">
            <p className="text-lg font-medium mb-4">Ready to simplify your grocery shopping?</p>
            <a href="/signup" className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors">
              Get Started Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
