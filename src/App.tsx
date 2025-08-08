// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import ProductList from "./pages/ProductList";
import CartPage from "./pages/CartPage";
import CategoriesPage from "./pages/CategoriesPage";
import Layout from "./layout/Layout";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext"; // ✅
import ProtectedRoute from "./components/ProtectedRoute"; // ✅

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider> {/* ✅ Wrap entire app */}
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/categories" element={<CategoriesPage />} />
                {/* ✅ Protect cart route */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
