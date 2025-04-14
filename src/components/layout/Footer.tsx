
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary py-6 text-primary-foreground mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">GrocerEase</h2>
            <p className="text-sm mt-2 max-w-xs">Your local grocery store, now online. Order ahead and pick up when ready.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h3 className="text-sm font-bold mb-2 uppercase">Store Hours</h3>
              <ul className="text-sm">
                <li>Mon-Fri: 8am - 9pm</li>
                <li>Sat: 9am - 8pm</li>
                <li>Sun: 10am - 6pm</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-2 uppercase">Contact</h3>
              <ul className="text-sm">
                <li>123 Main Street</li>
                <li>Mumbai, India</li>
                <li>+91 1234567890</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-6 pt-4 text-center text-sm">
          <p>© {new Date().getFullYear()} GrocerEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
