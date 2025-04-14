
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface NewListFormProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

const NewListForm: React.FC<NewListFormProps> = ({ onSubmit, onCancel }) => {
  const [listName, setListName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (listName.trim()) {
      onSubmit(listName);
      setListName('');
    }
  };
  
  return (
    <motion.form 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white p-4 rounded-lg border shadow-sm"
      onSubmit={handleSubmit}
    >
      <h3 className="text-lg font-medium mb-3">Create New Shopping List</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-1">
            List Name
          </label>
          <Input
            id="listName"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="e.g. Weekly Groceries"
            className="w-full"
            autoFocus
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!listName.trim()}>
            Create List
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default NewListForm;
