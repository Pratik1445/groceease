import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { ListItem } from '@/lib/firestore';

interface ItemManagementProps {
  item: ListItem;
  onUpdateItem: (itemId: string, updates: Partial<ListItem>) => Promise<void>;
}

const ItemManagement = ({ item, onUpdateItem }: ItemManagementProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [alternativeType, setAlternativeType] = useState<'no-alternative' | 'different-brand'>('different-brand');
  const [alternativeBrand, setAlternativeBrand] = useState('');

  const handleMarkAvailability = async (available: boolean) => {
    await onUpdateItem(item.id, {
      isAvailable: available,
      alternativeBrand: available ? undefined : alternativeBrand,
      alternativeType: available ? undefined : alternativeType
    });
    setIsEditing(false);
    setAlternativeBrand('');
  };

  const handleSaveAlternative = async () => {
    await onUpdateItem(item.id, {
      isAvailable: false,
      alternativeBrand: alternativeType === 'different-brand' ? alternativeBrand : '',
      alternativeType
    });
    setIsEditing(false);
    setAlternativeBrand('');
  };

  return (
    <Card key={item.id}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-gray-500">
              {item.quantity} • Brand: {item.brand}
            </p>
            {!item.isAvailable && item.alternativeBrand && (
              <p className="text-sm text-orange-600 mt-1">
                Alternative: {item.alternativeBrand}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  size="sm"
                  variant={item.isAvailable ? "outline" : "ghost"}
                  className="text-green-600"
                  onClick={() => handleMarkAvailability(true)}
                >
                  <Check size={16} />
                </Button>
                <Button
                  size="sm"
                  variant={!item.isAvailable ? "outline" : "ghost"}
                  className="text-red-600"
                  onClick={() => setIsEditing(true)}
                >
                  <X size={16} />
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <RadioGroup
                  defaultValue={alternativeType}
                  onValueChange={(value) => setAlternativeType(value as 'no-alternative' | 'different-brand')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="different-brand" id="different-brand" />
                    <Label htmlFor="different-brand">Different brand available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-alternative" id="no-alternative" />
                    <Label htmlFor="no-alternative">No alternative available</Label>
                  </div>
                </RadioGroup>

                {alternativeType === 'different-brand' && (
                  <Input
                    placeholder="Enter alternative brand"
                    value={alternativeBrand}
                    onChange={(e) => setAlternativeBrand(e.target.value)}
                    className="mt-2"
                  />
                )}

                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveAlternative}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemManagement; 