import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import ManageProfiles from './pages/ManageProfiles';
import ManageEnquiries from './pages/ManageEnquiries';

const ProtectedAdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Admin...</div>;
    
    return user && user.role === 'admin' ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="profiles" element={<ManageProfiles />} />
        <Route path="enquiries" element={<ManageEnquiries />} />
      </Route>
    </Routes>
  );
}

export default App;
