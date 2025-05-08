import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

interface ShopItemProps {
  id: number;
  name: string;
  price: number;
  image: string;
  onBuy: (id: number) => void;
}

export const ShopItem: React.FC<ShopItemProps> = ({ id, name, price, image, onBuy }) => {
  return (
    <Card className="bg-[#f7f7f7] hover:bg-[#e5e5e5] transition-colors duration-200">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src={image} alt={name} className="w-12 h-12 mr-4" />
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-duolingo-red font-bold">{price} gems</p>
          </div>
        </div>
        <Button 
          onClick={() => onBuy(id)} 
          className="bg-duolingo-green hover:bg-duolingo-green/90 text-white"
        >
          Buy
        </Button>
      </CardContent>
    </Card>
  );
};
