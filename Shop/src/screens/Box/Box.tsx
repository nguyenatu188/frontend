import React from "react";
import { AspectRatio } from "../../components/ui/aspect-ratio";
import { Card, CardContent } from "../../components/ui/card";

export const Box = (): JSX.Element => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Card className="w-full h-full border-0">
        <CardContent className="p-0 w-full h-full">
          <AspectRatio ratio={16 / 9} className="w-full h-full">
            <img
              className="w-full h-full object-cover"
              alt="Cover"
              src="https://c.animaapp.com/maav4iirDdYpfF/img/cover.svg"
            />
          </AspectRatio>
        </CardContent>
      </Card>
    </div>
  );
};
