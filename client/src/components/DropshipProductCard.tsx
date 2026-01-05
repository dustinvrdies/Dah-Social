import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Package, ShoppingCart } from "lucide-react";
import type { DropshipProduct } from "@shared/dropshipTypes";

interface DropshipProductCardProps {
  product: DropshipProduct;
}

export function DropshipProductCard({ product }: DropshipProductCardProps) {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <Card className="overflow-visible hover-elevate" data-testid={`card-product-${product.id}`}>
      <div className="flex gap-4 p-4">
        <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <h3 className="font-semibold text-sm line-clamp-1" data-testid="text-product-title">
                {product.title}
              </h3>
              <p className="text-xs text-muted-foreground">{product.brand}</p>
            </div>
            <Badge variant="secondary" className="text-xs whitespace-nowrap">
              {product.category}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary" data-testid="text-product-price">
                ${discountedPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    -{Math.round(product.discountPercentage)}%
                  </Badge>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                {product.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button 
              size="sm" 
              variant="outline"
              disabled={product.stock === 0}
              data-testid={`button-add-cart-${product.id}`}
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
