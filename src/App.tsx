import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { EnquiryForm } from './pages/EnquiryForm';
import { ThankYou } from './pages/ThankYou';
import { Login } from './pages/Login';
import { RequireAuth } from './components/auth/RequireAuth';
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { EnquiryList } from './pages/admin/EnquiryList';
import { EnquiryDetail } from './pages/admin/EnquiryDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/enquiry" element={<EnquiryForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/login" element={<Login />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="enquiries" element={<EnquiryList />} />
          <Route path="enquiries/:id" element={<EnquiryDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
