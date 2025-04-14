import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/main';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { ShoppingList } from './use-lists';

export const useStoreLists = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      setLists([]);
      setLoading(false);
      return;
    }

    // Subscribe to lists submitted to this store
    const listsRef = collection(db, 'lists');
    const q = query(
      listsRef,
      where('storeId', '==', user.uid),
      where('status', 'in', ['submitted', 'processing', 'ready']),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newLists = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ShoppingList[];
        setLists(newLists);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching store lists:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return {
    lists,
    loading,
    error
  };
}; 