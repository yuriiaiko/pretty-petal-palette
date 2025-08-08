import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/lib/utils";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-elegant font-bold mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p className="mb-4">Your cart is empty.</p>
          <Link to="/products">
            <Button className="btn-cosmetics">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {cartItems.map(item => (
            <div key={item.id} className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white shadow-md rounded-lg">
              <div className="flex items-center gap-4 w-full md:w-2/3">
                <img
                  src={getImageUrl(item.imageUrl)}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-muted-foreground text-sm">${item.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-1 border rounded text-lg"
                  disabled={item.quantity === 1}
                >-</button>
                <span className="text-lg font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-1 border rounded text-lg"
                >+</button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-primary">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                  <Trash className="w-5 h-5 text-red-500" />
                </Button>
              </div>
            </div>
          ))}

          <div className="text-right mt-8">
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            <Button className="btn-cosmetics mt-4 px-8 py-3 text-lg">Proceed to Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
