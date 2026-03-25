import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import NotificationsPage from "./pages/NotificationsPage";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FloatingBottomNav } from "@/components/home/FloatingBottomNav";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";

import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SearchPage from "./pages/SearchPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import ReservationsPage from "./pages/ReservationsPage";
import ReservationHistoryPage from "./pages/ReservationHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import SettingsPage from "./pages/SettingsPage";
import HelpSupportPage from "./pages/HelpSupportPage";
import ManageAddressPage from "./pages/ManageAddressPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";
import OffersPage from "./pages/OffersPage";
import NotFound from "./pages/NotFound";

// Info pages
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import TermsPage from "./pages/TermsPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminReports from "./pages/admin/AdminReports";
import AdminContent from "./pages/admin/AdminContent";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/home" replace />;
  return <>{children}</>;
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthInitializer>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/reservations" element={<AdminRoute><AdminReservations /></AdminRoute>} />
            <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
            <Route path="/admin/content" element={<AdminRoute><AdminContent /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            
            {/* Customer Routes */}
            <Route path="/*" element={
              <div className="max-w-md mx-auto bg-background min-h-screen relative">
                <Routes>
                  <Route path="/" element={<SplashPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                  <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
                  <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
                  <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                  <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                  <Route path="/order-history" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
                  <Route path="/orders/:orderId" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
                  <Route path="/reservations" element={<ProtectedRoute><ReservationsPage /></ProtectedRoute>} />
                  <Route path="/reservation-history" element={<ProtectedRoute><ReservationHistoryPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                  <Route path="/help-support" element={<ProtectedRoute><HelpSupportPage /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                  <Route path="/manage-address" element={<ProtectedRoute><ManageAddressPage /></ProtectedRoute>} />
                  <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethodsPage /></ProtectedRoute>} />
              <Route path="/offers" element={<ProtectedRoute><OffersPage /></ProtectedRoute>} />
                  <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
                  <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
                  <Route path="/faq" element={<ProtectedRoute><FAQPage /></ProtectedRoute>} />
                  <Route path="/terms" element={<ProtectedRoute><TermsPage /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <FloatingBottomNav />
              </div>
            } />
          </Routes>
        </AuthInitializer>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
