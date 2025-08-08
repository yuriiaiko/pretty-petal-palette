import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Heart, Lock, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/api';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form data
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { email: formData.email, password: '***' });
      
      // First, let's check if the API is reachable
      try {
        const healthCheck = await API.get('/health');
        console.log('API health check:', healthCheck.data);
      } catch (healthError) {
        console.log('Health check failed (this is normal if endpoint doesn\'t exist):', healthError.message);
      }
      
      const response = await API.post('/auth/login', formData);
      
      console.log('Login response:', response.data);

      // Handle different response formats
      let user, token;
      
      // Check for different possible response structures
      if (response.data?.user && response.data?.token) {
        // Format: { user: {...}, token: "..." }
        user = response.data.user;
        token = response.data.token;
      } else if (response.data?.data?.user && response.data?.data?.token) {
        // Format: { data: { user: {...}, token: "..." } }
        user = response.data.data.user;
        token = response.data.data.token;
      } else if (response.data?.accessToken) {
        // Format: { accessToken: "...", user: {...} }
        token = response.data.accessToken;
        user = response.data.user || response.data;
      } else if (response.data?.token) {
        // Format: { token: "...", ...userData }
        token = response.data.token;
        user = { ...response.data };
        delete user.token; // Remove token from user object
      } else {
        // If no specific format matches, try to extract from response
        console.log('Unexpected response format:', response.data);
        throw new Error("Unexpected response format from server");
      }

      if (!token) {
        throw new Error("No token received from server");
      }

      // Use the AuthContext to handle login
      login(token, user);

      toast({
        title: `Welcome back, ${user.name || user.email || user.username || 'User'}!`,
        description: "You have successfully logged in.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Something went wrong. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific error cases
      if (error.response?.status === 401) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.response?.status === 404) {
        errorMessage = "Login endpoint not found. Please check the API configuration.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = "Cannot connect to server. Please check if the backend is running.";
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/20 to-accent/20 p-4">
      <Card className="w-full max-w-md card-cosmetics">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-elegant font-bold">
            Welcome Back
          </CardTitle>
          <p className="text-muted-foreground">Sign in to your beauty account</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-cosmetics pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-cosmetics pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-primary hover:text-primary-glow transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full btn-cosmetics" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary-glow font-medium transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
