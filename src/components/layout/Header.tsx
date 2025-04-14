
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X, User, LogOut, Store, LogIn } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from '@/main';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="text-primary text-2xl font-bold">NirmalGrocery</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-6">
            {!isAuthenticated && (
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
                Home
              </Link>
            )}
            {isAuthenticated && userRole === 'customer' && (
              <Link to="/lists" className="text-gray-700 hover:text-primary transition-colors">
                My Lists
              </Link>
            )}
            {isAuthenticated && userRole === 'store' && (
              <Link to="/dashboard" className="text-gray-700 hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
            {isAuthenticated && userRole === 'customer' && (
              <Link to="/orders" className="text-gray-700 hover:text-primary transition-colors">
                My Orders
              </Link>
            )}
          </nav>
        )}

        <div className="flex items-center space-x-3">
          {!isAuthenticated ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => navigate('/signin')}
                className="hidden md:flex items-center gap-2"
              >
                <LogIn size={18} />
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/signup')} 
                className="hidden md:flex items-center gap-2"
              >
                <User size={18} />
                Sign Up
              </Button>
            </>
          ) : (
            <div className="hidden md:flex items-center">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 animate-slide-in-right">
          <div className="pt-5 pb-6 px-5">
            <nav className="grid gap-y-8">
              {!isAuthenticated && (
                <Link 
                  to="/" 
                  className="text-xl font-medium text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              )}
              
              {isAuthenticated && userRole === 'customer' && (
                <Link 
                  to="/lists" 
                  className="text-xl font-medium text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Lists
                </Link>
              )}
              
              {isAuthenticated && userRole === 'store' && (
                <Link 
                  to="/dashboard" 
                  className="text-xl font-medium text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              
              {isAuthenticated && userRole === 'customer' && (
                <Link 
                  to="/orders" 
                  className="text-xl font-medium text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
              )}

              <div className="space-y-4 pt-4 border-t border-gray-200">
                {!isAuthenticated ? (
                  <>
                    <Button 
                      className="w-full justify-center"
                      variant="outline" 
                      onClick={() => {
                        navigate('/signin');
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogIn size={18} className="mr-2" />
                      Sign In
                    </Button>
                    <Button 
                      className="w-full justify-center"
                      onClick={() => {
                        navigate('/signup');
                        setIsMenuOpen(false);
                      }}
                    >
                      <User size={18} className="mr-2" />
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full justify-center"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout ({userRole})
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
