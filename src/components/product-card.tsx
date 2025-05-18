import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import Swal from "sweetalert2";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  value: number[];
  onValueChange: (item: number[]) => void;
}

export function ProductCard({
  product,
  value,
  onValueChange,
}: ProductCardProps) {
  const isAdded = value.includes(product.id);

  return (
    <Card className="w-full hover:scale-[1.02] max-w-xs overflow-hidden transition-all hover:shadow-md border border-gray-200 rounded-md p-2">
      <div className="relative h-24 md:h-28 w-full">
        <Image
          src={product.image || "/placeholder.svg?height=128&width=256"}
          alt={product.name}
          fill
          onClick={() =>
            Swal.fire({
              showConfirmButton: false,
              showCancelButton: false,
              showCloseButton: true,
              html: `
                <div class="flex justify-center items-center">
                  <img
                    src="${product.image || "/placeholder.svg?height=128&width=256"}"
                    alt="${product.name}"
                    class="object-cover rounded"
                  />
                </div>
              `,
            })           
          }
          className="object-cover rounded"
          priority
        />
      </div>
      <CardContent className="p-2 pt-0 text-xs text-gray-600">
        <h3 className="font-semibold text-base line-clamp-1">{product.name}</h3>
        <p>
          Provider: <span className="font-medium">{product.providerId}</span>
        </p>
      </CardContent>
      <CardFooter className="p-2 pt-0 flex justify-between items-center">
        <Badge className="text-sm" variant="secondary">
          ${product.price.toFixed(2)}
        </Badge>
        <Button
          variant={"default"}
          onClick={() => {
            const newItems = isAdded
              ? value.filter((id) => id !== product.id)
              : [...value, product.id];
            onValueChange(newItems);
          }}
          className={isAdded ? "bg-red-500 text-white hover:bg-red-800" : ""}
        >
          {isAdded ? "- Remove" : "+ Add"}
        </Button>
      </CardFooter>
    </Card>
  );
}
