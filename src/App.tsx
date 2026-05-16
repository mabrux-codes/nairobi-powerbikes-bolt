import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import BikesPage from './pages/BikesPage';
import BikeDetailPage from './pages/BikeDetailPage';
import BookingPage from './pages/BookingPage';
import AboutPage from './pages/AboutPage';
import BrandsPage from './pages/BrandsPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import AuthPage from './pages/AuthPage';

import CustomerDashboard, {
  DashboardHome, DashboardWishlist, DashboardBookings, DashboardInquiries, DashboardProfile,
} from './pages/CustomerDashboard';

import AdminDashboard, {
  AdminHome, AdminBikes, AdminBookings, AdminInquiries, AdminCustomers, AdminBlogPosts, AdminSettings,
} from './pages/AdminDashboard';

function AppLayout() {
  const { pathname } = useLocation();
  const hideFooter = pathname.startsWith('/auth') || pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bikes" element={<BikesPage />} />
        <Route path="/bikes/:slug" element={<BikeDetailPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<CustomerDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="wishlist" element={<DashboardWishlist />} />
          <Route path="bookings" element={<DashboardBookings />} />
          <Route path="inquiries" element={<DashboardInquiries />} />
          <Route path="profile" element={<DashboardProfile />} />
        </Route>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="bikes" element={<AdminBikes />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="blog" element={<AdminBlogPosts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
