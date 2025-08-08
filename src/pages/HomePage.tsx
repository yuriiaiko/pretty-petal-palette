import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Sparkles, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getImageUrl } from '@/lib/utils';
import API from '@/api/api';
import { toast } from 'sonner';
import heroImage from '@/assets/hero-cosmetics.jpg';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId?: number;
}

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching featured products for homepage...');
        const response = await API.get('/product');
        
        // Take the first 6 products as featured products
        const products = response.data.slice(0, 6);
        console.log('Featured products:', products);
        setFeaturedProducts(products);
      } catch (error: any) {
        console.error('Error fetching featured products:', error);
        setError(error.response?.data?.message || error.message || 'Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 hero-gradient opacity-70"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="animate-float">
            <Sparkles className="w-16 h-16 text-white mx-auto mb-6 animate-glow-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-elegant font-bold text-white mb-6 leading-tight">
            Beauty That
            <span className="block font-script text-6xl md:text-8xl text-primary-glow">
              Inspires
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover premium cosmetics and beauty products that enhance your natural radiance
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="btn-cosmetics text-lg px-8 py-4">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Now
              </Button>
            </Link>
            <Link to="/categories">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
              >
                Explore Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-elegant font-bold text-foreground mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience luxury beauty with our curated collection of premium products
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-cosmetics text-center p-8">
              <CardContent className="pt-6">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Only the finest ingredients and materials for exceptional results
                </p>
              </CardContent>
            </Card>

            <Card className="card-cosmetics text-center p-8">
              <CardContent className="pt-6">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Trending Products</h3>
                <p className="text-muted-foreground">
                  Stay ahead with the latest beauty trends and innovations
                </p>
              </CardContent>
            </Card>

            <Card className="card-cosmetics text-center p-8">
              <CardContent className="pt-6">
                <Star className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">5-Star Service</h3>
                <p className="text-muted-foreground">
                  Exceptional customer service and satisfaction guaranteed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-elegant font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover our most loved beauty essentials
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading featured products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Error Loading Products</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
              <p className="text-muted-foreground">
                Check back soon for our latest products.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="card-cosmetics overflow-hidden group">
                  <div className="aspect-square bg-gradient-to-br from-secondary to-accent relative overflow-hidden">
                    <img 
                      src={getImageUrl(product.imageUrl)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        console.log(`Failed to load image: ${getImageUrl(product.imageUrl)}`);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.classList.remove('hidden');
                        }
                      }}
                    />
                    {/* Fallback placeholder */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 hidden absolute inset-0">
                      <div className="text-center">
                        <ShoppingBag className="w-12 h-12 text-primary/60 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{product.name}</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        (120)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button 
                        size="sm" 
                        className="btn-cosmetics"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline" className="px-8">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-elegant font-bold mb-4">
            Stay Beautiful
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter for exclusive offers and beauty tips
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="input-cosmetics flex-1"
            />
            <Button className="btn-cosmetics whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;