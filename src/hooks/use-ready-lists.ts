import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/main';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { ShoppingList } from '@/lib/firestore';

export const useReadyLists = () => {
  const [readyList, setReadyList] = useState<ShoppingList | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      setReadyList(null);
      return;
    }

    // Subscribe to lists that are marked as ready
    const listsRef = collection(db, 'lists');
    const q = query(
      listsRef,
      where('ownerId', '==', user.uid),
      where('status', '==', 'ready')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const list = {
            id: change.doc.id,
            ...change.doc.data()
          } as ShoppingList;
          
          // Only show notification for lists that were just marked as ready
          const updatedAt = (list.updatedAt as Timestamp).toDate();
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          
          if (updatedAt > fiveMinutesAgo) {
            setReadyList(list);
            setShowNotification(true);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user]);

  const closeNotification = () => {
    setShowNotification(false);
    setReadyList(null);
  };

  return {
    readyList,
    showNotification,
    closeNotification
  };
}; 