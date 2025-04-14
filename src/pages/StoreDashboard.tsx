import React from 'react';
import Layout from '@/components/layout/Layout';
import ListsView from '@/components/store/ListsView';
import StoreStats from '@/components/store/StoreStats';
import { useIsMobile } from '@/hooks/use-mobile';

const StoreDashboard = () => {
  const isMobile = useIsMobile();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-6`}>Store Dashboard</h1>
        <StoreStats />
        
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-4`}>Shopping Lists</h2>
            <ListsView />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StoreDashboard;

