import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import { AuthContext } from '@/main';

const Index = () => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect after loading is complete
    if (!loading && isAuthenticated && user) {
      // Redirect based on user type
      if (user.userType === 'customer') {
        navigate('/lists');
      } else if (user.userType === 'store') {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only show the hero if not authenticated
  return (
    <Layout>
      <Hero />
    </Layout>
  );
};

export default Index;
