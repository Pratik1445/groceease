
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingCart, Clock, CheckCircle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-white to-green-50 pt-16 pb-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900">
                Shop Smarter,
                <span className="text-primary block mt-2">Pick Up Faster</span>
              </h1>
              <p className="mt-5 text-lg text-gray-600 max-w-lg">
                Create your grocery lists online, share with family, and pick up when everything's ready. No waiting in lines, no searching for products.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="animate-scale-in">
                  <Link to="/lists">Create List</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/how-it-works">How It Works</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 relative flex justify-center">
            <div className="w-full max-w-md relative">
              <div className="bg-white p-6 rounded-xl shadow-xl transform rotate-3 animate-bounce-light">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Weekly Groceries</h3>
                  <span className="text-primary text-sm font-medium px-2 py-1 bg-primary/10 rounded-full">Shared</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Rice", qty: "5kg", brand: "India Gate", complete: true },
                    { name: "Onions", qty: "2kg", brand: "Fresh Local", complete: true },
                    { name: "Milk", qty: "1L", brand: "Amul", complete: false },
                    { name: "Bread", qty: "1 pack", brand: "Britannia", complete: false },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center p-2 rounded-lg ${item.complete ? "bg-gray-50" : "bg-white"} border animate-fade-in`} style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${item.complete ? "bg-primary text-white" : "border border-gray-300"}`}>
                        {item.complete && <CheckCircle size={14} />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${item.complete ? "line-through text-gray-500" : "text-gray-800"}`}>{item.name}</p>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">{item.qty}</span>
                          <span className="text-xs text-gray-400">{item.brand}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
