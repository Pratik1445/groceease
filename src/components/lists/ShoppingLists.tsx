import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShoppingBag, Share2, Trash2, Edit, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import NewListForm from './NewListForm';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useLists, ListItem, ShoppingList } from '@/hooks/use-lists';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const ShoppingLists: React.FC = () => {
  const navigate = useNavigate();
  const { lists, loading, createList, deleteList, shareList } = useLists();
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleCreateList = async (listName: string) => {
    try {
      const listId = await createList(listName);
      setShowNewListForm(false);
      
      toast({
        title: "List Created",
        description: `"${listName}" has been created successfully.`,
      });

      // Navigate to the newly created list
      navigate(`/lists/${listId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create list",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteList = async (id: string) => {
    try {
      await deleteList(id);
      toast({
        title: "List Deleted",
        description: "Shopping list has been deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete list",
        variant: "destructive",
      });
    }
  };
  
  const handleShareList = async (id: string) => {
    setSelectedListId(id);
    setShowShareDialog(true);
  };

  const handleShareSubmit = async () => {
    if (!selectedListId || !shareEmail) return;

    try {
      await shareList(selectedListId, shareEmail);
      setShowShareDialog(false);
      setShareEmail('');
      setSelectedListId(null);
      
      toast({
        title: "List Shared",
        description: `List has been shared with ${shareEmail}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to share list",
        variant: "destructive",
      });
    }
  };
  
  const handleViewList = (id: string) => {
    navigate(`/lists/${id}`);
  };
  
  const getStatusIcon = (status: ShoppingList['status']) => {
    switch(status) {
      case 'draft': return <Edit size={16} className="text-blue-500" />;
      case 'submitted': return <Clock size={16} className="text-yellow-500" />;
      case 'processing': return <ShoppingBag size={16} className="text-orange-500" />;
      case 'ready': return <ShoppingBag size={16} className="text-green-500" />;
      case 'completed': return <ShoppingBag size={16} className="text-gray-500" />;
    }
  };
  
  const getStatusText = (status: ShoppingList['status']) => {
    switch(status) {
      case 'draft': return 'Draft';
      case 'submitted': return 'Submitted';
      case 'processing': return 'Being Packed';
      case 'ready': return 'Ready for Pickup';
      case 'completed': return 'Completed';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {!showNewListForm ? (
          <Button 
            onClick={() => setShowNewListForm(true)} 
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Create New List
          </Button>
        ) : (
          <NewListForm 
            onSubmit={handleCreateList} 
            onCancel={() => setShowNewListForm(false)} 
          />
        )}
      </motion.div>
      
      {lists.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center py-12"
        >
          <div className="mb-4">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Shopping Lists Yet</h3>
            <p className="text-gray-500">Create your first shopping list to get started!</p>
          </div>
          <Button 
            onClick={() => setShowNewListForm(true)}
            className="flex items-center gap-2 mx-auto"
          >
            <PlusCircle size={16} />
            Create Your First List
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list, index) => (
            <motion.div 
              key={list.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col cursor-pointer" onClick={() => handleViewList(list.id)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      {list.name}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      {getStatusIcon(list.status)}
                      <span>{getStatusText(list.status)}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-500 mb-2">
                    {list.items.length} items • Created {list.createdAt.toDate().toLocaleDateString()}
                  </p>
                  <ul className="space-y-1">
                    {list.items.slice(0, 3).map((item) => (
                      <li key={item.id} className="text-sm">
                        {item.quantity} {item.name} ({item.brand})
                      </li>
                    ))}
                    {list.items.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{list.items.length - 3} more items
                      </li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter className="border-t pt-4 space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareList(list.id);
                    }}
                  >
                    <Share2 size={16} className="mr-1" /> Share
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteList(list.id);
                    }}
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share List</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you want to share this list with.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowShareDialog(false);
              setShareEmail('');
              setSelectedListId(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleShareSubmit}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShoppingLists;
