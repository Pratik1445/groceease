import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { ShoppingBag, Receipt } from 'lucide-react';

interface Bill {
  id: string;
  listId: string;
  listName: string;
  totalAmount: number;
  createdAt: Date;
  isPaid: boolean;
}

interface NotificationsListProps {
  bills: Bill[];
  onPayBill: (billId: string) => Promise<void>;
}

const NotificationsList = ({ bills, onPayBill }: NotificationsListProps) => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showQR, setShowQR] = useState(false);

  const handlePayNow = async (bill: Bill) => {
    setSelectedBill(bill);
    setShowQR(true);
  };

  return (
    <div className="space-y-4">
      {bills.length === 0 ? (
        <div className="text-center py-12">
          <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Bills Yet</h3>
          <p className="text-gray-500">You don't have any bills to pay.</p>
        </div>
      ) : (
        bills.map((bill) => (
          <Card key={bill.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Bill for {bill.listName}</h4>
                  <p className="text-sm text-gray-500">
                    Amount: ₹{bill.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Generated on: {bill.createdAt.toLocaleDateString()}
                  </p>
                </div>
                {!bill.isPaid && (
                  <Button
                    variant="outline"
                    onClick={() => handlePayNow(bill)}
                  >
                    Pay Now
                  </Button>
                )}
                {bill.isPaid && (
                  <span className="text-green-600 text-sm font-medium">Paid</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code to Pay</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-64 h-64">
              <Image
                src="/qr/qr.png"
                alt="Payment QR Code"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="text-center text-sm text-gray-500">
              Scan this QR code with your payment app to pay ₹{selectedBill?.totalAmount.toFixed(2)}
            </p>
            <Button
              onClick={async () => {
                if (selectedBill) {
                  await onPayBill(selectedBill.id);
                  setShowQR(false);
                }
              }}
            >
              I've Completed the Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationsList; 