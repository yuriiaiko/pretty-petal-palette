import { useEffect, useState } from "react";
import API from "../api/api";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner"; // ✅ toast import

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    API.get("/product")
      .then(res => {
        setProducts(res.data);
        console.log("Fetched products:", res.data);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="py-16 px-4 md:px-12">
      <h2 className="text-4xl font-bold text-center mb-12">Our Products</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <Card
            key={product.id}
            className="card-cosmetics overflow-hidden group transition-shadow hover:shadow-lg"
          >
            <div className="aspect-square bg-gradient-to-br from-secondary to-accent relative overflow-hidden">
              <img
                src={`https://localhost:7089${product.imageUrl}`}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <Button size="icon" variant="ghost" className="bg-white/70 hover:bg-white">
                  <Heart className="w-4 h-4 text-pink-500" />
                </Button>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span>(120)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                <Button
                  size="sm"
                  className="btn-cosmetics"
                  onClick={() => {
                    addToCart(product);
                    toast.success(`${product.name} added to cart`); // ✅ toast here
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
