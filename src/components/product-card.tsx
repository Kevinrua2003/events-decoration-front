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
import {Slider} from "@/components/ui/slider"
import { Label } from "./ui/label";
import { ContractedProduct } from "./client-data";

interface ProductCardProps {
  product: Product;
  value: ContractedProduct[];
  onValueChange: (item: ContractedProduct[]) => void;
}

export function ProductCard({
  product,
  value,
  onValueChange,
}: ProductCardProps) {
  const isAdded = value.some(item => item.prodId === product.id);

  const [quantity, setQuantity] = useState<number>(1);

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
      <CardContent className="p-2 pt-0 text-xs text-gray-600 justify-center items-center text-center">
        <h3 className="font-semibold text-base line-clamp-1">{product.name}</h3>
        <Badge className="text-sm m-0.5" variant="secondary">
            ${product.price.toFixed(2)}
        </Badge> 
        <div className="flex flex-row">
          <Slider id="slider" max={99} min={1} onValueChange={(value: number[]) => setQuantity(value[0])} value={[quantity]} step={1} className="ml-2 mr-2"/>   
          <Label>{quantity}</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center items-center">        
        <Button
          variant={"default"}
          onClick={() => {
            const newItems = isAdded
              ? value.filter((item) => item.prodId !== product.id)
              : [...value, {prodId: product.id, quantity: quantity, price: product.price}];
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
