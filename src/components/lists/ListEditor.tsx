import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion, Variants } from 'framer-motion';
import { PlusCircle, Save, Share2, SendHorizontal, ArrowLeft, Edit, Check, Trash2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useList } from '@/hooks/use-list';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListItem } from '@/lib/firestore';

interface ListEditorProps {
  listId: string;
}

const ListEditor: React.FC<ListEditorProps> = ({ listId }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { list, loading, error, updateListName, addItem, updateItem, removeItem, submitList, getAvailableStores } = useList(listId);
  const [newItem, setNewItem] = useState<{ name: string; quantity: string; brand: string; }>({
    name: '',
    quantity: '',
    brand: '',
  });
  const [editingListName, setEditingListName] = useState(false);
  const [listNameInput, setListNameInput] = useState('');
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [stores, setStores] = useState<any[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [editingItems, setEditingItems] = useState<{ [key: string]: boolean }>({});
  
  const { toast } = useToast();

  const toggleEditItem = (itemId: string) => {
    setEditingItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleSaveList = async () => {
    try {
      // Since changes are saved automatically through the hooks,
      // we just need to show a confirmation toast
      toast({
        title: "List Saved",
        description: "All changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  // Load stores when submit dialog opens
  const handleOpenSubmitDialog = async () => {
    setShowSubmitDialog(true);
    setLoadingStores(true);
    try {
      const availableStores = await getAvailableStores();
      setStores(availableStores);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load stores",
        variant: "destructive",
      });
    } finally {
      setLoadingStores(false);
    }
  };
  
  const handleAddItem = async () => {
    if (newItem.name.trim() && newItem.quantity.trim()) {
      try {
        await addItem({
          name: newItem.name,
          quantity: newItem.quantity,
          brand: newItem.brand || 'Any',
          isAvailable: true,
        });
        
        setNewItem({ name: '', quantity: '', brand: '' });
        
        toast({
          title: "Item Added",
          description: `"${newItem.name}" has been added to your list.`,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to add item",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleRemoveItem = async (id: string) => {
    try {
      await removeItem(id);
      
      toast({
        title: "Item Removed",
        description: "Item has been removed from your list.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item",
        variant: "destructive",
      });
    }
  };
  
  const handleItemChange = async (id: string, field: keyof ListItem, value: string) => {
    try {
      await updateItem(id, { [field]: value });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update item",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmitList = async () => {
    if (!selectedStoreId) {
      toast({
        title: "Error",
        description: "Please select a store",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitList(selectedStoreId);
      setShowSubmitDialog(false);
      
      toast({
        title: "List Submitted",
        description: "Your shopping list has been sent to the store.",
      });

      // Navigate back to lists
      navigate('/lists');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit list",
        variant: "destructive",
      });
    }
  };

  const saveListName = async () => {
    if (listNameInput.trim()) {
      try {
        await updateListName(listNameInput);
        setEditingListName(false);
        
        toast({
          title: "List Name Updated",
          description: "Your shopping list name has been updated.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update list name",
          variant: "destructive",
        });
      }
    }
  };
  
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading List</h2>
        <p className="text-gray-600">{error || 'List not found'}</p>
        <Button className="mt-4" onClick={() => navigate('/lists')}>
          Back to Lists
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className={`${isMobile ? 'flex flex-col gap-4' : 'flex items-center justify-between'} mb-8`}>
        <div className="flex items-center gap-2">
          <Link to="/lists">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1" size={16} />
              {!isMobile && "Back to Lists"}
            </Button>
          </Link>
          
          {editingListName ? (
            <div className="flex items-center gap-2">
              <Input
                value={listNameInput}
                onChange={(e) => setListNameInput(e.target.value)}
                className="max-w-xs"
                autoFocus
              />
              <Button size="sm" onClick={saveListName}>
                <Check size={16} className="mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>{list.name}</h1>
              <Button variant="ghost" size="sm" onClick={() => {
                setListNameInput(list.name);
                setEditingListName(true);
              }}>
                <Edit size={16} />
              </Button>
            </div>
          )}
        </div>

        <div className={`flex ${isMobile ? 'w-full' : 'gap-2'}`}>
          {isMobile ? (
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button variant="outline" size="sm" className="w-full" onClick={handleSaveList}>
                <Save size={16} className={isMobile ? "" : "mr-1"} />
                {!isMobile && "Save"}
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Share2 size={16} className={isMobile ? "" : "mr-1"} />
                {!isMobile && "Share"}
              </Button>
              {list.status === 'draft' && (
                <Button size="sm" className="w-full" onClick={handleOpenSubmitDialog}>
                  <SendHorizontal size={16} className={isMobile ? "" : "mr-1"} />
                  {!isMobile && "Submit"}
                </Button>
              )}
            </div>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleSaveList}>
                <Save size={16} className="mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 size={16} className="mr-1" />
                Share
              </Button>
              {list.status === 'draft' && (
                <Button size="sm" onClick={handleOpenSubmitDialog}>
                  <SendHorizontal size={16} className="mr-1" />
                  Submit to Store
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      
      {list.status === 'ready' && (
        <Card className="mb-6 border-green-100">
          <CardContent className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold mb-1">Order Ready</h3>
                <p className="text-gray-600">Your order is ready for pickup</p>
              </div>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-50 text-green-700">
                Ready for Pickup
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <Input
                id="itemName"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g. Milk"
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <Input
                id="quantity"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                placeholder="e.g. 2 liters"
              />
            </div>
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Brand (Optional)
              </label>
              <Input
                id="brand"
                value={newItem.brand}
                onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                placeholder="e.g. Amul"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddItem}
                disabled={!newItem.name.trim() || !newItem.quantity.trim()}
                className="w-full"
              >
                <PlusCircle size={16} className="mr-1" />
                Add Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-semibold mb-4">Shopping List Items</h2>
      
      {list.items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Your shopping list is empty. Add some items above.
        </div>
      ) : (
        <motion.div 
          className="space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {list.items.map((listItem) => (
            <motion.div 
              key={listItem.id} 
              variants={itemAnimation}
              className={`border rounded-lg p-4 ${!listItem.isAvailable ? 'bg-red-50 border-red-200' : 'bg-white'}`}
            >
              {editingItems[listItem.id] ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-500">Item Name</label>
                    <Input 
                      value={listItem.name} 
                      onChange={(e) => handleItemChange(listItem.id, 'name', e.target.value)}
                      className={!listItem.isAvailable ? 'border-red-300' : ''}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Quantity</label>
                    <Input 
                      value={listItem.quantity} 
                      onChange={(e) => handleItemChange(listItem.id, 'quantity', e.target.value)}
                      className={!listItem.isAvailable ? 'border-red-300' : ''}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Brand</label>
                    <Input 
                      value={listItem.brand} 
                      onChange={(e) => handleItemChange(listItem.id, 'brand', e.target.value)}
                      className={!listItem.isAvailable ? 'border-red-300' : ''}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      className="w-full"
                      onClick={() => toggleEditItem(listItem.id)}
                    >
                      <Check size={16} className="mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <h3 className="font-medium">{listItem.name}</h3>
                      <div className="text-sm text-gray-500">
                        <span>{listItem.quantity}</span>
                        <span className="mx-2">•</span>
                        <span>Brand: {listItem.brand}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleEditItem(listItem.id)}
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveItem(listItem.id)}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}
              
              {!listItem.isAvailable && (
                <div className="mt-2 text-sm text-red-600">
                  <p className="font-medium">This item is currently unavailable</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit List to Store</DialogTitle>
            <DialogDescription>
              Select a store to submit your shopping list to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Store</label>
              {loadingStores ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.storeDetails?.name || store.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitList}>Submit List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListEditor;
