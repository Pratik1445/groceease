import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/main';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  Timestamp,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';
import { Order } from '@/lib/firestore';

interface StoreStats {
  pendingOrders: number;
  ordersReady: number;
  totalCustomers: number;
  totalOrdersToday: number;
}

export const useStoreStats = () => {
  const [stats, setStats] = useState<StoreStats>({
    pendingOrders: 0,
    ordersReady: 0,
    totalCustomers: 0,
    totalOrdersToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Get today's start timestamp
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Subscribe to orders collection
    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(
      ordersRef,
      where('storeId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Order[];

        // Calculate stats
        const pendingOrders = orders.filter(order => 
          order.status === 'submitted' || order.status === 'processing'
        ).length;

        const ordersReady = orders.filter(order => 
          order.status === 'ready'
        ).length;

        const uniqueCustomers = new Set(orders.map(order => order.customerId)).size;

        const todayOrders = orders.filter(order => 
          order.createdAt.toDate() >= today
        ).length;

        setStats({
          pendingOrders,
          ordersReady,
          totalCustomers: uniqueCustomers,
          totalOrdersToday: todayOrders,
        });

        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching store stats:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { stats, loading, error };
}; 