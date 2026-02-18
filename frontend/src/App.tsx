import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import CustomerLayout from './components/CustomerLayout';
import HomePage from './pages/HomePage';
import PickupPage from './pages/PickupPage';
import TrackingPage from './pages/TrackingPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import SettingsPage from './pages/admin/SettingsPage';
import ServicesPage from './pages/admin/ServicesPage';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes - wrapped with CustomerLayout for shared Navbar */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/pickup" element={<PickupPage />} />
            <Route path="/track/:trackingId" element={<TrackingPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<ServicesPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
