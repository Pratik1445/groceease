import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useStoreStats } from '@/hooks/use-store-stats';

const StoreStats: React.FC = () => {
  const { stats, loading, error } = useStoreStats();

  const statsConfig = [
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      color: 'bg-orange-100',
    },
    {
      title: 'Orders Ready',
      value: stats.ordersReady,
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      color: 'bg-green-100',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <Users className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-100',
    },
    {
      title: 'Total Orders Today',
      value: stats.totalOrdersToday,
      icon: <ShoppingBag className="h-8 w-8 text-purple-500" />,
      color: 'bg-purple-100',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        <p>Error loading statistics</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StoreStats;
