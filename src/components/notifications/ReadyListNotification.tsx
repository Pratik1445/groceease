import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingList } from '@/lib/firestore';

interface ReadyListNotificationProps {
  list: ShoppingList;
  open: boolean;
  onClose: () => void;
  onPayNow: () => void;
  onViewBill: () => void;
}

const ReadyListNotification = ({
  list,
  open,
  onClose,
  onPayNow,
  onViewBill,
}: ReadyListNotificationProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your List is Ready!</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Good news! Your shopping list "{list.name}" is ready for payment.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onViewBill}>
              View Bill
            </Button>
            <Button onClick={onPayNow}>
              Pay Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReadyListNotification; 