import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        {/* Order Confirmation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-elegant font-bold text-green-600">
              Order Confirmed!
            </CardTitle>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/10 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-2">Order #{orderId}</h3>
              <p className="text-muted-foreground">
                We've sent a confirmation email with your order details.
              </p>
            </div>

            {/* Order Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Order Placed</p>
                  <p className="text-sm text-muted-foreground">Your order has been confirmed</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">Processing</p>
                  <p className="text-sm text-muted-foreground">We're preparing your order</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">Shipping</p>
                  <p className="text-sm text-muted-foreground">Your order will be shipped soon</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Order Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  You'll receive tracking information once your order ships.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Customer Support</h4>
                <p className="text-sm text-muted-foreground">
                  Need help? Contact our support team for assistance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/')} 
            className="btn-cosmetics"
          >
            <Home className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/products')}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Browse Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage; 