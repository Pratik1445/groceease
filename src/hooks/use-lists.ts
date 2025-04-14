import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/main';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  getDocs,
} from 'firebase/firestore';

export interface ListItem {
  id: string;
  name: string;
  quantity: string;
  brand: string;
  isAvailable: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  items: ListItem[];
  status: 'draft' | 'submitted' | 'processing' | 'ready' | 'completed';
  sharedWith: string[];
  storeId?: string; // Only set when submitted to a store
}

export const useLists = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      setLists([]);
      setLoading(false);
      return;
    }

    // Subscribe to user's lists
    const listsRef = collection(db, 'lists');
    const q = query(
      listsRef,
      where('ownerId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newLists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShoppingList[];
      setLists(newLists);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createList = async (name: string) => {
    if (!user) throw new Error('User not authenticated');

    const newList = {
      name,
      ownerId: user.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      items: [],
      status: 'draft' as const,
      sharedWith: [],
    };

    const docRef = await addDoc(collection(db, 'lists'), newList);
    return docRef.id;
  };

  const updateList = async (listId: string, updates: Partial<ShoppingList>) => {
    if (!user) throw new Error('User not authenticated');

    const listRef = doc(db, 'lists', listId);
    await updateDoc(listRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  };

  const deleteList = async (listId: string) => {
    if (!user) throw new Error('User not authenticated');

    await deleteDoc(doc(db, 'lists', listId));
  };

  const submitListToStore = async (listId: string, storeId: string) => {
    if (!user) throw new Error('User not authenticated');

    // Update list status and store ID
    await updateList(listId, {
      status: 'submitted',
      storeId,
    });

    // Create order in orders collection
    const list = lists.find(l => l.id === listId);
    if (!list) throw new Error('List not found');

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

  const shareList = async (listId: string, email: string) => {
    if (!user) throw new Error('User not authenticated');

    // Find user by email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('User not found');
    }

    const sharedUserId = querySnapshot.docs[0].id;
    const list = lists.find(l => l.id === listId);
    
    if (!list) throw new Error('List not found');
    if (list.sharedWith.includes(sharedUserId)) {
      throw new Error('List already shared with this user');
    }

    await updateList(listId, {
      sharedWith: [...list.sharedWith, sharedUserId],
    });
  };

  return {
    lists,
    loading,
    createList,
    updateList,
    deleteList,
    submitListToStore,
    shareList,
  };
}; 