import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/main';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { Bill } from '@/lib/firestore';

export const useNotifications = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      setBills([]);
      setLoading(false);
      return;
    }

    // Subscribe to bills for this user
    const billsRef = collection(db, 'bills');
    const q = query(
      billsRef,
      where('customerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newBills = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Bill[];
        setBills(newBills);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching bills:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const markBillAsPaid = async (billId: string) => {
    if (!user) throw new Error('Not authenticated');

    const billRef = doc(db, 'bills', billId);
    await updateDoc(billRef, {
      status: 'paid',
      updatedAt: Timestamp.now()
    });
  };

  const createBill = async (listId: string, listName: string, storeId: string, totalAmount: number) => {
    if (!user) throw new Error('Not authenticated');

    const newBill = {
      listId,
      listName,
      customerId: user.uid,
      storeId,
      totalAmount,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'pending'
    };

    const docRef = await addDoc(collection(db, 'bills'), newBill);
    return { id: docRef.id, ...newBill };
  };

  return {
    bills,
    loading,
    error,
    markBillAsPaid,
    createBill
  };
}; 