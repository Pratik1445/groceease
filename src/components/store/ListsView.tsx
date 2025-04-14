import React, { useState, useContext, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useStoreLists } from '@/hooks/use-store-lists';
import { ShoppingList, ListItem } from '@/lib/firestore';
import { AuthContext } from '@/main';
import ItemManagement from './ItemManagement';
import { updateList } from '@/lib/firestore';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ListsView = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { lists, loading, error } = useStoreLists();
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [customerName, setCustomerName] = useState<string>("");
  const { user } = useContext(AuthContext);

  const fetchCustomerName = async (ownerId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', ownerId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCustomerName(userData.fullName || 'Unknown Customer');
      }
    } catch (error) {
      console.error('Error fetching customer name:', error);
      setCustomerName('Unknown Customer');
    }
  };

  useEffect(() => {
    if (selectedList) {
      fetchCustomerName(selectedList.ownerId);
    }
  }, [selectedList]);

  const handleViewList = (list: ShoppingList) => {
    setSelectedList(list);
  };

  const handleGoBack = () => {
    setSelectedList(null);
  };

  const handleUpdateItem = async (itemId: string, updates: Partial<ListItem>) => {
    if (!selectedList) return;

    const updatedItems = selectedList.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    await updateList(selectedList.id, {
      items: updatedItems,
      updatedAt: Timestamp.now()
    });

    toast({
      title: "Item Updated",
      description: "The item has been updated successfully.",
    });
  };

  const handleMarkAsReady = async () => {
    if (!selectedList || !user) return;
    
    // Check if all items are either available or have alternatives
    const allItemsProcessed = selectedList.items.every(
      item => item.isAvailable || item.alternativeBrand || item.alternativeType === 'no-alternative'
    );

    if (!allItemsProcessed) {
      toast({
        title: "Cannot Mark as Ready",
        description: "Please process all items (mark as available or provide alternatives) before marking the list as ready.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Calculate total amount based on available items
      const totalAmount = selectedList.items.reduce((sum, item) => {
        if (item.isAvailable && item.price) {
          return sum + (item.price * (parseInt(item.quantity) || 1));
        }
        return sum;
      }, 0);

      const timestamp = Timestamp.now();

      // Update list status
      await updateList(selectedList.id, {
        status: 'ready',
        totalAmount,
        updatedAt: timestamp,
        storeId: user.uid // Ensure storeId is set
      });

      // Find and update the corresponding order
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('listId', '==', selectedList.id),
        where('storeId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'orders', orderDoc.id), {
          status: 'ready',
          totalAmount,
          updatedAt: timestamp,
          items: selectedList.items.map(item => ({
            ...item,
            substitutions: item.alternativeBrand ? [item.alternativeBrand] : []
          }))
        });

        toast({
          title: "Order Ready",
          description: "The order has been marked as ready and the customer has been notified.",
        });

        setSelectedList(prev => prev ? { ...prev, status: 'ready', totalAmount } : null);
      } else {
        throw new Error('Order not found');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update the order. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading lists: {error}</p>
      </div>
    );
  }

  if (selectedList) {
    return (
      <div className="w-full max-w-full">
        <div className={`flex ${isMobile ? 'flex-col items-start' : 'items-center justify-between'} mb-6 w-full gap-2`}>
          <Button variant="outline" size="sm" onClick={handleGoBack} className="mb-2">
            &larr; Back to Lists
          </Button>
          
          <div className={`flex ${isMobile ? 'flex-col items-start' : 'items-center justify-between'} w-full`}>
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>
              List: {selectedList.name}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedList.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                selectedList.status === 'processing' ? 'bg-orange-100 text-orange-800' :
                selectedList.status === 'ready' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {selectedList.status.charAt(0).toUpperCase() + selectedList.status.slice(1)}
              </span>
              {selectedList.status !== 'ready' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkAsReady}
                >
                  Mark as Ready
                </Button>
              )}
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="py-4">
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>List Information</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Customer</p>
                <p>{customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p>{selectedList.createdAt.toDate().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p>{selectedList.updatedAt.toDate().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium mb-4`}>List Items</h3>
        <div className="space-y-4">
          {selectedList.items.map((item) => (
            <ItemManagement
              key={item.id}
              item={item}
              onUpdateItem={handleUpdateItem}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {lists.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Lists Yet</h3>
          <p className="text-gray-500">You haven't received any lists yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isMobile ? "hidden" : ""}>List Name</TableHead>
                <TableHead className={isMobile ? "hidden" : ""}>Date</TableHead>
                <TableHead className={isMobile ? "hidden" : ""}>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lists.map((list) => (
                <TableRow key={list.id}>
                  <TableCell className="font-medium">{list.name}</TableCell>
                  <TableCell className={isMobile ? "hidden" : ""}>{list.createdAt.toDate().toLocaleDateString()}</TableCell>
                  <TableCell className={isMobile ? "hidden" : ""}>{list.items.length} items</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      list.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      list.status === 'processing' ? 'bg-orange-100 text-orange-800' :
                      list.status === 'ready' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {list.status.charAt(0).toUpperCase() + list.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewList(list)}
                    >
                      <Edit size={16} /> {isMobile ? "" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ListsView; 