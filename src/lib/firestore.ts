import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { User } from '@/main';

// Types
export interface ListItem {
  id: string;
  name: string;
  quantity: string;
  brand: string;
  isAvailable: boolean;
  alternativeBrand?: string;
  alternativeType?: 'no-alternative' | 'different-brand';
  price?: number;
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
  storeId?: string;
  totalAmount?: number;
}

export interface Order {
  id: string;
  listId: string;
  customerId: string;
  storeId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'submitted' | 'processing' | 'ready' | 'completed';
  items: (ListItem & {
    substitutions: string[];
  })[];
}

export interface Bill {
  id: string;
  listId: string;
  listName: string;
  customerId: string;
  storeId: string;
  totalAmount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'pending' | 'paid';
}

// Lists Collection
export const createList = async (list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>) => {
  const listsRef = collection(db, 'lists');
  const newList = {
    ...list,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await addDoc(listsRef, newList);
  return { id: docRef.id, ...newList };
};

export const getList = async (listId: string) => {
  const listRef = doc(db, 'lists', listId);
  const listDoc = await getDoc(listRef);
  if (!listDoc.exists()) {
    throw new Error('List not found');
  }
  return { id: listDoc.id, ...listDoc.data() } as ShoppingList;
};

export const getUserLists = async (userId: string) => {
  const listsRef = collection(db, 'lists');
  const q = query(
    listsRef,
    where('ownerId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ShoppingList[];
};

export const updateList = async (listId: string, updates: Partial<ShoppingList>) => {
  const listRef = doc(db, 'lists', listId);
  await updateDoc(listRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteList = async (listId: string) => {
  const listRef = doc(db, 'lists', listId);
  await deleteDoc(listRef);
};

// Orders Collection
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  const ordersRef = collection(db, 'orders');
  const newOrder = {
    ...order,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await addDoc(ordersRef, newOrder);
  return { id: docRef.id, ...newOrder };
};

export const getOrder = async (orderId: string) => {
  const orderRef = doc(db, 'orders', orderId);
  const orderDoc = await getDoc(orderRef);
  if (!orderDoc.exists()) {
    throw new Error('Order not found');
  }
  return { id: orderDoc.id, ...orderDoc.data() } as Order;
};

export const getStoreOrders = async (storeId: string) => {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('storeId', '==', storeId),
    orderBy('updatedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
};

export const getCustomerOrders = async (customerId: string) => {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('customerId', '==', customerId),
    orderBy('updatedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
};

export const updateOrder = async (orderId: string, updates: Partial<Order>) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

// Users Collection
export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, updates);
};

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }
  return { id: userDoc.id, ...userDoc.data() } as User;
}; 