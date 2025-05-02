import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full hover:scale-[1.02] max-w-xs overflow-hidden transition-all hover:shadow-md border border-gray-200 rounded-md p-2">
      <div className="relative h-24 md:h-28 w-full">
        <Image
          src={product.image || "/placeholder.svg?height=128&width=256"}
          alt={product.name}
          fill
          className="object-cover rounded"
          priority
        />
      </div>
      <CardContent className="p-2 pt-0 text-xs text-gray-600">
        <h3 className="font-semibold text-base line-clamp-1">{product.name}</h3>
        <p>Provider: <span className="font-medium">{product.providerId}</span></p>
      </CardContent>
      <CardFooter className="p-2 pt-0 flex justify-between items-center">
        <Badge className="text-sm" variant="secondary">
          ${product.price.toFixed(2)}
        </Badge>
        <button className="text-xs font-medium text-blue-600 hover:underline">
          Details
        </button>
      </CardFooter>
    </Card>
  )
}