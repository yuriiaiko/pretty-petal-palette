import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star, Filter, X, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId?: number;
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryId = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching products...');
        const response = await API.get("/product");
        
        console.log("Fetched products:", response.data);
        // Log image URLs for debugging
        response.data.forEach((product: Product) => {
          console.log(`Product: ${product.name}, Image URL: ${product.imageUrl}, Full URL: ${getImageUrl(product.imageUrl)}`);
        });
        setProducts(response.data);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setError(error.response?.data?.message || error.message || 'Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on category
  useEffect(() => {
    if (categoryId) {
      const filtered = products.filter(product => product.categoryId === parseInt(categoryId));
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, categoryId]);

  const clearFilter = () => {
    navigate('/products');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Products</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const displayProducts = categoryId ? filteredProducts : products;

  return (
    <div className="py-16 px-4 md:px-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold">
          {categoryId ? `Category Products` : 'Our Products'}
        </h2>
        {categoryId && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                Filtered by category
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilter}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filter
            </Button>
          </div>
        )}
      </div>

      {displayProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {categoryId ? 'No products in this category' : 'No products found'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {categoryId ? 'Try selecting a different category or check back later.' : 'Products will be available soon.'}
          </p>
          {categoryId && (
            <Button onClick={clearFilter} variant="outline">
              View All Products
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayProducts.map(product => (
            <Card
              key={product.id}
              className="card-cosmetics overflow-hidden group transition-shadow hover:shadow-lg"
            >
              <div className="aspect-square bg-gradient-to-br from-secondary to-accent relative overflow-hidden">
                <img
                  src={getImageUrl(product.imageUrl)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.log(`Failed to load image: ${getImageUrl(product.imageUrl)}`);
                    console.log(`Original imageUrl: ${product.imageUrl}`);
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.classList.remove('hidden');
                    }
                  }}
                  onLoad={() => {
                    console.log(`Successfully loaded image: ${getImageUrl(product.imageUrl)}`);
                  }}
                />
                {/* Fallback placeholder */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 hidden absolute inset-0">
                  <div className="text-center">
                    <ShoppingBag className="w-12 h-12 text-primary/60 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{product.name}</p>
                  </div>
                </div>
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
                      toast.success(`${product.name} added to cart`);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
