import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, ShoppingBag, Clock, Package, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOrders } from '@/hooks/use-orders';
import { Order } from '@/lib/firestore';

const OrdersList = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { orders, loading, error, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update the order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch(status) {
      case 'submitted': return <Clock className="text-blue-500" size={18} />;
      case 'processing': return <ShoppingBag className="text-orange-500" size={18} />;
      case 'ready': return <Package className="text-green-500" size={18} />;
      case 'completed': return <Check className="text-green-500" size={18} />;
    }
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch(status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch(status) {
      case 'submitted': return 'New Order';
      case 'processing': return 'Processing';
      case 'ready': return 'Ready for Pickup';
      case 'completed': return 'Completed';
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleGoBack = () => {
    setSelectedOrder(null);
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
        <p>Error loading orders: {error}</p>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="w-full max-w-full">
        <div className={`flex ${isMobile ? 'flex-col items-start' : 'items-center justify-between'} mb-6 w-full gap-2`}>
          <Button variant="outline" size="sm" onClick={handleGoBack} className="mb-2">
            &larr; Back to Orders
          </Button>
          
          <div className={`flex ${isMobile ? 'flex-col items-start' : 'items-center justify-between'} w-full`}>
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>
              Order #{selectedOrder.id}
            </h2>
            
            <div className="mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                getStatusBadgeClass(selectedOrder.status)
              }`}>
                {getStatusText(selectedOrder.status)}
              </span>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="py-4">
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Order Date</p>
                <p>{selectedOrder.createdAt.toDate().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p>{selectedOrder.updatedAt.toDate().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium mb-4`}>Order Items</h3>
        <div className="space-y-4">
          {selectedOrder.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.quantity} • Brand: {item.brand}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {order.createdAt.toDate().toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {order.status === 'submitted' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'processing')}
                      >
                        Start Processing
                      </Button>
                    )}
                    {order.status === 'processing' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                      >
                        Mark Ready
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                      >
                        Complete Order
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrdersList;
