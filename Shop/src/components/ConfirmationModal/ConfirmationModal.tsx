import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemPrice: number;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemPrice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-80">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Confirm Purchase</h2>
          <p>Are you sure you want to buy {itemName} for {itemPrice} gems?</p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={onConfirm} className="bg-duolingo-green hover:bg-duolingo-green/90 text-white">Confirm</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
