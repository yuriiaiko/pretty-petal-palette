import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Sparkles } from 'lucide-react';
import API from '@/api/api';

interface Category {
  id: number;
  name: string;
  description?: string;
  products?: any[] | null;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching categories...');
        const response = await API.get('/category');
        
        console.log('Categories response:', response.data);
        setCategories(response.data);
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        setError(error.response?.data?.message || error.message || 'Failed to fetch categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Categories</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-elegant font-bold text-foreground mb-4">
            Product Categories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of beauty and cosmetics categories
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No Categories Found</h2>
              <p className="text-muted-foreground">
                No categories are available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Card key={category.id} className="card-cosmetics overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-secondary to-accent relative overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <ShoppingBag className="w-12 h-12 text-primary/60" />
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    {category.description && (
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {category.products ? category.products.length : 0} products
                      </span>
                      <Link to={`/products?category=${category.id}`}>
                        <Button size="sm" className="btn-cosmetics">
                          View Products
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage; 