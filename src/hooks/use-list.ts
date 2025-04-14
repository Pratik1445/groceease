import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/main';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { ListItem, ShoppingList } from './use-lists';

export const useList = (listId: string) => {
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || !listId) {
      setList(null);
      setLoading(false);
      return;
    }

    // Subscribe to list changes
    const listRef = doc(db, 'lists', listId);
    const unsubscribe = onSnapshot(
      listRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as Omit<ShoppingList, 'id'>;
          setList({ id: doc.id, ...data });
        } else {
          setError('List not found');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching list:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [listId, user]);

  const updateListName = async (name: string) => {
    if (!user || !listId) throw new Error('Not authenticated');
    if (!list) throw new Error('List not found');

    await updateDoc(doc(db, 'lists', listId), {
      name,
      updatedAt: Timestamp.now(),
    });
  };

  const addItem = async (item: Omit<ListItem, 'id'>) => {
    if (!user || !listId) throw new Error('Not authenticated');
    if (!list) throw new Error('List not found');

    const newItem = {
      ...item,
      id: Date.now().toString(), // You might want to use a UUID library here
    };

    await updateDoc(doc(db, 'lists', listId), {
      items: [...list.items, newItem],
      updatedAt: Timestamp.now(),
    });
  };

  const updateItem = async (itemId: string, updates: Partial<ListItem>) => {
    if (!user || !listId) throw new Error('Not authenticated');
    if (!list) throw new Error('List not found');

    const updatedItems = list.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    await updateDoc(doc(db, 'lists', listId), {
      items: updatedItems,
      updatedAt: Timestamp.now(),
    });
  };

  const removeItem = async (itemId: string) => {
    if (!user || !listId) throw new Error('Not authenticated');
    if (!list) throw new Error('List not found');

    const updatedItems = list.items.filter(item => item.id !== itemId);

    await updateDoc(doc(db, 'lists', listId), {
      items: updatedItems,
      updatedAt: Timestamp.now(),
    });
  };

  const submitList = async (storeId: string) => {
    if (!user || !listId) throw new Error('Not authenticated');
    if (!list) throw new Error('List not found');

    // Update list status
    await updateDoc(doc(db, 'lists', listId), {
      status: 'submitted',
      storeId,
      updatedAt: Timestamp.now(),
    });

    // Create order in orders collection
    await addDoc(collection(db, 'orders'), {
      listId,
      customerId: user.uid,
      storeId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'submitted',
      items: list.items.map(item => ({
        ...item,
        substitutions: [],
      })),
    });
  };

  const getAvailableStores = async () => {
    const storesRef = collection(db, 'users');
    const q = query(storesRef, where('userType', '==', 'store'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  return {
    list,
    loading,
    error,
    updateListName,
    addItem,
    updateItem,
    removeItem,
    submitList,
    getAvailableStores,
  };
}; 