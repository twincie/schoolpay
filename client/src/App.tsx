import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import pages
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Students from './pages/Students';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import Login from './pages/login';
// import Home from './pages/Home';
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper for nested routes
const ProtectedRouteWrapper = () => {
  const { user, isLoading } = useAuth();

  console.log('ProtectedRouteWrapper - isLoading:', isLoading, 'user:', !!user);

  // If still loading, show nothing (or a loading spinner) to prevent flash redirect
  if (isLoading) {
    console.log('ProtectedRouteWrapper - still loading, returning null');
    return null; // or <div>Loading...</div>
  }

  // Only redirect to login if user is null AND not loading
  if (!user) {
    console.log('ProtectedRouteWrapper - no user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRouteWrapper - user authenticated, showing outlet');
  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
        {/* <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/students" element={<Students />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes> */}

         <Routes>
           {/* Public routes */}
           <Route path="/login" element={<Login />} />

           {/* Protected routes – only accessible when logged in */}
           <Route element={<ProtectedRouteWrapper />}>
             <Route path="/" element={<Dashboard />} />
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/categories" element={<Categories />} />
             <Route path="/students" element={<Students />} />
             <Route path="/payments" element={<Payments />} />
             <Route path="/reports" element={<Reports />} />
             <Route path="/logOut" element={<Reports />} />
           </Route>

           {/* Optional: redirect old /home → dashboard */}
           <Route path="/home" element={<Navigate to="/" />} />

           {/* 404 */}
           <Route path="*" element={<NotFound />} />
         </Routes>
        
        
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          aria-label="Notifications"
        />
      </div>
  );
};

export default App;