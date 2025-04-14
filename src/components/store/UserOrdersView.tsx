
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Edit, Check, X } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: string;
  brand: string;
  isAvailable: boolean;
  alternatives?: string;
}

interface Order {
  id: string;
  customerName: string;
  date: Date;
  items: OrderItem[];
  status: 'new' | 'processing' | 'ready' | 'completed' | 'cancelled';
}

const UserOrdersView = () => {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [alternativeText, setAlternativeText] = useState("");
  
  // Sample data for orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1001',
      customerName: 'John Doe',
      date: new Date(),
      items: [
        { id: '101', name: 'Milk', quantity: '2 liters', brand: 'Amul', isAvailable: true },
        { id: '102', name: 'Bread', quantity: '1 pack', brand: 'Harvest Gold', isAvailable: true },
        { id: '103', name: 'Premium Chocolate', quantity: '2 bars', brand: 'Lindt', isAvailable: false, alternatives: 'We have Cadbury and Nestle available' }
      ],
      status: 'new',
    },
    {
      id: '1002',
      customerName: 'Jane Smith',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      items: [
        { id: '201', name: 'Rice', quantity: '5 kg', brand: 'India Gate', isAvailable: true },
        { id: '202', name: 'Oil', quantity: '2 liters', brand: 'Fortune', isAvailable: true }
      ],
      status: 'processing',
    }
  ]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleGoBack = () => {
    setSelectedOrder(null);
    setEditingItemId(null);
  };

  const markItemAvailability = (orderId: string, itemId: string, available: boolean) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          items: order.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                isAvailable: available,
                alternatives: available ? undefined : item.alternatives
              };
            }
            return item;
          })
        };
      }
      return order;
    }));

    toast({
      title: `Item marked as ${available ? 'available' : 'unavailable'}`,
      description: `The item has been updated successfully.`,
    });
  };

  const saveAlternative = (orderId: string, itemId: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          items: order.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                alternatives: alternativeText
              };
            }
            return item;
          })
        };
      }
      return order;
    }));

    setEditingItemId(null);
    setAlternativeText("");

    toast({
      title: "Alternative saved",
      description: "The alternative suggestion has been saved.",
    });
  };

  const handleEditAlternative = (item: OrderItem) => {
    setEditingItemId(item.id);
    setAlternativeText(item.alternatives || "");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {!selectedOrder ? (
        <>
          <h2 className="text-xl font-semibold mb-6">Customer Orders</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.date.toLocaleDateString()}</TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'ready' ? 'bg-green-100 text-green-800' :
                        order.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Edit size={16} className="mr-1" /> View & Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" size="sm" onClick={handleGoBack}>
              &larr; Back to Orders
            </Button>
            <h2 className="text-xl font-semibold">Order #{selectedOrder.id}</h2>
            <div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedOrder.status === 'new' ? 'bg-blue-100 text-blue-800' :
                selectedOrder.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                selectedOrder.status === 'ready' ? 'bg-green-100 text-green-800' :
                selectedOrder.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </span>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Name:</strong> {selectedOrder.customerName}</p>
              <p><strong>Order Date:</strong> {selectedOrder.date.toLocaleDateString()}</p>
            </CardContent>
          </Card>

          <h3 className="text-lg font-medium mb-4">Order Items</h3>
          <div className="space-y-4">
            {selectedOrder.items.map((item) => (
              <Card key={item.id} className={`${!item.isAvailable ? 'border-red-200' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        {item.quantity} • Brand: {item.brand}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.isAvailable ? (
                        <>
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle size={16} /> Available
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markItemAvailability(selectedOrder.id, item.id, false)}
                            className="ml-2"
                          >
                            <X size={16} className="mr-1" /> Mark Unavailable
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircle size={16} /> Unavailable
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markItemAvailability(selectedOrder.id, item.id, true)}
                            className="ml-2"
                          >
                            <Check size={16} className="mr-1" /> Mark Available
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {!item.isAvailable && (
                    <div className="mt-3 border-t pt-3">
                      {editingItemId === item.id ? (
                        <div>
                          <label className="block text-sm font-medium mb-1">Suggest Alternatives:</label>
                          <div className="flex gap-2">
                            <Input
                              value={alternativeText}
                              onChange={(e) => setAlternativeText(e.target.value)}
                              placeholder="e.g. We have brand X and Y available"
                            />
                            <Button 
                              size="sm" 
                              onClick={() => saveAlternative(selectedOrder.id, item.id)}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Alternative Suggestion:</p>
                            <p className="text-sm">{item.alternatives || "No alternatives suggested yet."}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditAlternative(item)}
                          >
                            <Edit size={16} className="mr-1" /> Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button>
              Complete Packing
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrdersView;
