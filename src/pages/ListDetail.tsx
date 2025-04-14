
import React from 'react';
import Layout from '@/components/layout/Layout';
import ListEditor from '@/components/lists/ListEditor';
import { useParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const ListDetail = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 overflow-hidden">
        <ListEditor listId={id || ''} />
      </div>
    </Layout>
  );
};

export default ListDetail;

