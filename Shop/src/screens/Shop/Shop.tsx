import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { ShopItem } from "../../components/ShopItem/ShopItem";
import { ConfirmationModal } from "../../components/ConfirmationModal/ConfirmationModal";

const liveItems = [
  { id: 1, name: "Streak Freeze", price: 10, image: "https://d35aaqx5ub95lt.cloudfront.net/images/icons/streak_freeze.svg" },
  { id: 2, name: "Double or Nothing", price: 50, image: "https://d35aaqx5ub95lt.cloudfront.net/images/icons/double_or_nothing.svg" },
];

const mascotItems = [
  { id: 3, name: "Duo the Owl", price: 500, image: "https://d35aaqx5ub95lt.cloudfront.net/images/owls/duo.svg" },
  { id: 4, name: "Lin the Panda", price: 400, image: "https://d35aaqx5ub95lt.cloudfront.net/images/owls/lin.svg" },
];

export const Shop = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: number; name: string; price: number } | null>(null);

  const handleBuy = (id: number) => {
    const item = [...liveItems, ...mascotItems].find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      setIsModalOpen(true);
    }
  };

  const handleConfirm = () => {
    // Here you would typically handle the actual purchase logic
    console.log(`Purchased ${selectedItem?.name} for ${selectedItem?.price} gems`);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-duolingo-blue min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-4 max-w-md">
        <Card className="bg-white rounded-lg shadow-lg">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-duolingo-green mb-6 text-center">Duolingo Shop</h1>
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4">Live</h2>
                <div className="flex flex-col space-y-4">
                  {liveItems.map((item) => (
                    <ShopItem key={item.id} {...item} onBuy={handleBuy} />
                  ))}
                </div>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4">Mascot</h2>
                <div className="flex flex-col space-y-4">
                  {mascotItems.map((item) => (
                    <ShopItem key={item.id} {...item} onBuy={handleBuy} />
                  ))}
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        itemName={selectedItem?.name || ""}
        itemPrice={selectedItem?.price || 0}
      />
    </div>
  );
};
