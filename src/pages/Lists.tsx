
import React from 'react';
import Layout from '@/components/layout/Layout';
import ShoppingLists from '@/components/lists/ShoppingLists';
import { useIsMobile } from '@/hooks/use-mobile';

const Lists = () => {
  const isMobile = useIsMobile();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-6`}>My Shopping Lists</h1>
        <div className="max-w-full overflow-hidden">
          <ShoppingLists />
        </div>
      </div>
    </Layout>
  );
};

export default Lists;

